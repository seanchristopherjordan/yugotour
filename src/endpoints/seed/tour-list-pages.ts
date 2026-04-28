import type { Payload, PayloadRequest } from 'payload'

// ── Lexical helpers ───────────────────────────────────────────────────────────

type TextFormat = 0 | 1 | 2 | 3

function t(text: string, format: TextFormat = 0) {
  return { detail: 0, format, mode: 'normal' as const, style: '', text, type: 'text' as const, version: 1 }
}

function para(...nodes: ReturnType<typeof t>[]) {
  return {
    children: nodes,
    direction: 'ltr' as const,
    format: '' as const,
    indent: 0,
    type: 'paragraph' as const,
    version: 1,
  }
}

function richDoc(...paragraphs: ReturnType<typeof para>[]) {
  return {
    root: {
      children: paragraphs,
      direction: 'ltr' as const,
      format: '' as const,
      indent: 0,
      type: 'root' as const,
      version: 1,
    },
  }
}

// ── Page data ─────────────────────────────────────────────────────────────────

const PAGES = [
  {
    city: 'belgrade' as const,
    title: 'Belgrade Tours',
    introHeaderBlack: 'See the Capital of a Country',
    introHeaderRed: 'That No Longer Exists!',
    introBodyText: richDoc(
      para(
        t('Belgrade,', 1),
        t(' the perfect place to travel back to Yugoslavia. Be blown away by its '),
        t('brutalist architecture,', 1),
        t(' see the '),
        t('scars of war', 1),
        t(" from the '90s, and trace the footsteps of its former leader "),
        t('Josip Broz Tito.', 1),
        t(' All from the back seat of a Yugoslav time machine on wheels: the '),
        t('Zastava!', 1),
      ),
      para(
        t('Tours start at the'),
        t(' Yugotour Headquarters', 1),
        t(
          " at Karadjordjeva 11. It's possible to start or end your tour at another location, but if you want to pay by card you'll need to do that back at the HQ. Alternately, you can pay in cash (euros or dinars) to your driver directly.",
        ),
      ),
    ),
  },
  {
    city: 'sarajevo' as const,
    title: 'Sarajevo Tours',
    introHeaderBlack: "EXPLORE THE '84 WINTER OLYMPICS, BRUTALIST ARCHITECTURE, AND SPOMENIKS—",
    introHeaderRed: 'IN A VINTAGE YUGO!',
    introBodyText: richDoc(
      para(
        t('Yugotour Sarajevo', 1),
        t(
          ' guides you through the history, architecture, and pop culture of Yugoslavia in an interactive way, driving a vintage YUGO car to the most significant socialist-era buildings and sights in Sarajevo and beyond.',
        ),
      ),
      para(
        t('Our main tour explores '),
        t('Yugoslav Sarajevo,', 1),
        t(" host of the '84 Winter Olympics and beating heart of "),
        t('YU-', 1),
        t('rock', 3),
        t('.', 1),
        t(' Our other tours separately focus on the '),
        t('Olympics', 1),
        t(', '),
        t('Brutalist Zenica,', 1),
        t(' the Second World War battles of '),
        t('Neretva & Sutjeska,', 1),
        t(' and the '),
        t('Fall of Yugoslavia.', 1),
        t(' Hop on board, comrade, as we rock onwards, rock upwards across Yugoslavia!'),
      ),
    ),
  },
]

// ── Seed function ─────────────────────────────────────────────────────────────

export async function seedTourListPages({
  payload,
  req,
}: {
  payload: Payload
  req: PayloadRequest
}): Promise<void> {
  payload.logger.info('— Seeding tour list pages...')

  for (const page of PAGES) {
    const existing = await payload.find({
      collection: 'tour-list-pages',
      where: { city: { equals: page.city } },
      limit: 1,
    })

    if (existing.totalDocs > 0) {
      payload.logger.info(`  Skipping "${page.title}" — already exists.`)
      continue
    }

    await payload.create({
      collection: 'tour-list-pages',
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      data: page as any,
      req,
    })

    payload.logger.info(`  Created "${page.title}"`)
  }

  payload.logger.info('— Tour list pages seeded.')
}
