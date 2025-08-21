import { Suspense } from 'react'
import Link from 'next/link'
import { ContactList } from '@/features/contacts/contact-list'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Search, Plus } from 'lucide-react'

interface PageProps {
  searchParams: Promise<{ q?: string; type?: string }>
}

export default async function ContactsPage({ searchParams }: PageProps) {
  const { q, type } = await searchParams
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Contacts</h1>
          <p className="text-muted-foreground">Browse all contacts</p>
        </div>
        <Button asChild>
          <Link href="/dashboard/contacts/new">
            <Plus className="h-4 w-4 mr-2" /> Add Contact
          </Link>
        </Button>
      </div>

      <Card>
        <CardContent className="pt-6">
          <form className="flex flex-col sm:flex-row gap-4" method="get">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                name="q"
                placeholder="Search contacts..."
                defaultValue={q ?? ''}
                className="pl-10"
              />
            </div>
            <Select name="type" defaultValue={type ?? 'all'}>
              <SelectTrigger className="w-full sm:w-48">
                <SelectValue placeholder="Filter by type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Contacts</SelectItem>
                <SelectItem value="CLIENT">Clients</SelectItem>
                <SelectItem value="CONTRACTOR">Contractors</SelectItem>
                <SelectItem value="VENDOR">Vendors</SelectItem>
                <SelectItem value="INSPECTOR">Inspectors</SelectItem>
                <SelectItem value="EMPLOYEE">Employees</SelectItem>
                <SelectItem value="BURRITO_TRUCK">Burrito Trucks</SelectItem>
                <SelectItem value="OTHER">Other</SelectItem>
              </SelectContent>
            </Select>
            <Button type="submit" className="sr-only">
              Apply
            </Button>
          </form>
        </CardContent>
      </Card>

      <Suspense fallback={<div>Loading contacts...</div>}>
        <ContactList search={q} type={type === 'all' ? undefined : type} />
      </Suspense>
    </div>
  )
}
