import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Folder } from 'lucide-react';

interface ProjectCardProps {
  name: string;
}

export default function ProjectCard({ name }: ProjectCardProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-white flex items-center gap-2">
          <Folder className="h-4 w-4 text-blue-500" />
          Project
        </CardTitle>
      </CardHeader>
      <CardContent className="text-2xl font-bold text-white">{name}</CardContent>
    </Card>
  );
}
