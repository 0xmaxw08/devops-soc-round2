#!/usr/bin/env python3
"""
Apply mobile-layout fixes to the Specter & Ops project.

Run from the project root (the folder that contains package.json):

    python3 apply_mobile_fixes.py        (Windows: python apply_mobile_fixes.py)

Safe to run more than once. Each edit reports one of:
    APPLIED        changed the file
    already done   the fix is already in the file
    NOT FOUND      the original text isn't there (you edited that line) - do it by hand
Review the result with `git diff`. Undo one file with `git checkout -- <file>`.
"""
import re
from pathlib import Path

# ---------- plain text replacements: (file, old, new, description) ----------
EDITS = [
    # 1. no sideways scroll anywhere
    ("app/globals.css",
     "@apply bg-background text-foreground font-sans;",
     "@apply bg-background text-foreground font-sans overflow-x-clip;",
     "globals: stop sideways scroll"),

    # 2. footer wordmark
    ("components/site/site-footer.tsx",
     "text-[18vw]",
     "text-[13vw]",
     "footer: smaller wordmark on phones"),

    # 3. case filter tabs
    ("components/site/case-files.tsx",
     'aria-label="Filter cases by status" className="flex border border-border"',
     'aria-label="Filter cases by status" className="flex w-full overflow-x-auto border border-border md:w-auto"',
     "case files: scrollable filter tabs"),
    ("components/site/case-files.tsx",
     "'px-4 py-2 font-mono",
     "'shrink-0 px-4 py-2 font-mono",
     "case files: tabs don't shrink"),

    # 4. partner cards
    ("components/site/partner-card.tsx",
     "size === 'lg' ? 'aspect-[1.75/1]' : 'aspect-[3/4]'",
     "size === 'lg'\n          ? 'aspect-[4/5] sm:aspect-[3/2] md:aspect-[4/5] lg:aspect-[1.75/1]'\n          : 'aspect-[4/3] sm:aspect-[3/4]'",
     "partner card: taller on phones"),
    ("components/site/partner-card.tsx",
     "size === 'lg' ? 'text-5xl' : 'text-3xl'",
     "size === 'lg' ? 'text-4xl lg:text-5xl' : 'text-3xl'",
     "partner card: name size"),
    ("components/site/partner-card.tsx",
     "size === 'lg' ? 'text-4xl' : 'text-2xl'",
     "size === 'lg' ? 'text-2xl lg:text-4xl' : 'text-2xl'",
     "partner card: quote size"),
    ("components/site/partner-card.tsx",
     "size === 'lg' ? 'size-20 text-4xl' : 'size-14 text-2xl'",
     "size === 'lg' ? 'size-16 text-3xl lg:size-20 lg:text-4xl' : 'size-14 text-2xl'",
     "partner card: initials box"),

    # 5. terminal input (stops iPhone zoom)
    ("components/site/deposition.tsx",
     'className="flex-1 bg-transparent text-foreground outline-none placeholder:text-muted-foreground/60"',
     'className="flex-1 bg-transparent text-base text-foreground outline-none placeholder:text-muted-foreground/60 md:text-[13px]"',
     "terminal: 16px input on phones"),

    # 6. pipeline objection panel
    ("components/site/motion-to-deploy.tsx",
     "absolute inset-x-0 bottom-0 flex flex-col items-start gap-3",
     "flex flex-col items-start gap-3 sm:absolute sm:inset-x-0 sm:bottom-0",
     "pipeline: objection panel below the log on phones"),
    ("components/site/motion-to-deploy.tsx",
     '<div className="flex gap-3">',
     '<div className="flex flex-wrap gap-3">',
     "pipeline: ruling buttons wrap"),

    # 8. Litt Up overlay
    ("components/site/command-palette.tsx",
     "border-8 border-gold px-10 py-6",
     "border-4 border-gold px-6 py-6 md:border-8 md:px-10",
     "Litt Up: smaller border and padding"),
    ("components/site/command-palette.tsx",
     "text-6xl uppercase text-gold md:text-8xl",
     "text-5xl uppercase text-gold md:text-8xl",
     "Litt Up: smaller text"),

    # 9. hero
    ("components/site/hero.tsx",
     "uppercase tracking-[0.3em] text-gold",
     "uppercase tracking-[0.2em] text-gold sm:tracking-[0.3em]",
     "hero: eyebrow letter-spacing"),
    ("components/site/hero.tsx",
     "bg-gradient-to-r from-ink via-ink/85 to-ink/20",
     "bg-gradient-to-b from-ink/80 via-ink/70 to-ink/40 sm:bg-gradient-to-r sm:from-ink sm:via-ink/85 sm:to-ink/20",
     "hero: top-to-bottom overlay on phones"),
]

