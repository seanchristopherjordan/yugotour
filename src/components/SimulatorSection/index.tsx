'use client'

import { useRef, useState, useEffect } from 'react'

export interface SimulatorSectionProps {
  bgDesktopUrl: string | null
  bgMobileUrl: string | null
  driveVideoUrl: string | null
  carInteriorUrl: string | null
  steeringWheelUrl: string | null
  soundOffUrl: string | null
  soundOnUrl: string | null
  radioAudioUrl: string | null
  hornAudioUrl: string | null
}

export function SimulatorSection({
  bgDesktopUrl,
  bgMobileUrl,
  driveVideoUrl,
  carInteriorUrl,
  steeringWheelUrl,
  soundOffUrl,
  soundOnUrl,
  radioAudioUrl,
  hornAudioUrl,
}: SimulatorSectionProps) {
  const [radioPlaying, setRadioPlaying] = useState(false)
  const radioRef = useRef<HTMLAudioElement>(null)
  const driveVideoRef = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    const video = driveVideoRef.current
    if (!video || !driveVideoUrl) return
    video.play().catch(() => {})
  }, [driveVideoUrl])

  function handleSteeringClick() {
    if (!hornAudioUrl) return
    // New Audio instance per click: no ref, no currentTime reset,
    // no stale-load issues. Browser caches the file after first fetch.
    new Audio(hornAudioUrl).play().catch(() => {})
  }

  function handleSoundToggle() {
    const radio = radioRef.current
    if (!radio) return
    if (!radioPlaying) {
      radio.play().catch(() => {})
      setRadioPlaying(true)
    } else {
      radio.pause()
      radio.currentTime = 0
      setRadioPlaying(false)
    }
  }

  return (
    <section className="yugo-simulator-module">
      <div className="sim-black-bar sim-bar-top" />

      <div className="sim-bg-wrap">
        {/* Background image — use picture for mobile/desktop sources */}
        {(bgDesktopUrl || bgMobileUrl) && (
          <picture className="sim-bg-picture">
            {bgDesktopUrl && (
              <source srcSet={bgDesktopUrl} media="(min-width: 992px)" />
            )}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={bgMobileUrl ?? bgDesktopUrl ?? ''}
              alt=""
              aria-hidden="true"
              className="sim-bg-img"
            />
          </picture>
        )}

        <div className="sim-content">
          <div className="sim-headline">YUGOTOUR SIMULATOR</div>

          <div className="sim-car-wrap">
            {/* Driving video */}
            {driveVideoUrl && (
              <video
                ref={driveVideoRef}
                src={driveVideoUrl}
                autoPlay
                muted
                loop
                playsInline
                preload="auto"
                className="sim-drive-video"
              />
            )}

            {/* Car interior overlay */}
            {carInteriorUrl && (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={carInteriorUrl}
                alt="Yugo Interior"
                className="sim-car-interior"
              />
            )}

            {/* Steering wheel — click to honk */}
            {steeringWheelUrl && (
              <button
                type="button"
                className="sim-steering-wrap"
                onClick={handleSteeringClick}
                aria-label="Honk horn"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={steeringWheelUrl}
                  alt=""
                  aria-hidden="true"
                  className="sim-steering-wheel"
                />
              </button>
            )}

            {/* Sound toggle */}
            <button
              type="button"
              className="sim-sound-wrap"
              onClick={handleSoundToggle}
              aria-label={radioPlaying ? 'Mute radio' : 'Play radio'}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={radioPlaying ? (soundOnUrl ?? soundOffUrl ?? '') : (soundOffUrl ?? '')}
                alt=""
                aria-hidden="true"
                className="sim-sound-btn"
              />
            </button>

            {/* Radio audio — looping background, controlled via ref */}
            {radioAudioUrl && (
              <audio ref={radioRef} loop preload="none">
                <source src={radioAudioUrl} type="audio/mpeg" />
              </audio>
            )}
          </div>
        </div>
      </div>

      <div className="sim-black-bar sim-bar-bottom" />
    </section>
  )
}
