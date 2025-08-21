'use client';

import type React from 'react';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Upload, FileText, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface DocumentFormProps {
  projects: { id: string; name: string }[];
  defaultProjectId?: string;
  document?: {
    id: string;
    title: string;
    description: string | null;
    type: string;
    projectId: string | null;
  };
}

export function DocumentForm({
  projects,
  defaultProjectId,
  document,
}: DocumentFormProps) {
  const router = useRouter();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const formData = new FormData(e.currentTarget);

      if (selectedFile) {
        formData.append('file', selectedFile);
      }

      const url = document ? `/api/documents/${document.id}` : '/api/documents';

      const method = document ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Failed to save document');
      }

      const result = await response.json();

      toast({
        title: 'Success',
        description: document
          ? 'Document updated successfully'
          : 'Document uploaded successfully',
      });

      router.push(`/dashboard/documents/${result.id}`);
    } catch (error) {
      console.error('Error saving document:', error);
      toast({
        title: 'Error',
        description: 'Failed to save document. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="max-w-2xl">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="h-5 w-5" />
          {document ? 'Edit Document' : 'Upload New Document'}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* File Upload */}
          {!document && (
            <div className="space-y-2">
              <Label htmlFor="file">File *</Label>
              <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-6">
                <div className="text-center">
                  <Upload className="mx-auto h-12 w-12 text-muted-foreground/50 mb-4" />
                  <div className="space-y-2">
                    <Label htmlFor="file" className="cursor-pointer">
                      <span className="text-primary hover:text-primary/80">
                        Click to upload
                      </span>{' '}
                      or drag and drop
                    </Label>
                    <p className="text-sm text-muted-foreground">
                      PDF, DOC, DOCX, JPG, PNG up to 10MB
                    </p>
                  </div>
                  <Input
                    id="file"
                    name="file"
                    type="file"
                    className="hidden"
                    onChange={handleFileChange}
                    accept=".pdf,.doc,.docx,.jpg,.jpeg,.png,.gif"
                    required={!document}
                  />
                </div>
                {selectedFile && (
                  <div className="mt-4 p-3 bg-muted rounded-lg">
                    <p className="text-sm font-medium">{selectedFile.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {Math.round(selectedFile.size / 1024)} KB
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Title */}
          <div className="space-y-2">
            <Label htmlFor="title">Title *</Label>
            <Input
              id="title"
              name="title"
              defaultValue={document?.title}
              placeholder="Enter document title"
              required
            />
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              name="description"
              defaultValue={document?.description || ''}
              placeholder="Enter document description"
              rows={3}
            />
          </div>

          {/* Type */}
          <div className="space-y-2">
            <Label htmlFor="type">Document Type *</Label>
            <Select
              name="type"
              defaultValue={document?.type || 'CONTRACT'}
              required
            >
              <SelectTrigger>
                <SelectValue placeholder="Select document type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="CONTRACT">Contract</SelectItem>
                <SelectItem value="PERMIT">Permit</SelectItem>
                <SelectItem value="PLAN">Plan</SelectItem>
                <SelectItem value="PHOTO">Photo</SelectItem>
                <SelectItem value="INVOICE">Invoice</SelectItem>
                <SelectItem value="REPORT">Report</SelectItem>
                <SelectItem value="OTHER">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Project */}
          <div className="space-y-2">
            <Label htmlFor="projectId">Project</Label>
            <Select
              name="projectId"
              defaultValue={
                document?.projectId || defaultProjectId || 'NO_PROJECT'
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select project (optional)" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="NO_PROJECT">No Project</SelectItem>
                {projects.map((project) => (
                  <SelectItem key={project.id} value={project.id}>
                    {project.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-4 pt-4">
            <Button type="submit" disabled={isLoading}>
              {isLoading && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
              {document ? 'Update Document' : 'Upload Document'}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => router.back()}
            >
              Cancel
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
