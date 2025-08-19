"use client"

import type React from "react"

import { useState, useRef } from "react"
import { useRouter } from "next/navigation"
import { useUser } from "@clerk/nextjs"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"
import { Loader2, Save, ArrowLeft, Camera, X } from "lucide-react"
import Link from "next/link"

interface DailyLogFormProps {
  projects: { id: string; name: string }[]
  defaultProjectId?: string
  log?: {
    id: string
    date: Date
    weather?: string | null
    crewCount?: number | null
    workDone: string
    notes?: string | null
    projectId: string
  }
}

interface PhotoPreview {
  file: File
  url: string
  caption: string
}

export function DailyLogForm({ projects, defaultProjectId, log }: DailyLogFormProps) {
  const router = useRouter()
  const { user } = useUser()
  const { toast } = useToast()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [photos, setPhotos] = useState<PhotoPreview[]>([])

  const [formData, setFormData] = useState({
    projectId: log?.projectId || defaultProjectId || "",
    date: log?.date ? log.date.toISOString().split("T")[0] : new Date().toISOString().split("T")[0],
    weather: log?.weather || "",
    crewCount: log?.crewCount?.toString() || "",
    workDone: log?.workDone || "",
    notes: log?.notes || "",
  })

  const handlePhotoSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])

    files.forEach((file) => {
      if (file.type.startsWith("image/")) {
        const url = URL.createObjectURL(file)
        setPhotos((prev) => [...prev, { file, url, caption: "" }])
      }
    })

    // Reset input
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  const removePhoto = (index: number) => {
    setPhotos((prev) => {
      const newPhotos = [...prev]
      URL.revokeObjectURL(newPhotos[index].url)
      newPhotos.splice(index, 1)
      return newPhotos
    })
  }

  const updatePhotoCaption = (index: number, caption: string) => {
    setPhotos((prev) => {
      const newPhotos = [...prev]
      newPhotos[index].caption = caption
      return newPhotos
    })
  }

  const uploadPhotos = async (logId: string) => {
    const uploadPromises = photos.map(async (photo) => {
      const formData = new FormData()
      formData.append("file", photo.file)
      formData.append("logId", logId)
      formData.append("caption", photo.caption)

      const response = await fetch("/api/logs/photos", {
        method: "POST",
        body: formData,
      })

      if (!response.ok) {
        throw new Error("Failed to upload photo")
      }

      return response.json()
    })

    return Promise.all(uploadPromises)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user) return

    setIsLoading(true)

    try {
      const url = log ? `/api/logs/${log.id}` : "/api/logs"
      const method = log ? "PUT" : "POST"

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          date: new Date(formData.date),
          crewCount: formData.crewCount ? Number.parseInt(formData.crewCount) : null,
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to save daily log")
      }

      const savedLog = await response.json()

      // Upload photos if any
      if (photos.length > 0 && !log) {
        await uploadPhotos(savedLog.id)
      }

      toast({
        title: log ? "Log updated" : "Log created",
        description: `Daily log has been ${log ? "updated" : "created"} successfully.`,
      })

      router.push(`/dashboard/logs/${savedLog.id}`)
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save daily log. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" asChild>
            <Link href="/dashboard/logs">
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <CardTitle>{log ? "Edit Daily Log" : "Create Daily Log"}</CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="projectId">Project *</Label>
              <Select
                value={formData.projectId}
                onValueChange={(value) => setFormData({ ...formData, projectId: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a project" />
                </SelectTrigger>
                <SelectContent>
                  {projects.map((project) => (
                    <SelectItem key={project.id} value={project.id}>
                      {project.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="date">Date *</Label>
              <Input
                id="date"
                type="date"
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="weather">Weather</Label>
              <Select value={formData.weather} onValueChange={(value) => setFormData({ ...formData, weather: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Select weather" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="sunny">Sunny</SelectItem>
                  <SelectItem value="cloudy">Cloudy</SelectItem>
                  <SelectItem value="rainy">Rainy</SelectItem>
                  <SelectItem value="windy">Windy</SelectItem>
                  <SelectItem value="hot">Hot</SelectItem>
                  <SelectItem value="cold">Cold</SelectItem>
                  <SelectItem value="overcast">Overcast</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="crewCount">Crew Count</Label>
              <Input
                id="crewCount"
                type="number"
                min="1"
                value={formData.crewCount}
                onChange={(e) => setFormData({ ...formData, crewCount: e.target.value })}
                placeholder="Number of crew members"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="workDone">Work Completed *</Label>
            <Textarea
              id="workDone"
              value={formData.workDone}
              onChange={(e) => setFormData({ ...formData, workDone: e.target.value })}
              placeholder="Describe the work completed today..."
              rows={4}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Notes</Label>
            <Textarea
              id="notes"
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              placeholder="Additional notes, issues, or observations..."
              rows={3}
            />
          </div>

          {/* Photo Upload Section */}
          {!log && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label>Photos</Label>
                <Button type="button" variant="outline" size="sm" onClick={() => fileInputRef.current?.click()}>
                  <Camera className="h-4 w-4 mr-2" />
                  Add Photos
                </Button>
              </div>

              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                multiple
                onChange={handlePhotoSelect}
                className="hidden"
              />

              {photos.length > 0 && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {photos.map((photo, index) => (
                    <div key={index} className="relative border rounded-lg p-4">
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="absolute top-2 right-2 h-6 w-6"
                        onClick={() => removePhoto(index)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                      <img
                        src={photo.url || "/placeholder.svg"}
                        alt="Preview"
                        className="w-full h-32 object-cover rounded-md mb-2"
                      />
                      <Input
                        placeholder="Photo caption (optional)"
                        value={photo.caption}
                        onChange={(e) => updatePhotoCaption(index, e.target.value)}
                        className="text-sm"
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          <div className="flex gap-4 pt-6">
            <Button type="submit" disabled={isLoading} className="flex-1">
              {isLoading && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
              <Save className="h-4 w-4 mr-2" />
              {log ? "Update Log" : "Create Log"}
            </Button>
            <Button type="button" variant="outline" asChild>
              <Link href="/dashboard/logs">Cancel</Link>
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
