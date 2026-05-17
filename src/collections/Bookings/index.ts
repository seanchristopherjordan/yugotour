import type { CollectionConfig } from 'payload'
import { authenticated } from '../../access/authenticated'
import { anyone } from '../../access/anyone'
import { sendBookingEmails } from './hooks/sendBookingEmails'

export const Bookings: CollectionConfig = {
  slug: 'bookings',
  labels: { singular: 'Booking Entry', plural: 'Booking Entries' },
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['city', 'tourTitle', 'date', 'guests', 'name', 'totalPrice'],
    group: 'Comms',
    description: 'Incoming tour booking requests.',
    components: {
      beforeList: ['@/collections/Bookings/components/CityFilterBar'],
    },
  },
  access: {
    create: anyone,
    read: authenticated,
    update: authenticated,
    delete: authenticated,
  },
  fields: [
    // ── Contact ──────────────────────────────────────────────────
    {
      name: 'name',
      type: 'text',
      label: 'Guest Name',
      required: true,
    },
    {
      name: 'email',
      type: 'email',
      required: true,
    },
    {
      name: 'phone',
      type: 'text',
      label: 'Phone Number',
    },
    // ── Tour ─────────────────────────────────────────────────────
    {
      name: 'city',
      type: 'select',
      required: true,
      options: [
        { label: 'Belgrade', value: 'belgrade' },
        { label: 'Sarajevo', value: 'sarajevo' },
      ],
      admin: { position: 'sidebar' },
    },
    {
      name: 'tourTitle',
      type: 'text',
      label: 'Tour Selected',
      required: true,
      admin: { position: 'sidebar' },
    },
    {
      name: 'tourId',
      type: 'number',
      label: 'Tour System ID',
      admin: { position: 'sidebar' },
    },
    {
      name: 'guests',
      type: 'text',
      label: 'Number of Guests',
      required: true,
      admin: { position: 'sidebar' },
    },
    {
      name: 'totalPrice',
      type: 'number',
      label: 'Total Estimated Price (€)',
      admin: { position: 'sidebar' },
    },
    // ── Schedule ─────────────────────────────────────────────────
    {
      name: 'date',
      type: 'text',
      label: 'Date of Tour',
      required: true,
    },
    {
      name: 'startTime',
      type: 'text',
      label: 'Preferred Start Time',
    },
    {
      name: 'pickupSpot',
      type: 'text',
      label: 'Pick-up Spot (Sarajevo)',
    },
    // ── Extras ───────────────────────────────────────────────────
    {
      name: 'extras',
      type: 'array',
      label: 'Optional Extras Selected',
      fields: [
        { name: 'title', type: 'text' },
        { name: 'price', type: 'number' },
      ],
    },
    {
      name: 'airportDirection',
      type: 'select',
      label: 'Airport Transfer Direction',
      options: [
        { label: 'Pickup (flight landing time)', value: 'pickup' },
        { label: 'Dropoff (flight departure time)', value: 'dropoff' },
      ],
    },
    {
      name: 'flightTime',
      type: 'text',
      label: 'Flight Time',
    },
    // ── Additional ───────────────────────────────────────────────
    {
      name: 'comments',
      type: 'textarea',
      label: 'Comments / Special Requests',
    },
    {
      name: 'submittedAt',
      type: 'date',
      label: 'Submitted At',
      admin: {
        position: 'sidebar',
        date: { pickerAppearance: 'dayAndTime' },
      },
    },
  ],
  hooks: {
    afterChange: [sendBookingEmails],
  },
}
