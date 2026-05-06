import type { CollectionConfig } from 'payload'
import { authenticated } from '@/access/authenticated'
import { anyone } from '@/access/anyone'
import { sendContactNotification } from './hooks/sendContactNotification'

export const ContactMessages: CollectionConfig = {
  slug: 'contact-messages',
  defaultSort: '-createdAt',
  labels: { singular: 'Contact Entry', plural: 'Contact Entries' },
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'email', 'message', 'status', 'createdAt'],
    group: 'Comms',
    description: 'Incoming contact form submissions.',
    listSearchableFields: ['name', 'email'],
  },
  access: {
    create: anyone,
    read: authenticated,
    update: authenticated,
    delete: authenticated,
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      label: 'Name',
      required: true,
    },
    {
      name: 'email',
      type: 'email',
      label: 'Email Address',
      required: true,
    },
    {
      name: 'message',
      type: 'textarea',
      label: 'Message',
      required: true,
    },
    {
      name: 'status',
      type: 'select',
      label: 'Status',
      defaultValue: 'new',
      options: [
        { label: 'New', value: 'new' },
        { label: 'Read', value: 'read' },
        { label: 'Replied', value: 'replied' },
      ],
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'ipAddress',
      type: 'text',
      label: 'IP Address',
      admin: {
        position: 'sidebar',
        readOnly: true,
        description: 'Captured at submission time for spam reference.',
      },
    },
  ],
  hooks: {
    afterChange: [sendContactNotification],
  },
}
