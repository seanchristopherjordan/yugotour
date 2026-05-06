import { ContactForm } from '@/components/ContactForm'
import './contact-block.css'

interface ContactBlockProps {
  heading?: string | null
  lede?: string | null
}

export function ContactBlockComponent({ heading, lede }: ContactBlockProps) {
  return (
    <div className="contact-block container">
      {heading && <h2 className="contact-block-title">{heading}</h2>}
      {lede && <p className="contact-block-lede">{lede}</p>}
      <ContactForm />
    </div>
  )
}
