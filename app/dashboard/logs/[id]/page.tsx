import { Suspense } from "react"
import { LogDetail } from "@/features/logs/log-detail"

interface PageProps {
  params: Promise<{ id: string }>
}

export default async function Page({ params }: PageProps) {
  const { id } = await params
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <LogDetail id={id} />
    </Suspense>
  )
}

