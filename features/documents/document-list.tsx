import { currentUser } from '@clerk/nextjs/server';
import { prisma } from '@/lib/db';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { DocumentCard } from '@/components/documents/document-card';
import {
  Plus,
  Search,
  Filter,
  FileText,
  HardDrive,
  Tag,
  FolderOpen,
} from 'lucide-react';

interface DocumentListProps {
  searchParams: { search?: string; type?: string; project?: string };
}

export async function DocumentList({ searchParams }: DocumentListProps) {
  const user = await currentUser();
  if (!user) return null;

  const dbUser = await prisma.user.findUnique({
    where: { clerkId: user.id },
  });

  if (!dbUser) return null;

  const where: any = {};

  if (searchParams.search) {
    where.OR = [
      { title: { contains: searchParams.search, mode: 'insensitive' } },
      { description: { contains: searchParams.search, mode: 'insensitive' } },
    ];
  }

  if (searchParams.type && searchParams.type !== 'all') {
    where.type = searchParams.type;
  }

  if (searchParams.project && searchParams.project !== 'all') {
    where.projectId = searchParams.project;
  }

  const [documents, projects, stats] = await Promise.all([
    prisma.document.findMany({
      where,
      include: {
        project: { select: { name: true } },
        uploadedBy: { select: { firstName: true, lastName: true } },
      },
      orderBy: { createdAt: 'desc' },
    }),
    prisma.project.findMany({
      select: { id: true, name: true },
      orderBy: { name: 'asc' },
    }),
    prisma.document.groupBy({
      by: ['type'],
      _count: { type: true },
    }),
  ]);

  const totalDocuments = documents.length;
  const totalSize = documents.reduce(
    (sum, doc) => sum + (doc.fileSize || 0),
    0
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Documents</h1>
          <p className="text-muted-foreground">
            Manage project documents and files
          </p>
        </div>
        <Button asChild>
          <Link href="/dashboard/documents/new">
            <Plus className="h-4 w-4 mr-2" />
            Upload Document
          </Link>
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              <div>
                <div className="text-2xl font-bold">{totalDocuments}</div>
                <p className="text-sm text-muted-foreground">Total Documents</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-2">
              <HardDrive className="h-5 w-5" />
              <div>
                <div className="text-2xl font-bold">
                  {Math.round(totalSize / 1024 / 1024)}MB
                </div>
                <p className="text-sm text-muted-foreground">Storage Used</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-2">
              <Tag className="h-5 w-5" />
              <div>
                <div className="text-2xl font-bold">{stats.length}</div>
                <p className="text-sm text-muted-foreground">Document Types</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-2">
              <FolderOpen className="h-5 w-5" />
              <div>
                <div className="text-2xl font-bold">{projects.length}</div>
                <p className="text-sm text-muted-foreground">Projects</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Filters
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  name="search"
                  placeholder="Search documents..."
                  defaultValue={searchParams.search}
                  className="pl-10"
                />
              </div>
            </div>
            <Select name="type" defaultValue={searchParams.type || 'all'}>
              <SelectTrigger className="w-full sm:w-48">
                <SelectValue placeholder="Document Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="CONTRACT">Contract</SelectItem>
                <SelectItem value="PERMIT">Permit</SelectItem>
                <SelectItem value="PLAN">Plan</SelectItem>
                <SelectItem value="PHOTO">Photo</SelectItem>
                <SelectItem value="INVOICE">Invoice</SelectItem>
                <SelectItem value="REPORT">Report</SelectItem>
                <SelectItem value="OTHER">Other</SelectItem>
              </SelectContent>
            </Select>
            <Select name="project" defaultValue={searchParams.project || 'all'}>
              <SelectTrigger className="w-full sm:w-48">
                <SelectValue placeholder="Project" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Projects</SelectItem>
                {projects.map((project) => (
                  <SelectItem key={project.id} value={project.id}>
                    {project.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button type="submit" variant="outline">
              Apply Filters
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Documents Grid */}
      {documents.length === 0 ? (
        <Card>
          <CardContent className="py-12">
            <div className="text-center">
              <div className="mx-auto w-12 h-12 bg-muted rounded-lg flex items-center justify-center mb-4">
                <Search className="h-6 w-6 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-medium mb-2">No documents found</h3>
              <p className="text-muted-foreground mb-4">
                {searchParams.search ||
                searchParams.type ||
                searchParams.project
                  ? 'Try adjusting your filters or search terms'
                  : 'Upload your first document to get started'}
              </p>
              <Button asChild>
                <Link href="/dashboard/documents/new">
                  <Plus className="h-4 w-4 mr-2" />
                  Upload Document
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"></div>
      )}
    </div>
  );
}
