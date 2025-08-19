-- Rename column and add foreign key
ALTER TABLE "time_entries" RENAME COLUMN "approvedBy" TO "approvedById";
ALTER TABLE "time_entries" ADD CONSTRAINT "time_entries_approvedById_fkey" FOREIGN KEY ("approvedById") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- Indexes for relations
CREATE INDEX "projects_clientId_idx" ON "projects" ("clientId");
CREATE INDEX "projects_createdById_idx" ON "projects" ("createdById");

CREATE INDEX "daily_logs_projectId_idx" ON "daily_logs" ("projectId");
CREATE INDEX "daily_logs_createdById_idx" ON "daily_logs" ("createdById");

CREATE INDEX "log_photos_logId_idx" ON "log_photos" ("logId");

CREATE INDEX "time_entries_projectId_idx" ON "time_entries" ("projectId");
CREATE INDEX "time_entries_userId_idx" ON "time_entries" ("userId");
CREATE INDEX "time_entries_approvedById_idx" ON "time_entries" ("approvedById");

CREATE INDEX "tasks_projectId_idx" ON "tasks" ("projectId");
CREATE INDEX "tasks_assigneeId_idx" ON "tasks" ("assigneeId");

CREATE INDEX "documents_projectId_idx" ON "documents" ("projectId");
CREATE INDEX "documents_uploadedById_idx" ON "documents" ("uploadedById");

CREATE INDEX "purchase_orders_projectId_idx" ON "purchase_orders" ("projectId");
CREATE INDEX "purchase_orders_vendorId_idx" ON "purchase_orders" ("vendorId");

CREATE INDEX "po_items_poId_idx" ON "po_items" ("poId");
