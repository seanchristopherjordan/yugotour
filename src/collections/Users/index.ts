import type { CollectionConfig } from 'payload'

import { authenticated } from '../../access/authenticated'

export const Users: CollectionConfig = {
  slug: 'users',
  access: {
    admin: authenticated,
    create: authenticated,
    delete: authenticated,
    read: authenticated,
    update: authenticated,
  },
  admin: {
    group: 'Collections',
    defaultColumns: ['name', 'email'],
    useAsTitle: 'name',
  },
  auth: {
    maxLoginAttempts: 5,
    lockTime: 600000,
  },
  hooks: {
    afterLogin: [
      ({ req }) => {
        req.responseHeaders?.set(
          'Set-Cookie',
          'payload-admin=1; Path=/; Max-Age=604800; SameSite=Lax',
        )
      },
    ],
    afterLogout: [
      ({ req }) => {
        req.responseHeaders?.set(
          'Set-Cookie',
          'payload-admin=; Path=/; Max-Age=0; SameSite=Lax',
        )
      },
    ],
  },
  fields: [
    {
      name: 'name',
      type: 'text',
    },
  ],
  timestamps: true,
}
