import { getPayload } from 'payload'
import configPromise from '@payload-config'
import { convertLexicalToHTML } from '@payloadcms/richtext-lexical/html'
import { render } from '@react-email/render'
import { EmailLayout } from '@/email/EmailLayout'
import type { Media } from '@/payload-types'
// EmailTemplate will be available after next dev regenerates payload-types.ts
type EmailTemplate = Record<string, any>
import * as React from 'react'

export type TemplateKey =
  | 'booking_guest_confirmation'
  | 'booking_staff_belgrade'
  | 'booking_staff_sarajevo'
  | 'contact_staff_notification'

export type TemplateVariables = Record<string, string | number | null | undefined>

function substituteVariables(text: string, vars: TemplateVariables): string {
  return text.replace(/\{\{(\w+)\}\}/g, (_, key) => {
    const val = vars[key]
    return val !== null && val !== undefined ? String(val) : `{{${key}}}`
  })
}

function mediaUrl(field: number | Media | null | undefined): string | null {
  if (!field || typeof field !== 'object') return null
  return (field as Media).url ?? null
}

export async function sendEmail(
  templateKey: TemplateKey,
  variables: TemplateVariables,
  overrideTo?: string | string[],
): Promise<void> {
  const payload = await getPayload({ config: configPromise })

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const result = await (payload.find as any)({
    collection: 'email-templates',
    where: { templateKey: { equals: templateKey } },
    limit: 1,
    depth: 1,
  })

  const template = result.docs[0] as EmailTemplate | undefined
  if (!template) {
    payload.logger.error(`sendEmail: no template found for key "${templateKey}"`)
    return
  }

  const subject = substituteVariables(template.subject ?? '', variables)

  // Serialize Lexical body to HTML
  let rawBodyHtml = ''
  if (template.body) {
    try {
      rawBodyHtml = await convertLexicalToHTML({ data: template.body as any })
    } catch (err) {
      payload.logger.error(`sendEmail: Lexical→HTML failed for "${templateKey}": ${err}`)
      rawBodyHtml = '<p>See booking details in your Yugotour admin.</p>'
    }
  }

  // Substitute variables inside the HTML too (they appear in text nodes)
  const bodyHtml = substituteVariables(rawBodyHtml, variables)

  const logoUrl = mediaUrl(template.logo as number | Media | null | undefined)
  const signatureUrl = mediaUrl(template.signature as number | Media | null | undefined)

  const html = await render(
    React.createElement(EmailLayout, {
      preheader: template.preheader ?? undefined,
      logoUrl,
      signatureUrl,
      bodyHtml,
    }),
  )

  // Determine recipients
  let toAddresses: string[] = []
  if (overrideTo) {
    toAddresses = Array.isArray(overrideTo) ? overrideTo : [overrideTo]
  } else {
    const recipients = (template.recipients ?? []) as { email: string }[]
    toAddresses = recipients.map((r) => r.email).filter(Boolean)
  }

  if (!toAddresses.length) {
    payload.logger.warn(`sendEmail: no recipients for template "${templateKey}" — email not sent`)
    return
  }

  const from = template.fromName
    ? `${template.fromName} <${template.fromEmail ?? 'noreply@yugotour.com'}>`
    : (template.fromEmail ?? 'noreply@yugotour.com')

  await Promise.all(
    toAddresses.map((to) =>
      payload.sendEmail({ from, to, subject, html }).catch((err) => {
        payload.logger.error(`sendEmail: failed sending to ${to}: ${err}`)
      }),
    ),
  )
}
