import type { CollectionAfterChangeHook } from 'payload'

// Email is sent directly in /api/contact/route.ts to ensure it completes before
// the serverless function returns. This hook is intentionally a no-op.
export const sendContactNotification: CollectionAfterChangeHook = async ({ doc }) => {
  return doc
}
