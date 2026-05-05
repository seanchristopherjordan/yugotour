import React, { Fragment } from 'react'
import dynamic from 'next/dynamic'

import type { Page } from '@/payload-types'

import { ArchiveBlock } from '@/blocks/ArchiveBlock/Component'
import { CallToActionBlock } from '@/blocks/CallToAction/Component'
import { ContentBlock } from '@/blocks/Content/Component'
import { MediaBlock } from '@/blocks/MediaBlock/Component'
import { ImageSliderBlock } from '@/blocks/ImageSlider/Component'
import { TvSectionBlock } from '@/blocks/TvSection/Component'
import { ReviewsSectionBlock } from '@/blocks/ReviewsSection/Component'

const FormBlock = dynamic(() => import('@/blocks/Form/Component').then((m) => ({ default: m.FormBlock })))

const blockComponents = {
  archive: ArchiveBlock,
  content: ContentBlock,
  cta: CallToActionBlock,
  formBlock: FormBlock,
  mediaBlock: MediaBlock,
  imageSlider: ImageSliderBlock,
  tvSection: TvSectionBlock,
  reviewsSection: ReviewsSectionBlock,
}

export const RenderBlocks: React.FC<{
  blocks: Page['layout'][0][]
}> = (props) => {
  const { blocks } = props

  const hasBlocks = blocks && Array.isArray(blocks) && blocks.length > 0

  if (hasBlocks) {
    return (
      <Fragment>
        {blocks.map((block, index) => {
          const { blockType } = block

          if (blockType && blockType in blockComponents) {
            const Block = blockComponents[blockType]

            if (Block) {
              const fullBleedTypes = new Set(['imageSlider', 'tvSection', 'reviewsSection'])
              const isFullBleed = fullBleedTypes.has(blockType)
              const followsFullBleed = index > 0 && fullBleedTypes.has(blocks[index - 1]?.blockType ?? '')
              const wrapperClass = isFullBleed ? '' : followsFullBleed ? 'mb-16' : 'my-16'

              return (
                <div className={wrapperClass} key={index}>
                  {/* @ts-expect-error there may be some mismatch between the expected types here */}
                  <Block {...block} disableInnerContainer />
                </div>
              )
            }
          }
          return null
        })}
      </Fragment>
    )
  }

  return null
}
