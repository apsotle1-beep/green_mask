import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

const supabase = createClient(supabaseUrl, supabaseKey);

export interface Order {
    orderId: string;
    name: string;
    email: string;
    phone: string;
    whatsapp: string;
    city: string;
    area: string;
    address: string;
    landmark: string;
    quantity: number;
    submittedAt: string;
    status: 'PENDING' | 'PLACED' | 'RECIEVED';
}

export async function getOrders(): Promise<Order[]> {
    const { data, error } = await supabase
        .from('orders')
        .select('*')
        .order('submittedAt', { ascending: false });

    if (error) {
        console.error('Error fetching orders:', error);
        return [];
    }
    return data as Order[];
}

export async function addOrder(order: Omit<Order, 'status'>): Promise<Order | null> {
    const newOrder = { ...order, status: 'PENDING' };
    const { data, error } = await supabase
        .from('orders')
        .insert([newOrder])
        .select()
        .single();

    if (error) {
        console.error('Error adding order:', error);
        return null; // Handle error upstream
    }
    return data as Order;
}

export async function updateOrderStatus(orderId: string, status: Order['status']): Promise<Order | null> {
    const { data, error } = await supabase
        .from('orders')
        .update({ status })
        .eq('orderId', orderId)
        .select()
        .single();

    if (error) {
        console.error('Error updating order status:', error);
        return null;
    }
    return data as Order;
}
