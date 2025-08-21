import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Calendar, Clock } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

interface DailyLog {
  id: string;
  workDone: string;
  createdAt: Date;
  project: { name: string };
  createdBy: { firstName: string | null; lastName: string | null };
}

interface TimeEntry {
  id: string;
  hoursWorked: number;
  createdAt: Date;
  user: { firstName: string | null; lastName: string | null };
  project: { name: string };
}

interface RecentActivityProps {
  logs: DailyLog[];
  timeEntries: TimeEntry[];
}

export function RecentActivity({ logs, timeEntries }: RecentActivityProps) {
  // Combine and sort activities
  const activities = [
    ...logs.map((log) => ({
      id: log.id,
      type: 'log' as const,
      title: `Log: ${log.workDone.substring(0, 50)}${log.workDone.length > 50 ? '...' : ''}`,
      project: log.project.name,
      user: `${log.createdBy.firstName || ''} ${log.createdBy.lastName || ''}`.trim(),
      time: log.createdAt,
      icon: Calendar,
    })),
    ...timeEntries.map((entry) => ({
      id: entry.id,
      type: 'timesheet' as const,
      title: `Logged ${entry.hoursWorked} hours`,
      project: entry.project.name,
      user: `${entry.user.firstName || ''} ${entry.user.lastName || ''}`.trim(),
      time: entry.createdAt,
      icon: Clock,
    })),
  ]
    .sort((a, b) => b.time.getTime() - a.time.getTime())
    .slice(0, 8);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Activity</CardTitle>
      </CardHeader>
      <CardContent>
        {activities.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <Calendar className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>No recent activity</p>
            <p className="text-sm">
              Activity will appear here as your team works
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {activities.map((activity) => (
              <div
                key={`${activity.type}-${activity.id}`}
                className="flex items-start gap-3"
              >
                <Avatar className="h-8 w-8">
                  <AvatarFallback className="text-xs">
                    {activity.user
                      .split(' ')
                      .map((n) => n[0])
                      .join('')
                      .toUpperCase() || 'U'}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium">{activity.title}</p>
                  <p className="text-xs text-muted-foreground">
                    {activity.project} • {activity.user}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {formatDistanceToNow(activity.time, { addSuffix: true })}
                  </p>
                </div>
                <activity.icon className="h-4 w-4 text-muted-foreground mt-1" />
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
