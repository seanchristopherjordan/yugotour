import './blog-list-header.css'

interface BlogListHeaderProps {
  label: string
  backgroundImage?: { url?: string | null } | string | null
}

export function BlogListHeader({ label, backgroundImage }: BlogListHeaderProps) {
  const bgObj = typeof backgroundImage === 'object' && backgroundImage !== null ? backgroundImage : null
  const bgUrl = bgObj?.url ?? null

  return (
    <header className="blog-list-header">
      {bgUrl && (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={bgUrl} alt="" aria-hidden="true" className="blog-list-header-bg" />
      )}
      <div className="blog-list-header-overlay" />
      <div className="container blog-list-header-content">
        <h1 className="blog-list-header-title">{label}</h1>
      </div>
    </header>
  )
}
