'use client'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

const BeforeDashboard: React.FC = () => {
  const router = useRouter()
  useEffect(() => {
    router.replace('/admin/collections/bookings')
  }, [router])
  return null
}

export default BeforeDashboard
