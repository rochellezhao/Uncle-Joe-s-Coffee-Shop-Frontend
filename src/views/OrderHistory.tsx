import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Package, Clock, ChevronRight, Coffee, Calendar } from 'lucide-react';
import { coffeeApi } from '../services/api';
import { Order, User, GuestUser } from '../types';

interface OrderHistoryProps {
  currentUser: User | GuestUser | null;
}

export default function OrderHistory({ currentUser }: OrderHistoryProps) {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [sessionError, setSessionError] = useState<string | null>(null);

  useEffect(() => {
    const fetchOrders = async () => {
      setLoading(true);
      try {
        const saved = localStorage.getItem("app_user");
        const currentUserFromStore = saved ? JSON.parse(saved) : null;
        
        console.log("LOCAL STORAGE APP USER:", currentUserFromStore);
        console.log("CURRENT USER SESSION:", currentUser);
        
        const memberIdToUse = (currentUser as any)?.member_id || currentUserFromStore?.member_id;
        console.log("PERSON ID (MEMBER ID) USED FOR ORDER HISTORY:", memberIdToUse);

        if (!memberIdToUse) {
          setSessionError("Authentication error: No Person ID associated with your account.");
          setLoading(false);
          return;
        }

        const data = await coffeeApi.getOrders();
        
        const mappedOrders = data.map((o: any) => ({
          id: String(o.id || o.order_id || o.number || Math.random().toString(36).substr(2, 9)),
          date: o.date || o.created_at || o.timestamp || o.time || new Date().toISOString(),
          items: Array.isArray(o.items || o.order_items || o.line_items) ? (o.items || o.order_items || o.line_items) : [],
          total: Number(o.total || o.amount || o.price || 0),
          status: o.status || o.state || 'Completed'
        }));
        setOrders(mappedOrders);
      } catch (err) {
        console.error('Failed to fetch orders:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [currentUser]);

  if (loading) {
    return (
      <div className="px-12 py-20 flex justify-center items-center min-h-[50vh]">
        <div className="flex flex-col items-center gap-4 text-center">
          <div className="w-12 h-12 border-2 border-coffee-accent border-t-transparent rounded-full animate-spin" />
          <h3 className="font-serif text-xl text-coffee-dark">Loading your order history...</h3>
          <p className="text-[10px] uppercase tracking-widest font-bold text-coffee-dark/40">Fetching your roasted rewards</p>
        </div>
      </div>
    );
  }

  if (sessionError) {
    return (
      <div className="px-12 py-20 max-w-4xl mx-auto">
        <div className="bg-white border border-red-100 p-12 text-center space-y-6">
          <div className="space-y-1">
            <p className="font-serif text-xl text-red-600">{sessionError}</p>
            <p className="text-[10px] uppercase tracking-widest text-red-600/40">Please sign in to view your history</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="px-12 py-20 max-w-4xl mx-auto">
      <div className="mb-12 space-y-2">
        <span className="text-[10px] uppercase tracking-[0.3em] text-coffee-accent font-bold">Roasted Rewards</span>
        <h2 className="font-serif text-4xl text-coffee-dark">Order History</h2>
        <p className="text-sm text-coffee-dark/60 max-w-md">
          Review your previous visits and favorite brews from Uncle Joe's.
        </p>
      </div>

      {orders.length === 0 ? (
        <div className="bg-white border border-black/5 p-12 text-center space-y-6">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-coffee-paper rounded-full">
            <Package className="w-8 h-8 text-coffee-dark/20" />
          </div>
          <div className="space-y-1">
            <p className="font-serif text-xl text-coffee-dark">No orders yet</p>
            <p className="text-[10px] uppercase tracking-widest text-coffee-dark/40">Start your journey today</p>
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          {orders.map((order, idx) => (
            <motion.div
              key={order.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.1 }}
              className="bg-white border border-black/5 p-6 flex flex-col md:flex-row md:items-center justify-between gap-6 hover:border-coffee-accent transition-colors group cursor-default"
            >
              <div className="flex items-center gap-6">
                <div className="w-12 h-12 bg-coffee-paper flex items-center justify-center">
                  <Coffee className="w-6 h-6 text-coffee-dark/40" />
                </div>
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] uppercase tracking-widest font-bold text-coffee-dark/20">Order #{order.id.slice(0, 8)}</span>
                    <span className="px-2 py-0.5 bg-green-50 text-green-600 text-[8px] uppercase tracking-widest font-bold rounded">
                      {order.status}
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-1 text-sm font-medium">
                      <Calendar className="w-3 h-3 text-coffee-dark/40" />
                      {new Date(order.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap gap-2 md:max-w-xs">
                {order.items.map((item, i) => (
                  <span key={i} className="text-[10px] bg-coffee-paper px-2 py-1 uppercase tracking-widest font-bold text-coffee-dark/60">
                    {item.quantity}x {item.name}
                  </span>
                ))}
              </div>

              <div className="flex items-center justify-between md:justify-end gap-12 pt-4 md:pt-0 border-t md:border-t-0 border-black/5">
                <div className="text-right">
                  <p className="text-[10px] uppercase tracking-widest font-bold text-coffee-dark/40">Total Amount</p>
                  <p className="font-serif text-xl text-coffee-dark">${order.total.toFixed(2)}</p>
                </div>
                <button className="p-2 border border-black/5 rounded-full group-hover:bg-coffee-dark group-hover:border-coffee-dark transition-all">
                  <ChevronRight className="w-4 h-4 text-coffee-dark/40 group-hover:text-white" />
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
