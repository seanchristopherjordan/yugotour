'use server'

import configPromise from '@payload-config'
import { getPayload } from 'payload'
import { revalidatePath } from 'next/cache'
import { verifyTurnstile } from '@/lib/verifyTurnstile'

async function getCategoryId(categorySlug: string) {
  const payload = await getPayload({ config: configPromise })
  const { docs } = await payload.find({
    collection: 'categories',
    where: { slug: { equals: categorySlug } },
    limit: 1,
  })
  return docs[0]?.id ?? null
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
async function getCommentCountMap(payload: any, postIds: (number | string)[]) {
  const counts: Record<string | number, number> = {}
  if (postIds.length === 0) return counts
  try {
    const { docs } = await payload.find({
      collection: 'post-comments',
      where: { and: [{ post: { in: postIds } }, { approved: { equals: true } }] },
      select: { post: true },
      limit: 10000,
      depth: 0,
      overrideAccess: false,
    })
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    docs.forEach((c: any) => {
      const pid = typeof c.post === 'object' ? c.post?.id : c.post
      if (pid != null) counts[pid] = (counts[pid] || 0) + 1
    })
  } catch {
    // post_comments table may not exist yet
  }
  return counts
}

export async function fetchMoreCategoryPosts(page: number, categorySlug: string) {
  const payload = await getPayload({ config: configPromise })
  const catId = await getCategoryId(categorySlug)

  const result = await payload.find({
    collection: 'posts',
    depth: 1,
    limit: 10,
    page,
    overrideAccess: true,
    draft: false,
    sort: '-publishedAt',
    where: catId
      ? { and: [{ categories: { equals: catId } }, { _status: { equals: 'published' } }] }
      : { _status: { equals: 'published' } },
    select: {
      title: true,
      slug: true,
      categories: true,
      publishedAt: true,
      heroImage: true,
      meta: true,
    },
  })

  const commentCounts = await getCommentCountMap(payload, result.docs.map((p) => p.id))

  return {
    docs: result.docs,
    commentCounts,
    hasNextPage: result.hasNextPage,
    nextPage: result.nextPage,
  }
}

export async function submitComment(
  postId: number,
  postSlug: string,
  formData: { authorName: string; authorEmail: string; content: string },
  turnstileToken: string,
) {
  const verified = await verifyTurnstile(turnstileToken)
  if (!verified) throw new Error('Captcha verification failed. Please try again.')

  const payload = await getPayload({ config: configPromise })

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  await (payload as any).create({
    collection: 'post-comments',
    data: {
      post: postId,
      authorName: formData.authorName,
      authorEmail: formData.authorEmail,
      content: formData.content,
      publishedAt: new Date().toISOString(),
      approved: true,
    },
  })

  revalidatePath(`/blog/${postSlug}`)
  revalidatePath(`/in-the-media/${postSlug}`)

  return { success: true }
}
