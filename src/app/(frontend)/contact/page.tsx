import type { Metadata } from 'next'
import { ContactForm } from '@/components/ContactForm'
import './contact.css'

export const metadata: Metadata = {
  title: 'Contact Us — Yugotour',
  description: 'Get in touch with the Yugotour team.',
}

export default function ContactPage() {
  return (
    <main
      className="pt-16"
      style={{ backgroundImage: "url('/textures/texture-cream.webp')", backgroundRepeat: 'repeat' }}
    >
      <section className="container py-16 min-[992px]:py-24">
        <h1 className="contact-page-title">Contact Us</h1>
        <p className="contact-page-lede">
          Questions about a tour, a booking, or something else? Drop us a line and we&apos;ll get
          back to you as soon as we can.
        </p>
        <ContactForm />
      </section>
    </main>
  )
}
