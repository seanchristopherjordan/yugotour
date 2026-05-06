import {
  Body,
  Container,
  Head,
  Html,
  Img,
  Preview,
  Section,
  Text,
  Hr,
} from '@react-email/components'
import * as React from 'react'

interface EmailLayoutProps {
  preheader?: string
  logoUrl?: string | null
  signatureUrl?: string | null
  bodyHtml: string
  variant?: 'guest' | 'staff'
}

export function EmailLayout({ preheader, logoUrl, signatureUrl, bodyHtml, variant = 'guest' }: EmailLayoutProps) {
  const isStaff = variant === 'staff'
  return (
    <Html>
      <Head />
      {preheader && <Preview>{preheader}</Preview>}
      <Body style={isStaff ? bodyStyleStaff : bodyStyleGuest}>
        <Container style={isStaff ? containerStyleStaff : containerStyleGuest}>
          <Section style={isStaff ? logoSectionStaff : logoSectionGuest}>
            {logoUrl && (
              <Img src={logoUrl} alt="Yugotour" width={isStaff ? 180 : 108} style={{ display: 'block' }} />
            )}
          </Section>

          <Section style={isStaff ? contentSectionStaff : contentSectionGuest}>
            {/* Inject pre-serialized HTML from Lexical body */}
            <div dangerouslySetInnerHTML={{ __html: bodyHtml }} />
          </Section>

          {signatureUrl && (
            <>
              <Hr style={divider} />
              <Section style={signatureSection}>
                <Img src={signatureUrl} alt="Signature" width={200} style={{ display: 'block' }} />
              </Section>
            </>
          )}

          <Hr style={divider} />
          <Text style={footerText}>
            Yugotour · {new Date().getFullYear()}
          </Text>
        </Container>
      </Body>
    </Html>
  )
}

// ── Guest styles (new) ────────────────────────────────────────────────────────

const bodyStyleGuest: React.CSSProperties = {
  backgroundColor: '#c6363b',
  fontFamily: 'Georgia, "Times New Roman", Times, serif',
  margin: 0,
  padding: '24px 0',
}

const containerStyleGuest: React.CSSProperties = {
  backgroundColor: '#fbf9ec',
  maxWidth: '600px',
  margin: '0 auto',
  borderRadius: '4px',
  overflow: 'hidden',
}

const logoSectionGuest: React.CSSProperties = {
  backgroundColor: '#003882',
  padding: '14px 32px',
}

const contentSectionGuest: React.CSSProperties = {
  padding: '32px',
  color: '#212121',
  fontSize: '15px',
  lineHeight: '1.6',
  fontFamily: 'Georgia, "Times New Roman", Times, serif',
}

// ── Staff styles (original) ───────────────────────────────────────────────────

const bodyStyleStaff: React.CSSProperties = {
  backgroundColor: '#f5f0e8',
  fontFamily: 'Arial, Helvetica, sans-serif',
  margin: 0,
  padding: '24px 0',
}

const containerStyleStaff: React.CSSProperties = {
  backgroundColor: '#ffffff',
  maxWidth: '600px',
  margin: '0 auto',
  borderRadius: '4px',
  overflow: 'hidden',
}

const logoSectionStaff: React.CSSProperties = {
  backgroundColor: '#003882',
  padding: '24px 32px',
}

const contentSectionStaff: React.CSSProperties = {
  padding: '32px',
  color: '#1a1a1a',
  fontSize: '15px',
  lineHeight: '1.6',
  fontFamily: 'Arial, Helvetica, sans-serif',
}

// ── Shared ────────────────────────────────────────────────────────────────────

const signatureSection: React.CSSProperties = {
  padding: '0 32px 24px',
}

const divider: React.CSSProperties = {
  borderColor: '#e0d8cc',
  margin: '0 32px',
}

const footerText: React.CSSProperties = {
  color: '#999',
  fontSize: '12px',
  textAlign: 'center',
  padding: '16px 32px',
  margin: 0,
}
