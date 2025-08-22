import Link from 'next/link';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Calendar, Users, Camera, Cloud, Eye } from 'lucide-react';
import { format } from 'date-fns';

interface DailyLogCardProps {
  log: {
    id: string;
    date: Date;
    weather?: string | null;
    crewCount?: number | null;
    workDone: string;
    notes?: string | null;
    project: { name: string; status: string };
    createdBy: { firstName: string | null; lastName: string | null };
    photos: { id: string; url: string; caption?: string | null }[];
    _count: { photos: number };
  };
}

export function DailyLogCard({ log }: DailyLogCardProps) {
  const createdByName =
    `${log.createdBy.firstName || ''} ${log.createdBy.lastName || ''}`.trim();

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex flex-col gap-1">
            <h2 className="text-lg font-semibold">{log.project.name}</h2>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Calendar className="h-4 w-4" />
              <span className="font-medium">
                {format(log.date, 'EEEE, MMM d, yyyy')}
              </span>
            </div>
          </div>
          <Button asChild variant="outline" size="sm">
            <Link href={`/dashboard/logs/${log.id}`}>
              <Eye className="h-4 w-4 mr-2" />
              View
            </Link>
          </Button>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Weather and Crew Info */}
        <div className="flex items-center gap-6 text-sm text-muted-foreground">
          {log.weather && (
            <div className="flex items-center gap-2">
              <Cloud className="h-4 w-4" />
              <span>{log.weather}</span>
            </div>
          )}
          {log.crewCount && (
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              <span>{log.crewCount} crew members</span>
            </div>
          )}
          {log._count.photos > 0 && (
            <div className="flex items-center gap-2">
              <Camera className="h-4 w-4" />
              <span>{log._count.photos} photos</span>
            </div>
          )}
        </div>

        {/* Work Done */}
        <div>
          <h3 className="font-medium mb-2">Work Completed</h3>
          <p className="text-sm text-muted-foreground line-clamp-3">
            {log.workDone}
          </p>
        </div>

        {/* Notes */}
        {log.notes && (
          <div>
            <h4 className="font-medium mb-1 text-sm">Notes</h4>
            <p className="text-sm text-muted-foreground line-clamp-2">
              {log.notes}
            </p>
          </div>
        )}

        {/* Photos Preview */}
        {log.photos.length > 0 && (
          <div>
            <h4 className="font-medium mb-2 text-sm">Photos</h4>
            <div className="flex gap-2 overflow-x-auto">
              {log.photos.slice(0, 4).map((photo) => (
                <div key={photo.id} className="flex-shrink-0">
                  <img
                    src={photo.url || '/placeholder.svg'}
                    alt={photo.caption || 'Daily log photo'}
                    className="w-16 h-16 object-cover rounded-md border"
                  />
                </div>
              ))}
              {log.photos.length > 4 && (
                <div className="flex-shrink-0 w-16 h-16 bg-muted rounded-md border flex items-center justify-center">
                  <span className="text-xs text-muted-foreground">
                    +{log.photos.length - 4}
                  </span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="flex items-center justify-between pt-2 border-t text-xs text-muted-foreground">
          <span>Logged by {createdByName}</span>
          <span>{format(log.date, 'h:mm a')}</span>
        </div>
      </CardContent>
    </Card>
  );
}
