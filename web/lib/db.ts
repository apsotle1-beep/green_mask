import fs from 'fs';
import path from 'path';

const dbPath = path.join(process.cwd(), 'data', 'orders.json');

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

export function getOrders(): Order[] {
    if (!fs.existsSync(dbPath)) {
        return [];
    }
    const fileContent = fs.readFileSync(dbPath, 'utf-8');
    try {
        return JSON.parse(fileContent);
    } catch (error) {
        return [];
    }
}

export function saveOrders(orders: Order[]) {
    fs.writeFileSync(dbPath, JSON.stringify(orders, null, 2));
}

export function addOrder(order: Omit<Order, 'status'>): Order {
    const orders = getOrders();
    const newOrder: Order = { ...order, status: 'PENDING' };
    orders.push(newOrder);
    saveOrders(orders);
    return newOrder;
}

export function updateOrderStatus(orderId: string, status: Order['status']): Order | null {
    const orders = getOrders();
    const orderIndex = orders.findIndex((o) => o.orderId === orderId);

    if (orderIndex === -1) return null;

    orders[orderIndex].status = status;
    saveOrders(orders);
    return orders[orderIndex];
}
