import { NextResponse } from 'next/server';
import { updateOrderStatus, getOrders } from '@/lib/db';

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const { status } = await request.json();

    if (!['PENDING', 'PLACED', 'RECIEVED'].includes(status)) {
        return NextResponse.json({ error: 'Invalid status' }, { status: 400 });
    }

    const updatedOrder = updateOrderStatus(id, status);

    if (!updatedOrder) {
        return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }

    // Trigger Webhook based on status
    let webhookUrl = "";
    if (status === 'PLACED') {
        webhookUrl = "https://n8n.srv1245507.hstgr.cloud/webhook/placed";
    } else if (status === 'RECIEVED') {
        webhookUrl = "https://n8n.srv1245507.hstgr.cloud/webhook/recieved";
    }

    if (webhookUrl) {
        try {
            await fetch(webhookUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(updatedOrder)
            });
        } catch (error) {
            console.error('Failed to trigger webhook:', error);
            // We still return success because the local update succeeded
        }
    }

    return NextResponse.json(updatedOrder);
}
