import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, Calendar, Clock, FileText, CheckSquare } from 'lucide-react';

export function QuickActions() {
  const actions = [
    {
      title: 'New Daily Log',
      description: "Record today's progress",
      href: '/dashboard/logs/new',
      icon: Calendar,
      color: 'bg-primary/10 text-primary hover:bg-primary/20',
    },
    {
      title: 'Log Hours',
      description: 'Submit timesheet',
      href: '/dashboard/timesheets/new',
      icon: Clock,
      color: 'bg-secondary/10 text-secondary hover:bg-secondary/20',
    },
    {
      title: 'Add Task',
      description: 'Create new task',
      href: '/dashboard/tasks/new',
      icon: CheckSquare,
      color: 'bg-accent/10 text-accent hover:bg-accent/20',
    },
    {
      title: 'Upload Document',
      description: 'Scan or upload files',
      href: '/dashboard/documents/new',
      icon: FileText,
      color: 'bg-muted text-muted-foreground hover:bg-muted/80',
    },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Plus className="h-5 w-5" />
          Quick Actions
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {actions.map((action) => (
          <Button
            key={action.title}
            asChild
            variant="ghost"
            className={`w-full justify-start h-auto p-4 ${action.color}`}
          >
            <Link href={action.href}>
              <div className="flex items-center gap-3">
                <action.icon className="h-5 w-5" />
                <div className="text-left">
                  <div className="font-medium">{action.title}</div>
                  <div className="text-xs opacity-70">{action.description}</div>
                </div>
              </div>
            </Link>
          </Button>
        ))}
      </CardContent>
    </Card>
  );
}
