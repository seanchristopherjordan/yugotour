import type { CollectionConfig } from 'payload'
import { anyone } from '../../access/anyone'
import { authenticated } from '../../access/authenticated'

export const PostComments: CollectionConfig = {
  slug: 'post-comments',
  labels: { singular: 'Comment', plural: 'Comments' },
  access: {
    create: anyone,
    read: anyone,
    update: authenticated,
    delete: authenticated,
  },
  admin: {
    group: 'Blog',
    useAsTitle: 'authorName',
    defaultColumns: ['authorName', 'post', 'publishedAt', 'approved'],
  },
  fields: [
    {
      name: 'post',
      type: 'relationship',
      relationTo: 'posts',
      required: true,
      admin: { position: 'sidebar' },
    },
    {
      name: 'authorName',
      type: 'text',
      required: true,
      label: 'Name',
    },
    {
      name: 'authorEmail',
      type: 'email',
      label: 'Email',
    },
    {
      name: 'content',
      type: 'textarea',
      required: true,
      label: 'Comment',
    },
    {
      name: 'publishedAt',
      type: 'date',
      admin: { position: 'sidebar' },
    },
    {
      name: 'parentCommentId',
      type: 'number',
      label: 'Parent Comment ID',
      admin: { position: 'sidebar', description: 'ID of parent comment for threading' },
    },
    {
      name: 'approved',
      type: 'checkbox',
      defaultValue: true,
      admin: { position: 'sidebar' },
    },
  ],
}
