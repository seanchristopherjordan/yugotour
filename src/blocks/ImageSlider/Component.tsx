'use client'

import Image from 'next/image'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Navigation, Pagination, A11y } from 'swiper/modules'
import type { Media } from '@/payload-types'

import 'swiper/css'
import 'swiper/css/pagination'

export interface ImageSliderBlockProps {
  blockType: 'imageSlider'
  mobileImages?: (string | Media)[] | null
  desktopImages?: (string | Media)[] | null
  label?: string | null
}

function resolveMedia(images?: (string | Media)[] | null): Media[] {
  if (!images) return []
  return images.filter((img): img is Media => typeof img !== 'string' && img !== null)
}

export function ImageSliderBlock({ mobileImages, desktopImages }: ImageSliderBlockProps) {
  const mobileSlides = resolveMedia(mobileImages)
  const desktopSlides = resolveMedia(desktopImages)
  const borderBar = <div style={{ height: '25px', backgroundColor: '#212121' }} />

  return (
    <div className="image-slider-outer">
      {borderBar}

      {/* Mobile slider — visible below 992 px */}
      <div className="min-[992px]:hidden">
        {mobileSlides.length > 0 && (
          <Swiper
            modules={[Pagination, A11y]}
            slidesPerView={1}
            spaceBetween={25}
            loop={mobileSlides.length >= 3}
            speed={310}
            pagination={{ clickable: true }}
            grabCursor
            className="image-slider-swiper"
            style={{ height: 'calc(79vh - 50px)' }}
          >
            {mobileSlides.map((img, i) => (
              <SwiperSlide key={img.id} className="image-slider-slide">
                <div style={{ position: 'relative', width: '100%', height: '100%' }}>
                  <Image
                    src={img.url ?? ''}
                    alt={img.alt ?? ''}
                    fill
                    priority={i === 0}
                    style={{ objectFit: 'cover' }}
                    sizes="100vw"
                  />
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        )}
      </div>

      {/* Desktop slider — visible at 992 px+ */}
      <div className="hidden min-[992px]:block">
        {desktopSlides.length > 0 && (
          <Swiper
            modules={[Navigation, Pagination, A11y]}
            slidesPerView={1.45}
            centeredSlides
            spaceBetween={25}
            loop={desktopSlides.length >= 3}
            speed={500}
            navigation={true}
            pagination={{ clickable: true }}
            grabCursor
            className="image-slider-swiper"
            style={{ height: 'calc(79vh - 50px)' }}
          >
            {desktopSlides.map((img, i) => (
              <SwiperSlide key={img.id} className="image-slider-slide">
                <div style={{ position: 'relative', width: '100%', height: '100%' }}>
                  <Image
                    src={img.url ?? ''}
                    alt={img.alt ?? ''}
                    fill
                    priority={i === 0}
                    style={{ objectFit: 'cover' }}
                    sizes="(min-width: 992px) 85vw, 100vw"
                  />
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        )}
      </div>

      {borderBar}
    </div>
  )
}
