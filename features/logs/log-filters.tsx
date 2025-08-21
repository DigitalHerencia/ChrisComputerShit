'use client';

import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface LogFiltersProps {
  projects: { id: string; name: string }[];
  initialSearch?: string;
  initialProject?: string;
  initialRange?: string;
}

export function LogFilters({
  projects,
  initialSearch = '',
  initialProject = 'all',
  initialRange = 'all-time',
}: LogFiltersProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const createQueryString = (name: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (!value || value === 'all' || value === 'all-time') {
      params.delete(name);
    } else {
      params.set(name, value);
    }
    return params.toString();
  };

  const handleProjectChange = (value: string) => {
    router.push(`${pathname}?${createQueryString('project', value)}`);
  };

  const handleRangeChange = (value: string) => {
    router.push(`${pathname}?${createQueryString('range', value)}`);
  };

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const q = (formData.get('q') as string) || '';
    router.push(`${pathname}?${createQueryString('q', q)}`);
  };

  return (
    <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-4">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          name="q"
          placeholder="Search logs..."
          defaultValue={initialSearch}
          className="pl-10"
        />
      </div>
      <Select defaultValue={initialProject} onValueChange={handleProjectChange}>
        <SelectTrigger className="w-full sm:w-48">
          <SelectValue placeholder="Filter by project" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Projects</SelectItem>
          {projects.map((project) => (
            <SelectItem key={project.id} value={project.id}>
              {project.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Select defaultValue={initialRange} onValueChange={handleRangeChange}>
        <SelectTrigger className="w-full sm:w-48">
          <SelectValue placeholder="Filter by date" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all-time">All Time</SelectItem>
          <SelectItem value="today">Today</SelectItem>
          <SelectItem value="this-week">This Week</SelectItem>
          <SelectItem value="this-month">This Month</SelectItem>
        </SelectContent>
      </Select>
      <button type="submit" className="sr-only">
        Search
      </button>
    </form>
  );
}
