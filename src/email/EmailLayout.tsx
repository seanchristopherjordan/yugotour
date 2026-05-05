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
}

export function EmailLayout({ preheader, logoUrl, signatureUrl, bodyHtml }: EmailLayoutProps) {
  return (
    <Html>
      <Head />
      {preheader && <Preview>{preheader}</Preview>}
      <Body style={bodyStyle}>
        <Container style={containerStyle}>
          {logoUrl && (
            <Section style={logoSection}>
              <Img src={logoUrl} alt="Yugotour" width={180} style={{ display: 'block' }} />
            </Section>
          )}

          <Section style={contentSection}>
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

const bodyStyle: React.CSSProperties = {
  backgroundColor: '#f5f0e8',
  fontFamily: 'Arial, Helvetica, sans-serif',
  margin: 0,
  padding: '24px 0',
}

const containerStyle: React.CSSProperties = {
  backgroundColor: '#ffffff',
  maxWidth: '600px',
  margin: '0 auto',
  borderRadius: '4px',
  overflow: 'hidden',
}

const logoSection: React.CSSProperties = {
  backgroundColor: '#003882',
  padding: '24px 32px',
}

const contentSection: React.CSSProperties = {
  padding: '32px',
  color: '#1a1a1a',
  fontSize: '15px',
  lineHeight: '1.6',
}

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
