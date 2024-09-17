import { useRouter } from 'next/navigation'

export const useCustomRouter = () => {
  const router = useRouter()

  const push = (path: string) => {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'
    const fullPath = `${baseUrl}${path}`
    router.push(fullPath)
  }

  return { ...router, push }
}