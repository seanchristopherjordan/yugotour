/**
 * TV Section fine-tuning config.
 *
 * Adjust these values to align the YouTube video with the transparent
 * screen hole in your TV overlay WebP images.
 *
 * All position values are percentage strings relative to the full
 * width/height of the TV container (i.e. the overlay image dimensions).
 *
 * iframeScale: subtle overscan so no gap appears at the iframe edges.
 *   1.0 = no scale, 1.02 = 2% larger than the hole (recommended).
 *
 * youtubeParams: query string appended to the embed URL.
 *   Add "autoplay=1&mute=1&loop=1&playlist=VIDEO_ID" for silent autoplay.
 */
export const tvConfig = {
  mobile: {
    top: '15.2%',
    left: '0%',
    width: '85%',
    iframeScale: 1.02,
  },
  desktop: {
    top: '15%',
    left: '19.1%',
    width: '52.8%',
    iframeScale: 1.02,
  },
  youtubeParams: 'rel=0&modestbranding=1',
}
