import Link from 'next/link';
import { notFound } from 'next/navigation';
import { currentUser } from '@clerk/nextjs/server';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  ArrowLeft,
  Edit,
  Download,
  FileText,
  Calendar,
  User,
  FolderOpen,
  FileIcon as FileSize,
} from 'lucide-react';
import { format } from 'date-fns';
import { getDocument } from '@/lib/fetchers/documents';

interface DocumentDetailProps {
  id: string;
}

export async function DocumentDetail({ id }: DocumentDetailProps) {
  const user = await currentUser();
  if (!user) return null;

  const document = await getDocument(id);
  if (!document) {
    notFound();
  }

  const getTypeColor = (type: string) => {
    const colors = {
      CONTRACT: 'bg-blue-100 text-blue-800 border-blue-200',
      PERMIT: 'bg-green-100 text-green-800 border-green-200',
      PLAN: 'bg-purple-100 text-purple-800 border-purple-200',
      PHOTO: 'bg-orange-100 text-orange-800 border-orange-200',
      INVOICE: 'bg-red-100 text-red-800 border-red-200',
      REPORT: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      OTHER: 'bg-gray-100 text-gray-800 border-gray-200',
    } as const;
    return colors[type as keyof typeof colors] || colors.OTHER;
  };

  const formatFileSize = (bytes: number | null) => {
    if (!bytes) return 'Unknown size';
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return (
      Math.round((bytes / Math.pow(1024, i)) * 100) / 100 + ' ' + sizes[i]
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" asChild>
            <Link href="/dashboard/documents">
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-foreground">
              {document.title}
            </h1>
            <p className="text-muted-foreground">
              Document details and preview
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className={getTypeColor(document.type)}>
            {document.type.replace('_', ' ')}
          </Badge>
          <Button asChild>
            <a href={document.url} download>
              <Download className="h-4 w-4 mr-2" />
              Download
            </a>
          </Button>
          <Button asChild>
            <Link href={`/dashboard/documents/${document.id}/edit`}>
              <Edit className="h-4 w-4 mr-2" />
              Edit
            </Link>
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Document Preview */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Document Preview
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="aspect-[4/3] bg-muted rounded-lg flex items-center justify-center">
                <div className="text-center">
                  {document.mimeType ? (
                    <embed
                      className="w-full h-full"
                      src={document.url}
                      type={document.mimeType}
                    />
                  ) : (
                    <FileText className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                  )}
                  <p className="text-sm text-muted-foreground mb-4">
                    Preview not available for this file type
                  </p>
                  <Button variant="outline" asChild>
                    <a href={document.url} download>
                      <Download className="h-4 w-4 mr-2" />
                      Download to View
                    </a>
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Document Info */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Document Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">Title</p>
                  <p className="font-medium">{document.title}</p>
                </div>
              </div>

              {document.fileSize && (
                <div className="flex items-center gap-2">
                  <FileSize className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">File Size</p>
                    <p className="font-medium">
                      {formatFileSize(document.fileSize)}
                    </p>
                  </div>
                </div>
              )}

              {document.project && (
                <div className="flex items-center gap-2">
                  <FolderOpen className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">Project</p>
                    <Link
                      href={`/dashboard/projects/${document.id}`}
                      className="font-medium text-primary hover:underline"
                    >
                      {document.project.name}
                    </Link>
                  </div>
                </div>
              )}

              <div className="flex items-center gap-2">
                <User className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">Uploaded By</p>
                  <p className="font-medium">
                    {document.uploadedBy.firstName}{' '}
                    {document.uploadedBy.lastName}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">Upload Date</p>
                  <p className="font-medium">
                    {format(document.createdAt, "MMM d, yyyy 'at' h:mm a")}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

