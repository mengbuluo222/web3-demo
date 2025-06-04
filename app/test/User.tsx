import { cookies } from 'next/headers'

export default async function User() {
  const session = (await cookies()).get('session')?.value
  return <div>111</div>
}