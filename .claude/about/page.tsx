import type { Metadata } from 'next'
import { getPublicAboutSettings, getPublicGeneralSettings } from '@/lib/public-site'
import { SEO_CONFIG } from '@/lib/seo.config'

const MONO = '"JetBrains Mono", monospace'
const DISPLAY = '"Playfair Display", Georgia, serif'
const SERIF = '"Source Serif 4", Georgia, serif'

const v = {
  accent: '#b83025',
  bg: '#f7f6f3',
  border: '#dedad4',
  borderLight: '#eceae5',
  ink: '#0a0a0a',
  muted: '#555',
  subtle: '#8a8a8a',
  surface: '#fff',
}

export async function generateMetadata(): Promise<Metadata> {
  const [about, general] = await Promise.all([
    getPublicAboutSettings(),
    getPublicGeneralSettings(),
  ])

  return {
    title: 'About',
    description: about.introParagraphs[0] || general.siteDescription,
    alternates: {
      canonical: `${SEO_CONFIG.siteUrl}/about`,
    },
  }
}

export default async function AboutPage() {
  const [about, settings] = await Promise.all([
    getPublicAboutSettings(),
    getPublicGeneralSettings(),
  ])
  const contactEmail = settings.contactEmail || 'contact@whiteprintresearch.xyz'

  return (
    <div style={{ background: v.bg, minHeight: '100vh' }}>
      <div
        style={{
          background: v.surface,
          borderBottom: `1px solid ${v.border}`,
          padding: '56px 40px 48px',
        }}
      >
        <div style={{ margin: '0 auto', maxWidth: 780 }}>
          <div
            style={{
              color: v.subtle,
              fontFamily: MONO,
              fontSize: 9,
              letterSpacing: '0.28em',
              marginBottom: 16,
              textTransform: 'uppercase',
            }}
          >
            About
          </div>
          <h1
            style={{
              color: v.ink,
              fontFamily: DISPLAY,
              fontSize: 'clamp(28px, 4vw, 44px)',
              fontWeight: 700,
              letterSpacing: '-0.025em',
              lineHeight: 1.1,
              margin: 0,
            }}
          >
            {about.heroTitle}
          </h1>
          <p
            style={{
              color: v.accent,
              fontFamily: MONO,
              fontSize: 9,
              letterSpacing: '0.22em',
              margin: '14px 0 0',
              textTransform: 'uppercase',
            }}
          >
            {settings.brandTagline}
          </p>
        </div>
      </div>

      <div style={{ margin: '0 auto', maxWidth: 780, padding: '0 40px 80px' }}>
        <div style={{ padding: '48px 0 0' }}>
          {about.introParagraphs.map((paragraph, index) => (
            <p
              key={`${paragraph}-${index}`}
              style={{
                color: index === 0 ? v.ink : v.muted,
                fontFamily: SERIF,
                fontSize: index === 0 ? 17 : 16,
                lineHeight: 1.75,
                margin: index === about.introParagraphs.length - 1 ? '0 0 32px' : '0 0 20px',
                maxWidth: 660,
              }}
            >
              {paragraph}
            </p>
          ))}

          <p
            style={{
              color: v.muted,
              fontFamily: SERIF,
              fontSize: 16,
              lineHeight: 1.75,
              margin: '0 0 20px',
              maxWidth: 660,
            }}
          >
            {about.scheduleIntro}
          </p>

          <div
            style={{
              borderLeft: `2px solid ${v.accent}`,
              display: 'flex',
              flexDirection: 'column',
              gap: 10,
              marginBottom: 0,
              paddingLeft: 24,
            }}
          >
            {about.scheduleItems.map((item) => (
              <div key={`${item.day}-${item.topic}`} style={{ alignItems: 'baseline', display: 'flex', gap: 16 }}>
                <span
                  style={{
                    color: v.accent,
                    flexShrink: 0,
                    fontFamily: MONO,
                    fontSize: 9,
                    letterSpacing: '0.18em',
                    textTransform: 'uppercase',
                    width: 80,
                  }}
                >
                  {item.day}
                </span>
                <span
                  style={{
                    color: v.ink,
                    fontFamily: SERIF,
                    fontSize: 15,
                    lineHeight: 1.5,
                  }}
                >
                  {item.topic}
                </span>
              </div>
            ))}
          </div>

          <p
            style={{
              color: v.muted,
              fontFamily: SERIF,
              fontSize: 15,
              fontStyle: 'italic',
              lineHeight: 1.7,
              marginTop: 32,
            }}
          >
            {about.researchAvailabilityNote}
          </p>
        </div>

        <Section title="How we work">
          {about.howWeWork.map((paragraph, index) => (
            <p key={`${paragraph}-${index}`}>{paragraph}</p>
          ))}
        </Section>

        <Section title="What we believe">
          {about.whatWeBelieve.map((paragraph, index) => (
            <p key={`${paragraph}-${index}`}>{paragraph}</p>
          ))}
        </Section>

        <Section title="Where we are">
          {about.whereWeAre.map((paragraph, index) => (
            <p key={`${paragraph}-${index}`}>{paragraph}</p>
          ))}
        </Section>

        <Section title="Contact">
          <p>{about.contactIntro}</p>
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: 12,
              marginTop: 4,
            }}
          >
            <div>
              <span
                style={{
                  color: v.subtle,
                  display: 'block',
                  fontFamily: MONO,
                  fontSize: 9,
                  letterSpacing: '0.18em',
                  marginBottom: 4,
                  textTransform: 'uppercase',
                }}
              >
                Email
              </span>
              <span style={{ color: v.ink, fontFamily: SERIF, fontSize: 15 }}>
                {contactEmail}
              </span>
              <div style={{ marginTop: 10 }}>
                <a
                  href={`mailto:${contactEmail}`}
                  style={{
                    color: v.accent,
                    fontFamily: MONO,
                    fontSize: 9,
                    letterSpacing: '0.16em',
                    textDecoration: 'none',
                    textTransform: 'uppercase',
                  }}
                >
                  {settings.navCtaLabel}
                </a>
              </div>
            </div>

            {about.linkedinUrl ? (
              <div>
                <span
                  style={{
                    color: v.subtle,
                    display: 'block',
                    fontFamily: MONO,
                    fontSize: 9,
                    letterSpacing: '0.18em',
                    marginBottom: 4,
                    textTransform: 'uppercase',
                  }}
                >
                  LinkedIn
                </span>
                <a
                  href={about.linkedinUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ color: v.ink, fontFamily: SERIF, fontSize: 15 }}
                >
                  {about.linkedinLabel}
                </a>
              </div>
            ) : null}

            {about.instagramUrl ? (
              <div>
                <span
                  style={{
                    color: v.subtle,
                    display: 'block',
                    fontFamily: MONO,
                    fontSize: 9,
                    letterSpacing: '0.18em',
                    marginBottom: 4,
                    textTransform: 'uppercase',
                  }}
                >
                  Instagram
                </span>
                <a
                  href={about.instagramUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ color: v.ink, fontFamily: SERIF, fontSize: 15 }}
                >
                  {about.instagramLabel}
                </a>
              </div>
            ) : null}
          </div>
          <p style={{ marginTop: 20 }}>{about.responseNote}</p>
        </Section>

        <div
          style={{
            borderTop: `1px solid ${v.borderLight}`,
            marginTop: 60,
            paddingTop: 28,
          }}
        >
          <p
            style={{
              color: v.subtle,
              fontFamily: MONO,
              fontSize: 10,
              letterSpacing: '0.03em',
              lineHeight: 1.8,
              margin: 0,
              maxWidth: 660,
            }}
          >
            {about.disclaimer}
          </p>
          <p
            style={{
              color: v.subtle,
              fontFamily: MONO,
              fontSize: 10,
              letterSpacing: '0.06em',
              marginTop: 16,
            }}
          >
            {about.copyrightLine}
          </p>
        </div>
      </div>
    </div>
  )
}

function Section({
  title,
  children,
}: {
  title: string
  children: React.ReactNode
}) {
  return (
    <section
      style={{
        borderTop: `1px solid ${v.border}`,
        marginTop: 48,
        paddingTop: 40,
      }}
    >
      <div
        style={{
          alignItems: 'center',
          display: 'flex',
          gap: 16,
          marginBottom: 24,
        }}
      >
        <span
          style={{
            color: v.subtle,
            flexShrink: 0,
            fontFamily: MONO,
            fontSize: 9,
            letterSpacing: '0.28em',
            textTransform: 'uppercase',
          }}
        >
          {title}
        </span>
        <div style={{ background: v.borderLight, flex: 1, height: 1 }} />
      </div>
      <div
        style={{
          color: v.muted,
          display: 'flex',
          flexDirection: 'column',
          fontFamily: SERIF,
          fontSize: 16,
          gap: 16,
          lineHeight: 1.75,
          maxWidth: 660,
        }}
      >
        {children}
      </div>
    </section>
  )
}
