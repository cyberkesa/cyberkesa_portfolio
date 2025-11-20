import { redirect } from 'next/navigation'

export default function NotFound() {
  // Redirect to default locale
  redirect('/en')
}

