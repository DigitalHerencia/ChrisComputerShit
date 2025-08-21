import {
  DocumentType,
  EntityType,
  POStatus,
  Priority,
  TaskStatus,
  UserRole,
} from '@prisma/client';
import { prisma } from '../lib/db';

async function main() {
  await prisma.pOItem.deleteMany();
  await prisma.purchaseOrder.deleteMany();
  await prisma.document.deleteMany();
  await prisma.task.deleteMany();
  await prisma.timeEntry.deleteMany();
  await prisma.logPhoto.deleteMany();
  await prisma.dailyLog.deleteMany();
  await prisma.subscription.deleteMany();
  await prisma.project.deleteMany();
  await prisma.entity.deleteMany();
  await prisma.user.deleteMany();

  const client = await prisma.entity.create({
    data: {
      type: EntityType.CLIENT,
      name: 'Acme Construction',
      contactName: 'Bob Builder',
      email: 'client@example.com',
      phone: '555-0100',
      address: '100 Client St',
    },
  });

  const vendor = await prisma.entity.create({
    data: {
      type: EntityType.VENDOR,
      name: 'Bolt Supply Co.',
      contactName: 'Vera Vendor',
      email: 'vendor@example.com',
      phone: '555-0200',
    },
  });

  const admin = await prisma.user.create({
    data: {
      clerkId: 'clerk_admin',
      email: 'admin@example.com',
      firstName: 'Alice',
      lastName: 'Admin',
      role: UserRole.ADMIN,
    },
  });

  const supervisor = await prisma.user.create({
    data: {
      clerkId: 'clerk_supervisor',
      email: 'supervisor@example.com',
      firstName: 'Sam',
      lastName: 'Supervisor',
      role: UserRole.SUPERVISOR,
    },
  });

  const employee = await prisma.user.create({
    data: {
      clerkId: 'clerk_employee',
      email: 'employee@example.com',
      firstName: 'Eve',
      lastName: 'Employee',
      role: UserRole.EMPLOYEE,
    },
  });

  const project = await prisma.project.create({
    data: {
      name: 'Skyline Tower',
      description: 'Downtown high-rise construction',
      location: '123 Main St',
      startDate: new Date('2025-01-01'),
      clientId: client.id,
      createdById: admin.id,
    },
  });

  await prisma.task.create({
    data: {
      projectId: project.id,
      title: 'Excavation',
      description: 'Prepare site and dig foundations',
      dueDate: new Date('2025-01-10'),
      status: TaskStatus.IN_PROGRESS,
      priority: Priority.HIGH,
      assigneeId: employee.id,
    },
  });

  await prisma.task.create({
    data: {
      projectId: project.id,
      title: 'Order materials',
      dueDate: new Date('2025-01-05'),
      status: TaskStatus.TODO,
      priority: Priority.MEDIUM,
    },
  });

  await prisma.dailyLog.create({
    data: {
      projectId: project.id,
      date: new Date('2025-01-02'),
      weather: 'Sunny',
      crewCount: 5,
      workDone: 'Groundwork completed',
      notes: 'No issues',
      createdById: supervisor.id,
      photos: {
        create: [
          {
            url: 'https://example.com/photos/foundation.jpg',
            caption: 'Foundation work',
          },
          {
            url: 'https://example.com/photos/site.jpg',
            caption: 'Site overview',
          },
        ],
      },
    },
  });

  await prisma.timeEntry.create({
    data: {
      projectId: project.id,
      userId: employee.id,
      date: new Date('2025-01-02'),
      hoursWorked: 8,
      overtime: 1,
      description: 'Excavation work',
      approved: true,
      approvedById: supervisor.id,
    },
  });

  await prisma.document.create({
    data: {
      projectId: project.id,
      title: 'Building Permit',
      type: DocumentType.PERMIT,
      url: 'https://example.com/docs/permit.pdf',
      fileSize: 123456,
      mimeType: 'application/pdf',
      uploadedById: admin.id,
    },
  });

  await prisma.purchaseOrder.create({
    data: {
      projectId: project.id,
      vendorId: vendor.id,
      poNumber: 'PO-1001',
      description: 'Concrete and supplies',
      totalAmount: 5000,
      status: POStatus.ORDERED,
      expectedDate: new Date('2025-01-07'),
      items: {
        create: [
          {
            description: 'Concrete mix',
            quantity: 100,
            unitPrice: 40,
            totalPrice: 4000,
          },
          {
            description: 'Rebar',
            quantity: 50,
            unitPrice: 20,
            totalPrice: 1000,
          },
        ],
      },
    },
  });

  await prisma.subscription.create({
    data: {
      id: 'sub_admin',
      userId: admin.id,
      status: 'active',
      planId: 'pro',
      trialEndsAt: new Date('2025-02-01'),
    },
  });

  console.log('Database seeded');
}

main()
  .then(() => process.exit(0))
  .catch((e) => {
    console.error(e);
    process.exit(1);
  });
