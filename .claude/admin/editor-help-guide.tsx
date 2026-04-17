import styles from '@/app/admin/admin.module.css'

interface EditorHelpGuideProps {
  title?: string
}

export function EditorHelpGuide({
  title = 'Publishing guide',
}: EditorHelpGuideProps) {
  return (
    <aside className={styles.guideCard}>
      <div className={styles.guideHeader}>
        <p className={styles.eyebrow}>Workflow</p>
        <h2 className={styles.panelTitle}>{title}</h2>
        <p className={styles.panelIntro}>
          Use this as the default Whiteprint publishing flow while we move everything into
          admin.
        </p>
      </div>

      <details className={styles.guideDetails} open>
        <summary className={styles.guideSummary}>1. Standard post workflow</summary>
        <div className={styles.guideBody}>
          <ol className={styles.guideList}>
            <li>Start with title, summary, topic, and publish status.</li>
            <li>Paste the full MDX body if the article already exists in the repo.</li>
            <li>Link an existing stance if one exists, or use the coverage page to create one.</li>
            <li>Mark `Featured` or `Homepage candidate` only when it should appear in homepage controls.</li>
            <li>Publish when the copy, stance link, and model link all look right.</li>
          </ol>
        </div>
      </details>

      <details className={styles.guideDetails}>
        <summary className={styles.guideSummary}>2. How title accents work</summary>
        <div className={styles.guideBody}>
          <p className={styles.helpText}>
            The first word of the title is automatically styled with the red accent on the
            live article.
          </p>
          <p className={styles.helpText}>
            If you want a specific phrase red instead, wrap it in asterisks in the title.
          </p>
          <pre className={styles.guideCode}>
            <code>{`Oracle: When Software Margins Meet *Infrastructure Capex*`}</code>
          </pre>
        </div>
      </details>

      <details className={styles.guideDetails}>
        <summary className={styles.guideSummary}>3. Supported article format</summary>
        <div className={styles.guideBody}>
          <p className={styles.helpText}>
            You can paste either normal prose or a full Whiteprint MDX file with YAML
            frontmatter. Frontmatter stays inside the stored `body_mdx` and drives the
            public renderer the same way it did before.
          </p>
          <pre className={styles.guideCode}>
            <code>{`---
title: "Example Title"
date: "2026-04-02"
category: "market-notes"
tags: ["macro", "rates"]
excerpt: "One-line summary."
readTime: 5
---

## Thesis

Main body copy here.`}</code>
          </pre>
        </div>
      </details>

      <details className={styles.guideDetails}>
        <summary className={styles.guideSummary}>4. Tables and Whiteprint components</summary>
        <div className={styles.guideBody}>
          <p className={styles.helpText}>
            Existing MDX components still work. Use `ResearchTable` for the styled table
            wrapper and `StatGrid`, `DisclaimerBox`, `PullQuote`, `ScenarioGrid`, and
            `ScenarioCard` the same way as before.
          </p>
          <pre className={styles.guideCode}>
            <code>{`<ResearchTable caption="Optional caption">
  <table>
    <thead>
      <tr>
        <th>Metric</th>
        <th>Value</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td>Revenue</td>
        <td>$22.2B</td>
      </tr>
    </tbody>
  </table>
</ResearchTable>`}</code>
          </pre>
        </div>
      </details>

      <details className={styles.guideDetails}>
        <summary className={styles.guideSummary}>5. Migration to full admin control</summary>
        <div className={styles.guideBody}>
          <p className={styles.helpText}>
            Use the archive sync on the posts page to import filesystem articles into the
            database. The sync preserves frontmatter inside MDX, creates or updates stance
            records when ticker and stance metadata exist, and suppresses the old
            filesystem fallback from the public site.
          </p>
        </div>
      </details>
    </aside>
  )
}
