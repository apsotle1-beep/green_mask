"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

interface Order {
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

export default function AdminDashboard() {
    const router = useRouter();
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchOrders = async () => {
        try {
            const res = await fetch('/api/orders');
            if (res.status === 401) {
                router.push('/admin/login');
                return;
            }
            if (res.ok) {
                const data = await res.json();
                setOrders(data);
            }
        } catch (error) {
            console.error('Failed to fetch orders', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchOrders();
    }, []);

    const updateStatus = async (orderId: string, newStatus: string) => {
        // Optimistic update
        setOrders(orders.map(o => o.orderId === orderId ? { ...o, status: newStatus as Order['status'] } : o));

        try {
            const res = await fetch(`/api/orders/${orderId}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status: newStatus }),
            });

            if (!res.ok) {
                // Revert if failed
                fetchOrders();
                alert('Failed to update status');
            }
        } catch (error) {
            console.error('Error updating status', error);
            fetchOrders(); // Revert
        }
    };

    if (loading) return <div className="min-h-screen bg-botanic-deep flex items-center justify-center text-matcha">Loading...</div>;

    return (
        <div className="min-h-screen bg-botanic-deep text-white p-6">
            <div className="max-w-7xl mx-auto space-y-8">
                <header className="flex justify-between items-center bg-white/5 p-6 rounded-3xl border border-white/10">
                    <h1 className="text-3xl font-bold text-matcha">Admin Dashboard</h1>
                    <button onClick={() => router.push('/admin/login')} className="text-white/60 hover:text-white transition-colors">Logout</button>
                </header>

                <div className="grid gap-6">
                    {orders.length === 0 ? (
                        <div className="text-center text-white/40 py-12">No orders found.</div>
                    ) : (
                        orders.map((order) => (
                            <div key={order.orderId} className="bg-white/5 backdrop-blur-sm p-6 rounded-2xl border border-white/10 hover:border-matcha/50 transition-all">
                                <div className="flex flex-col lg:flex-row justify-between gap-6">
                                    <div className="space-y-4 flex-1">
                                        <div className="flex items-center gap-3">
                                            <span className="font-mono text-xs bg-white/10 px-2 py-1 rounded text-white/60">{order.orderId}</span>
                                            <span className="text-sm text-white/40">{new Date(order.submittedAt).toLocaleString()}</span>
                                        </div>
                                        <div>
                                            <h3 className="text-xl font-bold">{order.name} <span className="text-matcha ml-2 text-sm font-normal">x{order.quantity} (${(30 * order.quantity).toFixed(2)})</span></h3>
                                            <div className="text-white/70 space-y-1 mt-2 text-sm">
                                                <p>📞 {order.phone} {order.whatsapp && <span className="text-white/40">(WA: {order.whatsapp})</span>}</p>
                                                <p>📧 {order.email || 'N/A'}</p>
                                            </div>
                                        </div>
                                        <div className="bg-black/20 p-4 rounded-xl text-sm space-y-1">
                                            <p className="font-semibold text-white/80">Address:</p>
                                            <p>{order.address}</p>
                                            <p className="text-white/60">{order.area}, {order.city}</p>
                                            {order.landmark && <p className="text-matcha/80 italic text-xs mt-1">Near: {order.landmark}</p>}
                                        </div>
                                    </div>

                                    <div className="flex flex-col justify-between items-end gap-4 min-w-[200px]">
                                        <div className="flex flex-col items-end gap-2 w-full">
                                            <label className="text-xs uppercase tracking-wider text-white/40 font-bold">Status</label>
                                            <select
                                                value={order.status}
                                                onChange={(e) => updateStatus(order.orderId, e.target.value)}
                                                className={`
                                                    w-full px-4 py-2 rounded-xl appearance-none cursor-pointer font-bold outline-none border transition-all
                                                    ${order.status === 'PENDING' ? 'bg-yellow-500/20 text-yellow-500 border-yellow-500/30 hover:bg-yellow-500/30' : ''}
                                                    ${order.status === 'PLACED' ? 'bg-blue-500/20 text-blue-500 border-blue-500/30 hover:bg-blue-500/30' : ''}
                                                    ${order.status === 'RECIEVED' ? 'bg-green-500/20 text-green-500 border-green-500/30 hover:bg-green-500/30' : ''}
                                                `}
                                            >
                                                <option value="PENDING" className="bg-botanic-deep text-white">PENDING</option>
                                                <option value="PLACED" className="bg-botanic-deep text-white">PLACED</option>
                                                <option value="RECIEVED" className="bg-botanic-deep text-white">RECIEVED</option>
                                            </select>
                                        </div>
                                        {order.status === 'PLACED' && <div className="text-xs text-blue-400">Webhook Triggered</div>}
                                        {order.status === 'RECIEVED' && <div className="text-xs text-green-400">Webhook Triggered</div>}
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
}
