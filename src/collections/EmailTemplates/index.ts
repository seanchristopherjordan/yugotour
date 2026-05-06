import type { CollectionConfig } from 'payload'
import {
  BoldFeature,
  ItalicFeature,
  LinkFeature,
  ParagraphFeature,
  UnderlineFeature,
  HeadingFeature,
  lexicalEditor,
} from '@payloadcms/richtext-lexical'
import { authenticated } from '@/access/authenticated'

const BOOKING_VARS = `Available variables: {{booking_id}}, {{guest_name}}, {{guest_email}}, {{guest_phone}}, {{tour_name}}, {{tour_date}}, {{group_size}}, {{city}}, {{start_time}}, {{total_price}}, {{comments}}`
const CONTACT_VARS = `Available variables: {{sender_name}}, {{sender_email}}, {{message}}`

function bodyDescription(key: string): string {
  if (key === 'contact_staff_notification') return CONTACT_VARS
  return BOOKING_VARS
}

export const EmailTemplates: CollectionConfig = {
  slug: 'email-templates',
  labels: { singular: 'Booking Setting', plural: 'Booking Settings' },
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'templateKey', 'fromEmail', 'updatedAt'],
    group: 'Comms',
    description: 'Editable templates for automated emails. Use {{variable}} tokens to insert booking or contact data.',
  },
  access: {
    read: authenticated,
    create: authenticated,
    update: authenticated,
    delete: authenticated,
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      label: 'Template Name',
      required: true,
      admin: {
        description: 'Internal label — not shown to recipients.',
      },
    },
    {
      name: 'templateKey',
      type: 'select',
      label: 'Template Type',
      required: true,
      unique: true,
      options: [
        { label: 'Booking – Guest Confirmation (Belgrade)', value: 'booking_guest_confirmation_belgrade' },
        { label: 'Booking – Guest Confirmation (Sarajevo)', value: 'booking_guest_confirmation_sarajevo' },
        { label: 'Booking – Staff Notification (Belgrade)', value: 'booking_staff_belgrade' },
        { label: 'Booking – Staff Notification (Sarajevo)', value: 'booking_staff_sarajevo' },
        { label: 'Contact Form – Staff Notification', value: 'contact_staff_notification' },
      ],
      admin: {
        description: 'Determines when this template is sent. Each type can only have one template.',
      },
    },
    {
      name: 'fromName',
      type: 'text',
      label: 'From Name',
      defaultValue: 'Yugotour',
    },
    {
      name: 'fromEmail',
      type: 'email',
      label: 'From Email',
      defaultValue: 'noreply@yugotour.com',
    },
    {
      name: 'recipients',
      type: 'array',
      label: 'Recipient Addresses (To:)',
      admin: {
        description: 'Who receives this email. Not used for the guest confirmation — that always goes to the booker.',
        condition: (_, { templateKey } = {}) => templateKey !== 'booking_guest_confirmation',
      },
      fields: [
        {
          name: 'email',
          type: 'email',
          label: 'Email Address',
          required: true,
        },
      ],
    },
    {
      name: 'subject',
      type: 'text',
      label: 'Subject Line',
      required: true,
      admin: {
        description: 'Supports {{variables}}. ' + BOOKING_VARS,
      },
    },
    {
      name: 'preheader',
      type: 'text',
      label: 'Preheader',
      admin: {
        description: 'Short preview text shown in the inbox before the email is opened. Keep under 90 characters.',
      },
    },
    {
      name: 'body',
      type: 'richText',
      label: 'Body',
      editor: lexicalEditor({
        features: [
          ParagraphFeature(),
          HeadingFeature({ enabledHeadingSizes: ['h2', 'h3'] }),
          BoldFeature(),
          ItalicFeature(),
          UnderlineFeature(),
          LinkFeature({ enabledCollections: [] }),
        ],
      }),
      admin: {
        description: BOOKING_VARS,
      },
    },
    {
      name: 'logo',
      type: 'upload',
      relationTo: 'media',
      label: 'Logo Image',
      admin: {
        description: 'Shown at the top of the email. Recommended: 200px wide PNG with transparent background.',
      },
    },
    {
      name: 'signature',
      type: 'upload',
      relationTo: 'media',
      label: 'Signature Image',
      admin: {
        description: 'Shown at the bottom of the email.',
      },
    },
  ],
}
