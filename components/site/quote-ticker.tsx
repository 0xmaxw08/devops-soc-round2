const quotes = [
  "I don't have bugs. I have deployments.",
  "When you're backed against the wall — roll back.",
  'Winners write postmortems. Losers write excuses.',
  "It's not about the code. It's about the pipeline.",
  "You just got Linted.",
  "I'm on-call. I know everything.",
  'Anyone can deploy on Friday. Only a closer does it at 4:59.',
]

export function QuoteTicker() {
  const row = [...quotes, ...quotes]
  return (
    <section aria-label="Firm sayings" className="overflow-hidden border-y border-border bg-gold py-4 text-ink">
      <ul className="flex w-max animate-marquee gap-12">
        {row.map((q, i) => (
          <li
            key={i}
            aria-hidden={i >= quotes.length}
            className="flex shrink-0 items-center gap-12 font-serif text-2xl italic"
          >
            {q}
            <span className="font-mono text-sm not-italic">§</span>
          </li>
        ))}
      </ul>
    </section>
  )
}
