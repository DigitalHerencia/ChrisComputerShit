import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  FileText,
  ImageIcon,
  FileImage,
  Download,
  Eye,
  Calendar,
  User,
  FolderOpen,
} from 'lucide-react';
import { format } from 'date-fns';

interface DocumentCardProps {
  document: {
    id: string;
    title: string;
    description: string | null;
    type: string;
    url: string;
    fileSize: number | null;
    mimeType: string | null;
    createdAt: Date;
    project: { name: string } | null;
    uploadedBy: { firstName: string | null; lastName: string | null };
  };
}

export function DocumentCard({ document }: DocumentCardProps) {
  const getFileIcon = (mimeType: string | null, type: string) => {
    if (mimeType?.startsWith('image/')) {
      return <ImageIcon className="h-8 w-8" />;
    }
    if (type === 'PHOTO') {
      return <FileImage className="h-8 w-8" />;
    }
    return <FileText className="h-8 w-8" />;
  };

  const getTypeColor = (type: string) => {
    const colors = {
      CONTRACT: 'bg-blue-100 text-blue-800 border-blue-200',
      PERMIT: 'bg-green-100 text-green-800 border-green-200',
      PLAN: 'bg-purple-100 text-purple-800 border-purple-200',
      PHOTO: 'bg-orange-100 text-orange-800 border-orange-200',
      INVOICE: 'bg-red-100 text-red-800 border-red-200',
      REPORT: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      OTHER: 'bg-gray-100 text-gray-800 border-gray-200',
    };
    return colors[type as keyof typeof colors] || colors.OTHER;
  };

  const formatFileSize = (bytes: number | null) => {
    if (!bytes) return 'Unknown size';
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return Math.round((bytes / Math.pow(1024, i)) * 100) / 100 + ' ' + sizes[i];
  };

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="p-6">
        {/* File Icon and Type */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-muted rounded-lg text-muted-foreground">
              {getFileIcon(document.mimeType, document.type)}
            </div>
            <Badge variant="outline" className={getTypeColor(document.type)}>
              {document.type.replace('_', ' ')}
            </Badge>
          </div>
        </div>

        {/* Document Info */}
        <div className="space-y-2 mb-4">
          <h3 className="font-semibold text-lg line-clamp-2">
            {document.title}
          </h3>
          {document.description && (
            <p className="text-sm text-muted-foreground line-clamp-2">
              {document.description}
            </p>
          )}
          <p className="text-xs text-muted-foreground font-mono">
            {document.url.split('/').pop()}
          </p>
        </div>

        {/* Metadata */}
        <div className="space-y-2 text-xs text-muted-foreground mb-4">
          {document.project && (
            <div className="flex items-center gap-1">
              <FolderOpen className="h-3 w-3" />
              <span>{document.project.name}</span>
            </div>
          )}
          <div className="flex items-center gap-1">
            <User className="h-3 w-3" />
            <span>
              {document.uploadedBy.firstName} {document.uploadedBy.lastName}
            </span>
          </div>
          <div className="flex items-center gap-1">
            <Calendar className="h-3 w-3" />
            <span>{format(document.createdAt, 'MMM d, yyyy')}</span>
          </div>
          {document.fileSize && (
            <div className="text-xs">{formatFileSize(document.fileSize)}</div>
          )}
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2">
          <Button asChild size="sm" className="flex-1">
            <Link href={`/dashboard/documents/${document.id}`}>
              <Eye className="h-4 w-4 mr-2" />
              View
            </Link>
          </Button>
          <Button variant="outline" size="sm" asChild>
            <a href={document.url} download>
              <Download className="h-4 w-4" />
            </a>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
