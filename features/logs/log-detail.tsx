import Link from 'next/link';
import { notFound } from 'next/navigation';
import { currentUser } from '@clerk/nextjs/server';
import { prisma } from '@/lib/db';
import { deleteDailyLog } from '@/lib/actions/logs';
import { format } from 'date-fns';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  ArrowLeft,
  Edit,
  Calendar,
  Cloud,
  Users,
  Camera,
  MapPin,
  Trash2,
} from 'lucide-react';

interface LogDetailProps {
  id: string;
}

export async function LogDetail({ id }: LogDetailProps) {
  const user = await currentUser();
  if (!user) return null;

  const dailyLog = await prisma.dailyLog.findUnique({
    where: { id },
    include: {
      project: { select: { name: true, location: true } },
      createdBy: { select: { firstName: true, lastName: true } },
      photos: true,
    },
  });

  if (!dailyLog) {
    notFound();
  }

  const createdByName = `${dailyLog.createdBy.firstName || ''} ${
    dailyLog.createdBy.lastName || ''
  }`.trim();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" asChild>
            <Link href="/dashboard/logs">
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-foreground">
              Daily Log - {format(dailyLog.date, 'MMM d, yyyy')}
            </h1>
            <p className="text-muted-foreground">{dailyLog.project.name}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button asChild>
            <Link href={`/dashboard/logs/${dailyLog.id}/edit`}>
              <Edit className="h-4 w-4 mr-2" />
              Edit Log
            </Link>
          </Button>
          <form action={deleteDailyLog}>
            <input type="hidden" name="id" value={dailyLog.id} />
            <Button variant="destructive" type="submit">
              <Trash2 className="h-4 w-4 mr-2" />
              Delete
            </Button>
          </form>
        </div>
      </div>

      {/* Log Details */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {/* Main Content */}
          <Card>
            <CardHeader>
              <CardTitle>Work Completed</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-foreground leading-relaxed">
                {dailyLog.workDone}
              </p>
            </CardContent>
          </Card>

          {/* Notes */}
          {dailyLog.notes && (
            <Card>
              <CardHeader>
                <CardTitle>Notes</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-foreground leading-relaxed">
                  {dailyLog.notes}
                </p>
              </CardContent>
            </Card>
          )}

          {/* Photos */}
          {dailyLog.photos.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Camera className="h-5 w-5" />
                  Photos ({dailyLog.photos.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {dailyLog.photos.map((photo) => (
                    <div key={photo.id} className="space-y-2">
                      <img
                        src={photo.url || '/placeholder.svg'}
                        alt={photo.caption || 'Daily log photo'}
                        className="w-full h-48 object-cover rounded-lg border"
                      />
                      {photo.caption && (
                        <p className="text-sm text-muted-foreground">
                          {photo.caption}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Log Info */}
          <Card>
            <CardHeader>
              <CardTitle>Log Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">Date</p>
                  <p className="font-medium">
                    {format(dailyLog.date, 'EEEE, MMMM d, yyyy')}
                  </p>
                </div>
              </div>

              {dailyLog.weather && (
                <div className="flex items-center gap-2">
                  <Cloud className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">Weather</p>
                    <p className="font-medium capitalize">{dailyLog.weather}</p>
                  </div>
                </div>
              )}

              {dailyLog.crewCount && (
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">Crew Size</p>
                    <p className="font-medium">{dailyLog.crewCount} members</p>
                  </div>
                </div>
              )}

              {dailyLog.project.location && (
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">Location</p>
                    <p className="font-medium">{dailyLog.project.location}</p>
                  </div>
                </div>
              )}
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
                  <p className="font-medium">{dailyLog.project.name}</p>
                  {dailyLog.project.location && (
                    <p className="text-sm text-muted-foreground">
                      {dailyLog.project.location}
                    </p>
                  )}
                </div>
                <Button
                  asChild
                  variant="outline"
                  size="sm"
                  className="w-full bg-transparent"
                >
                  <Link href={`/dashboard/projects/${dailyLog.projectId}`}>
                    View Project
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Created By */}
          <Card>
            <CardHeader>
              <CardTitle>Created By</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="font-medium">{createdByName}</p>
              <p className="text-sm text-muted-foreground">
                {format(dailyLog.createdAt, "MMM d, yyyy 'at' h:mm a")}
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
