import Link from 'next/link';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Calendar,
  Clock,
  User,
  CheckCircle,
  AlertCircle,
  Eye,
} from 'lucide-react';
import { format } from 'date-fns';

interface TimesheetCardProps {
  entry: {
    id: string;
    date: Date;
    hoursWorked: number;
    overtime: number;
    description?: string | null;
    approved: boolean;
    project: { name: string; status: string };
    user: { firstName: string | null; lastName: string | null };
  };
}

export function TimesheetCard({ entry }: TimesheetCardProps) {
  const userName =
    `${entry.user.firstName || ''} ${entry.user.lastName || ''}`.trim();
  const totalHours = entry.hoursWorked + entry.overtime;

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Calendar className="h-4 w-4" />
              <span className="font-medium">
                {format(entry.date, 'EEEE, MMM d, yyyy')}
              </span>
            </div>
            <Badge variant="outline" className="text-xs">
              {entry.project.name}
            </Badge>
          </div>
          <div className="flex items-center gap-2">
            {entry.approved ? (
              <Badge
                variant="default"
                className="bg-green-100 text-green-800 border-green-200"
              >
                <CheckCircle className="h-3 w-3 mr-1" />
                Approved
              </Badge>
            ) : (
              <Badge
                variant="outline"
                className="bg-yellow-100 text-yellow-800 border-yellow-200"
              >
                <AlertCircle className="h-3 w-3 mr-1" />
                Pending
              </Badge>
            )}
            <Button asChild variant="outline" size="sm">
              <Link href={`/dashboard/timesheets/${entry.id}`}>
                <Eye className="h-4 w-4 mr-2" />
                View
              </Link>
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Hours and Employee Info */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-primary" />
              <div>
                <p className="font-semibold text-lg">
                  {totalHours.toFixed(1)} hours
                </p>
                <p className="text-xs text-muted-foreground">
                  {entry.hoursWorked}h regular
                  {entry.overtime > 0 && ` + ${entry.overtime}h OT`}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <User className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="font-medium">{userName}</p>
                <p className="text-xs text-muted-foreground">Employee</p>
              </div>
            </div>
          </div>
        </div>

        {/* Description */}
        {entry.description && (
          <div>
            <h4 className="font-medium mb-1 text-sm">Description</h4>
            <p className="text-sm text-muted-foreground line-clamp-2">
              {entry.description}
            </p>
          </div>
        )}

        {/* Footer */}
        <div className="flex items-center justify-between pt-2 border-t text-xs text-muted-foreground">
          <span>Project: {entry.project.name}</span>
          <span>Logged: {format(entry.date, 'h:mm a')}</span>
        </div>
      </CardContent>
    </Card>
  );
}
