import { NextRequest, NextResponse } from 'next/server';
import { Webhook } from 'svix';
import type { WebhookEvent } from '@clerk/nextjs/server';

import { prisma } from '@/lib/db';

const WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SECRET;

export async function POST(req: NextRequest) {
  if (!WEBHOOK_SECRET) {
    return NextResponse.json(
      { error: 'Missing Clerk webhook secret' },
      { status: 500 }
    );
  }

  const payload = await req.text();
  const headers = {
    'svix-id': req.headers.get('svix-id') ?? '',
    'svix-timestamp': req.headers.get('svix-timestamp') ?? '',
    'svix-signature': req.headers.get('svix-signature') ?? '',
  };

  let evt: WebhookEvent;

  try {
    const wh = new Webhook(WEBHOOK_SECRET);
    evt = wh.verify(payload, headers) as WebhookEvent;
  } catch (err) {
    console.error('Webhook verification failed', err);
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
  }

  try {
    switch (evt.type) {
      case 'user.created':
      case 'user.updated': {
        const { id, email_addresses, first_name, last_name } = evt.data;
        await prisma.user.upsert({
          where: { clerkId: id },
          create: {
            clerkId: id,
            email: email_addresses[0]?.email_address || '',
            firstName: first_name || null,
            lastName: last_name || null,
          },
          update: {
            email: email_addresses[0]?.email_address || '',
            firstName: first_name || null,
            lastName: last_name || null,
          },
        });
        break;
      }
      case 'user.deleted': {
        const { id } = evt.data;
        await prisma.user.delete({ where: { clerkId: id } });
        break;
      }
      case 'subscription.created':
      case 'subscription.updated': {
        const sub: any = evt.data;
        const user = await prisma.user.upsert({
          where: { clerkId: sub.user_id },
          update: {},
          create: {
            clerkId: sub.user_id,
            email: '',
          },
        });

        await prisma.subscription.upsert({
          where: { id: sub.id },
          create: {
            id: sub.id,
            userId: user.id,
            status: sub.status,
            planId: sub.plan_id ?? null,
            trialEndsAt: sub.trial_ends_at ? new Date(sub.trial_ends_at) : null,
          },
          update: {
            status: sub.status,
            planId: sub.plan_id ?? null,
            trialEndsAt: sub.trial_ends_at ? new Date(sub.trial_ends_at) : null,
          },
        });
        break;
      }
      case 'subscriptionItem.canceled': {
        const sub: any = evt.data;
        await prisma.subscription.delete({ where: { id: sub.id } });
        break;
      }
      default:
        break;
    }
  } catch (error) {
    console.error('Error handling Clerk webhook', error);
    return NextResponse.json(
      { error: 'Webhook handler error' },
      { status: 500 }
    );
  }

  return NextResponse.json({ received: true });
}
