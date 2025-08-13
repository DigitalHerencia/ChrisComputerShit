import { currentUser } from '@clerk/nextjs/server';
import { Suspense } from 'react';
import DashboardProjects from '@/features/projects/DashboardProjects';
import DashboardSkeleton from '@/components/dashboard/DashboardSkeleton';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Construction } from 'lucide-react';

export default async function Page() {
  const user = await currentUser();
  if (!user) return null;

  return (
    <Suspense fallback={<DashboardSkeleton />}>
      <Card>
        <CardHeader>
          <CardTitle>
            <Construction className="h-8 w-8" />
            Dashboard
          </CardTitle>
          <CardDescription>Overview of projects</CardDescription>
        </CardHeader>
        <CardContent>
          <DashboardProjects userId={user.id} />
        </CardContent>
      </Card>
    </Suspense>
  );
}
