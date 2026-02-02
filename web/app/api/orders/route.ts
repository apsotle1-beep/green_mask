import { NextResponse } from 'next/server';
import { getOrders, addOrder } from '@/lib/db';
import { cookies } from 'next/headers';

export async function GET() {
    const cookieStore = await cookies();
    const token = cookieStore.get('admin_token');

    if (!token || token.value !== 'authenticated') {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const orders = getOrders();
    // Sort by newest first
    const sortedOrders = orders.sort((a, b) => new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime());
    return NextResponse.json(sortedOrders);
}

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { orderId, name, email, phone, city, area, address, quantity, whatsapp, landmark, submittedAt } = body;

        // Basic validation handled in frontend, but good to have here too
        if (!name || !phone || !city || !address) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        const newOrder = addOrder({
            orderId,
            name,
            email,
            phone,
            whatsapp,
            city,
            area,
            address,
            landmark,
            quantity,
            submittedAt
        });

        // Trigger Webhook for New Order
        try {
            await fetch("https://n8n.srv1245507.hstgr.cloud/webhook/pending", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(newOrder),
            });
        } catch (webhookError) {
            console.error("Failed to trigger webhook:", webhookError);
        }

        return NextResponse.json(newOrder, { status: 201 });
    } catch (error) {
        console.error('Error processing order:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