# ---------- regex replacements: (file, pattern, replacement, marker, description) ----------
HEADER_NEW = """<div className="flex items-center md:hidden">
          <button
            type="button"
            onClick={() => emitFirmEvent(firmEvents.openPalette)}
            aria-label="Open command palette"
            className="p-2"
          >
            <Search className="size-5" aria-hidden="true" />
          </button>
          <button
            type="button"
            className="-mr-2 p-2"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-controls="mobile-nav"
            aria-label={open ? 'Close menu' : 'Open menu'}
          >
            {open ? <X className="size-6" /> : <Menu className="size-6" />}
          </button>
        </div>"""

REGEX_EDITS = [
    # 5b. don't pop the keyboard when tapping a suggested command on touch screens
    ("components/site/deposition.tsx",
     r"execute\(c\)(\s*\n\s*)inputRef\.current\?\.focus\(\{ preventScroll: true \}\)",
     lambda m: "execute(c)" + m.group(1)
     + "if (window.matchMedia('(hover: hover)').matches) inputRef.current?.focus({ preventScroll: true })",
     "(hover: hover)",
     "terminal: no keyboard pop-up on suggested commands"),

    # 7. header: bigger tap targets + search button on phones
    ("components/site/site-header.tsx",
     r'<button\s+type="button"\s+className="md:hidden".*?</button>',
     lambda m: HEADER_NEW,
     "flex items-center md:hidden",
     "header: tap targets and palette button on phones"),
]


def main():
    if not Path("package.json").exists():
        print("Run this from the project root (the folder with package.json).")
        return

    cache = {}

    def load(rel):
        if rel not in cache:
            p = Path(rel)
            cache[rel] = p.read_text(encoding="utf-8") if p.exists() else None
        return cache[rel]

    counts = {"APPLIED": 0, "already done": 0, "NOT FOUND": 0}

    def report(status, rel, desc):
        counts[status] += 1
        print(f"  {status:<13} {rel}  -  {desc}")

    for rel, old, new, desc in EDITS:
        text = load(rel)
        if text is None:
            report("NOT FOUND", rel, desc + " (file missing)")
        elif new in text:
            report("already done", rel, desc)
        elif old in text:
            cache[rel] = text.replace(old, new, 1)
            report("APPLIED", rel, desc)
        else:
            report("NOT FOUND", rel, desc)

    for rel, pattern, repl, marker, desc in REGEX_EDITS:
        text = load(rel)
        if text is None:
            report("NOT FOUND", rel, desc + " (file missing)")
        elif marker in text:
            report("already done", rel, desc)
        else:
            new_text, n = re.subn(pattern, repl, text, count=1, flags=re.DOTALL)
            if n:
                cache[rel] = new_text
                report("APPLIED", rel, desc)
            else:
                report("NOT FOUND", rel, desc)

    for rel, text in cache.items():
        if text is not None and text != Path(rel).read_text(encoding="utf-8"):
            Path(rel).write_text(text, encoding="utf-8")

    print(f"\nDone: {counts['APPLIED']} applied, {counts['already done']} already done, "
          f"{counts['NOT FOUND']} not found.")
    if counts["NOT FOUND"]:
        print("For each NOT FOUND, that line was edited in your copy. Search the file and apply it by hand.")
    print("Next: git diff, then pnpm build.")


if __name__ == "__main__":
    main()
