import type { Payload } from 'payload'

const defaultBody = (text: string) => ({
  root: {
    type: 'root',
    children: [
      {
        type: 'paragraph',
        children: [{ type: 'text', text, version: 1 }],
        version: 1,
      },
    ],
    direction: null,
    format: '',
    indent: 0,
    version: 1,
  },
})

const templates = [
  {
    name: 'Booking – Guest Confirmation (Belgrade)',
    templateKey: 'booking_guest_confirmation_belgrade',
    fromName: 'Yugotour',
    fromEmail: 'bookings@send.yugotour.com',
    subject: 'Your Yugotour booking is confirmed — {{tour_name}}',
    preheader: "We've received your booking. Here are the details.",
    body: defaultBody(
      "Hi {{guest_name}},\n\nThank you for booking with Yugotour! We've received your request for the {{tour_name}} in {{city}} on {{tour_date}} for {{group_size}} guest(s).\n\nWe'll be in touch shortly to confirm your exact start time. In the meantime, if you have any questions, feel free to reply to this email.\n\nSee you soon!\nThe Yugotour Team",
    ),
    recipients: [],
  },
  {
    name: 'Booking – Guest Confirmation (Sarajevo)',
    templateKey: 'booking_guest_confirmation_sarajevo',
    fromName: 'Yugotour',
    fromEmail: 'bookings@send.yugotour.com',
    subject: 'Your Yugotour booking is confirmed — {{tour_name}}',
    preheader: "We've received your booking. Here are the details.",
    body: defaultBody(
      "Hi {{guest_name}},\n\nThank you for booking with Yugotour! We've received your request for the {{tour_name}} in {{city}} on {{tour_date}} for {{group_size}} guest(s).\n\nWe'll be in touch shortly to confirm your exact start time. In the meantime, if you have any questions, feel free to reply to this email.\n\nSee you soon!\nThe Yugotour Team",
    ),
    recipients: [],
  },
  {
    name: 'Booking – Staff Notification (Belgrade)',
    templateKey: 'booking_staff_belgrade',
    fromName: 'Yugotour Bookings',
    fromEmail: 'bookings@send.yugotour.com',
    subject: 'New Belgrade booking — {{guest_name}} · {{tour_date}}',
    preheader: 'A new booking request has arrived.',
    body: defaultBody(
      'New booking received.\n\nGuest: {{guest_name}}\nEmail: {{guest_email}}\nPhone: {{guest_phone}}\nTour: {{tour_name}}\nDate: {{tour_date}}\nStart Time: {{start_time}}\nGuests: {{group_size}}\nTotal: {{total_price}}\nComments: {{comments}}\n\nBooking ID: {{booking_id}}',
    ),
    recipients: [{ email: 'info@yugotour.com' }],
  },
  {
    name: 'Booking – Staff Notification (Sarajevo)',
    templateKey: 'booking_staff_sarajevo',
    fromName: 'Yugotour Bookings',
    fromEmail: 'bookings@send.yugotour.com',
    subject: 'New Sarajevo booking — {{guest_name}} · {{tour_date}}',
    preheader: 'A new booking request has arrived.',
    body: defaultBody(
      'New booking received.\n\nGuest: {{guest_name}}\nEmail: {{guest_email}}\nPhone: {{guest_phone}}\nTour: {{tour_name}}\nDate: {{tour_date}}\nStart Time: {{start_time}}\nGuests: {{group_size}}\nTotal: {{total_price}}\nComments: {{comments}}\n\nBooking ID: {{booking_id}}',
    ),
    recipients: [{ email: 'sarajevo@yugotour.com' }],
  },
  {
    name: 'Contact Form – Staff Notification',
    templateKey: 'contact_staff_notification',
    fromName: 'Yugotour Website',
    fromEmail: 'noreply@send.yugotour.com',
    subject: 'New contact message from {{sender_name}}',
    preheader: 'Someone has sent a message via the contact form.',
    body: defaultBody(
      'New contact form submission.\n\nName: {{sender_name}}\nEmail: {{sender_email}}\n\nMessage:\n{{message}}',
    ),
    recipients: [{ email: 'info@yugotour.com' }, { email: 'sarajevo@yugotour.com' }],
  },
]

export async function seedEmailTemplates(payload: Payload): Promise<void> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const payloadAny = payload as any
  for (const template of templates) {
    const existing = await payloadAny.find({
      collection: 'email-templates',
      where: { templateKey: { equals: template.templateKey } },
      limit: 1,
    })
    if (existing.totalDocs === 0) {
      await payloadAny.create({ collection: 'email-templates', data: template })
      payload.logger.info(`Seeded email template: ${template.templateKey}`)
    }
  }
}
