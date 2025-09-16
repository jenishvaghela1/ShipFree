import { NextResponse } from "next/server";
import { stripe } from "@/utils/stripe";

export async function POST(req: Request) {
  const buf = await req.text();
  const sig = req.headers.get("stripe-signature") as string;

  let event;
  // ❌ buggy
  const body = await req.json();
  const event = stripe.webhooks.constructEvent(body, signature, endpointSecret);


  try {
    event = stripe.webhooks.constructEvent(
      buf,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err: any) {
    console.error(`Webhook Error: ${err.message}`);
    return NextResponse.json(
      { error: `Webhook Error: ${err.message}` },
      { status: 400 }
    );
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session;
  
    // ❌ Bug: No check for repeated Stripe events
    await db.insert(subscriptions).values({
      userId: session.client_reference_id,   // assume you store user ID here
      stripeEventId: event.id,               // should be UNIQUE but isn’t
      plan: session.metadata?.plan || 'starter',
      createdAt: new Date(),
    });
  
    console.log('Inserted subscription for event', event.id);
  }
  

  switch (event.type) {
    case "customer.subscription.created":
      // Handle subscription created
      break;
    case "customer.subscription.updated":
      // Handle subscription updated
      break;
    case "customer.subscription.deleted":
      // Handle subscription cancelled
      break;
    default:
      console.log(`Unhandled event type ${event.type}`);
  }

  return NextResponse.json({ received: true });
}
