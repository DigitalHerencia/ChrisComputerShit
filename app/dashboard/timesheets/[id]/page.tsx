import { currentUser } from '@clerk/nextjs/server';
import { prisma } from '@/lib/db';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  ArrowLeft,
  Edit,
  Calendar,
  Clock,
  User,
  CheckCircle,
  AlertCircle,
} from 'lucide-react';
import { format } from 'date-fns';
import { ApprovalButton } from '@/components/timesheets/approval-button';

export default async function TimesheetDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const user = await currentUser();
  if (!user) return null;

  const [timeEntry, dbUser] = await Promise.all([
    prisma.timeEntry.findUnique({
      where: { id: params.id },
      include: {
        project: { select: { name: true, location: true } },
        user: { select: { firstName: true, lastName: true } },
      },
    }),
    prisma.user.findUnique({
      where: { clerkId: user.id },
    }),
  ]);

  if (!timeEntry) {
    notFound();
  }

  const userName =
    `${timeEntry.user.firstName || ''} ${timeEntry.user.lastName || ''}`.trim();
  const totalHours = timeEntry.hoursWorked + timeEntry.overtime;
  const canApprove =
    dbUser &&
    (dbUser.role === 'ADMIN' || dbUser.role === 'SUPERVISOR') &&
    !timeEntry.approved;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" asChild>
            <Link href="/dashboard/timesheets">
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-foreground">
              Timesheet - {format(timeEntry.date, 'MMM d, yyyy')}
            </h1>
            <p className="text-muted-foreground">{timeEntry.project.name}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {timeEntry.approved ? (
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
          <Button asChild>
            <Link href={`/dashboard/timesheets/${timeEntry.id}/edit`}>
              <Edit className="h-4 w-4 mr-2" />
              Edit Entry
            </Link>
          </Button>
        </div>
      </div>

      {/* Time Entry Details */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {/* Hours Breakdown */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5" />
                Hours Worked
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center p-4 bg-primary/10 rounded-lg">
                  <p className="text-3xl font-bold text-primary">
                    {timeEntry.hoursWorked}
                  </p>
                  <p className="text-sm text-muted-foreground">Regular Hours</p>
                </div>
                <div className="text-center p-4 bg-secondary/10 rounded-lg">
                  <p className="text-3xl font-bold text-secondary">
                    {timeEntry.overtime}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Overtime Hours
                  </p>
                </div>
                <div className="text-center p-4 bg-accent/10 rounded-lg">
                  <p className="text-3xl font-bold text-accent">{totalHours}</p>
                  <p className="text-sm text-muted-foreground">Total Hours</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Description */}
          {timeEntry.description && (
            <Card>
              <CardHeader>
                <CardTitle>Work Description</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-foreground leading-relaxed">
                  {timeEntry.description}
                </p>
              </CardContent>
            </Card>
          )}

          {/* Approval Section */}
          {canApprove && (
            <Card>
              <CardHeader>
                <CardTitle>Approval Required</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <p className="text-muted-foreground">
                    This timesheet entry requires supervisor approval.
                  </p>
                  <ApprovalButton entryId={timeEntry.id} />
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Entry Info */}
          <Card>
            <CardHeader>
              <CardTitle>Entry Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">Date</p>
                  <p className="font-medium">
                    {format(timeEntry.date, 'EEEE, MMMM d, yyyy')}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <User className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">Employee</p>
                  <p className="font-medium">{userName}</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">Status</p>
                  <p className="font-medium">
                    {timeEntry.approved ? 'Approved' : 'Pending Approval'}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Project Info */}
          <Card>
            <CardHeader>
              <CardTitle>Project</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div>
                  <p className="font-medium">{timeEntry.project.name}</p>
                  {timeEntry.project.location && (
                    <p className="text-sm text-muted-foreground">
                      {timeEntry.project.location}
                    </p>
                  )}
                </div>
                <Button
                  asChild
                  variant="outline"
                  size="sm"
                  className="w-full bg-transparent"
                >
                  <Link href={`/dashboard/projects/${timeEntry.projectId}`}>
                    View Project
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
