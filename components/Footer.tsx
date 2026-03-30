import Link from "next/link"

export function Footer() {
  return (
    <footer className="wp-footer">
      <div className="wp-footer-inner">
        <div>
          <div className="wp-footer-brand">Whiteprint</div>
          <p className="wp-footer-tagline">
            Independent equity, macro, and forensic research. No house view. No affiliation.
          </p>
        </div>

        <div className="wp-footer-col">
          <h4>Research</h4>
          <ul>
            <li>
              <Link href="/research">Archive</Link>
            </li>
            <li>
              <Link href="/equity">Equity</Link>
            </li>
            <li>
              <Link href="/macro">Macro</Link>
            </li>
            <li>
              <Link href="/stances">Coverage</Link>
            </li>
          </ul>
        </div>

        <div className="wp-footer-col">
          <h4>Platform</h4>
          <ul>
            <li>
              <Link href="/about">About</Link>
            </li>
            <li>
              <Link href="/models">Models</Link>
            </li>
            <li>
              <Link href="/rss.xml">RSS Feed</Link>
            </li>
          </ul>
        </div>
      </div>

      <div className="wp-footer-bottom">
        © 2026 Whiteprint Research. All content is for informational purposes only and does not
        constitute investment advice or a solicitation to buy or sell any security.
      </div>

      <style jsx>{`
        .wp-footer {
          padding: 52px 48px 32px;
          background: var(--bg);
          border-top: 2px solid var(--accent);
        }

        .wp-footer-inner {
          display: grid;
          grid-template-columns: 1fr 1fr 1fr;
          gap: 48px;
          max-width: 1120px;
          margin: 0 auto 24px;
          padding-bottom: 40px;
          border-bottom: 1px solid var(--border);
        }

        .wp-footer-brand {
          margin-bottom: 10px;
          color: var(--ink);
          font-family: var(--font-display-family), Georgia, serif;
          font-size: 22px;
          font-weight: 700;
          letter-spacing: -0.03em;
        }

        .wp-footer-tagline {
          margin: 0;
          color: var(--muted);
          font-family: var(--font-serif-family), Georgia, serif;
          font-size: 12px;
          font-weight: 300;
          line-height: 1.65;
        }

        .wp-footer-col h4 {
          margin: 0 0 16px;
          color: var(--subtle);
          font-family: var(--font-mono-family), monospace;
          font-size: 8px;
          letter-spacing: 0.24em;
          text-transform: uppercase;
        }

        .wp-footer-col ul {
          margin: 0;
          padding: 0;
          list-style: none;
        }

        .wp-footer-col li {
          margin-bottom: 10px;
        }

        .wp-footer-col a {
          color: var(--muted);
          font-family: var(--font-serif-family), Georgia, serif;
          font-size: 13px;
          font-weight: 300;
          text-decoration: none;
          transition: color 0.15s ease;
        }

        .wp-footer-col a:hover {
          color: var(--ink);
        }

        .wp-footer-bottom {
          max-width: 1120px;
          margin: 0 auto;
          color: var(--subtle);
          font-family: var(--font-mono-family), monospace;
          font-size: 8px;
          letter-spacing: 0.08em;
          line-height: 1.7;
        }

        @media (max-width: 1200px) {
          .wp-footer {
            padding-right: 32px;
            padding-left: 32px;
          }
        }
      `}</style>
    </footer>
  )
}
