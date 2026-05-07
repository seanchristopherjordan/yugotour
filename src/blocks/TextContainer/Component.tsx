import React from 'react'
import type { DefaultTypedEditorState } from '@payloadcms/richtext-lexical'
import RichText from '@/components/RichText'
import './text-container.css'

interface TextContainerImage {
  media?: { url?: string | null; alt?: string | null } | string | null
  position?: 'none' | 'left' | 'right' | 'full' | null
  widthPercent?: number | null
  caption?: string | null
}

interface TextContainerBlockProps {
  content?: DefaultTypedEditorState | null
  image?: TextContainerImage | null
  disableInnerContainer?: boolean
}

export function TextContainerBlock({ content, image }: TextContainerBlockProps) {
  if (!content) return null

  const mediaObj =
    image?.media && typeof image.media === 'object' ? image.media : null
  const hasImage = Boolean(mediaObj?.url)
  const position = image?.position ?? 'none'
  const floatWidth = (position === 'left' || position === 'right')
    ? `${image?.widthPercent ?? 42}%`
    : undefined

  return (
    <div className="text-container-outer">
      <div className="container text-container-inner">
        {hasImage && (position === 'left' || position === 'right') && (
          <figure
            className={`text-container-figure text-container-figure--${position}`}
            style={floatWidth ? { width: floatWidth } : undefined}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={mediaObj!.url!}
              alt={mediaObj!.alt ?? ''}
              className="text-container-img"
              loading="lazy"
            />
            {image?.caption && (
              <figcaption className="text-container-caption">{image.caption}</figcaption>
            )}
          </figure>
        )}

        <RichText
          data={content}
          enableGutter={false}
          enableProse={false}
          className="text-container-rich"
        />

        {hasImage && position === 'full' && (
          <figure className="text-container-figure text-container-figure--full">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={mediaObj!.url!}
              alt={mediaObj!.alt ?? ''}
              className="text-container-img"
              loading="lazy"
            />
            {image?.caption && (
              <figcaption className="text-container-caption">{image.caption}</figcaption>
            )}
          </figure>
        )}
        <div className="text-container-clearfix" aria-hidden="true" />
      </div>
    </div>
  )
}
