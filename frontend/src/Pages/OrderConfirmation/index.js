import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import Button from '@mui/material/Button';
import api from '../../api/axios';
import { CheckCircle } from 'lucide-react';

const OrderConfirmation = () => {
    const { id } = useParams();
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const load = async () => {
            try {
                const res = await api.get(`/api/orders/${id}`);
                setOrder(res.data.data);
            } catch (err) {
                console.warn('Could not load order:', err.message);
            } finally {
                setLoading(false);
            }
        };
        load();
    }, [id]);

    if (loading) {
        return (
            <section className="section">
                <div className="container">
                    <div className="text-center py-5">Loading order…</div>
                </div>
            </section>
        );
    }

    if (!order) {
        return (
            <section className="section">
                <div className="container">
                    <div className="text-center py-5">
                        <h2>Order not found</h2>
                        <Link to="/" className="btn-green btn mt-3">Back to Home</Link>
                    </div>
                </div>
            </section>
        );
    }

    return (
        <section className="section orderConfirmation">
            <div className="container">
                <div className="card p-5 text-center">
                    <CheckCircle size={64} color="#28a745" className="mb-3" />
                    <h2>Thank you for your order!</h2>
                    <p className="text-muted">Your order has been placed successfully.</p>

                    <div className="order-info mt-4 mb-4">
                        <p><strong>Order Number:</strong> {order.orderNumber}</p>
                        <p><strong>Order Status:</strong> <span className="badge bg-info">{order.status}</span></p>
                        <p><strong>Payment Method:</strong> {order.paymentMethod.toUpperCase()}</p>
                        <p><strong>Order Date:</strong> {new Date(order.createdAt).toLocaleString()}</p>
                    </div>

                    <h5 className="mb-3">Order Items</h5>
                    <div className="order-items text-left">
                        {order.items.map((it, i) => (
                            <div key={i} className="d-flex mb-2 p-2 border rounded">
                                <img
                                    src={it.image || 'https://placehold.co/60'}
                                    alt={it.name}
                                    style={{ width: 60, height: 60, objectFit: 'cover', borderRadius: 6 }}
                                    loading="lazy"
                                />
                                <div className="ml-3 flex-grow-1">
                                    <h6 className="mb-0">{it.name}</h6>
                                    <small>Qty: {it.quantity}{it.size ? ` · Size: ${it.size}` : ''}</small>
                                </div>
                                <div className="ml-auto">
                                    <strong>${(it.price * it.quantity).toFixed(2)}</strong>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="order-totals mt-4 text-left mx-auto" style={{ maxWidth: 360 }}>
                        <div className="d-flex mb-2">
                            <span>Subtotal</span>
                            <span className="ml-auto">${order.subtotal.toFixed(2)}</span>
                        </div>
                        {order.discount > 0 && (
                            <div className="d-flex mb-2">
                                <span>Discount</span>
                                <span className="ml-auto text-danger">-${order.discount.toFixed(2)}</span>
                            </div>
                        )}
                        <div className="d-flex mb-2">
                            <span>Shipping</span>
                            <span className="ml-auto">
                                {order.shippingCost === 0 ? 'Free' : `$${order.shippingCost.toFixed(2)}`}
                            </span>
                        </div>
                        <div className="d-flex mb-2">
                            <span>Tax</span>
                            <span className="ml-auto">${order.tax.toFixed(2)}</span>
                        </div>
                        <hr />
                        <div className="d-flex">
                            <strong>Total</strong>
                            <strong className="ml-auto txt-green">${order.total.toFixed(2)}</strong>
                        </div>
                    </div>

                    <div className="mt-4">
                        <Link to="/" className="btn-green btn mr-2">Continue Shopping</Link>
                        <Link to="/shop" className="btn btn-outline-primary">Browse Products</Link>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default OrderConfirmation;
