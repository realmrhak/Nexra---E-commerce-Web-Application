import { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import Button from '@mui/material/Button';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import api from '../../api/axios';
import toast from 'react-hot-toast';

const Checkout = () => {
    const { cart, subtotal, clearCart } = useCart();
    const { user } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    const { discount = 0, couponCode = '', shippingCost = 5, total = 0 } = location.state || {};
    const [submitting, setSubmitting] = useState(false);
    const [form, setForm] = useState({
        fullName: user?.name || '',
        phone: user?.phone || '',
        line1: '',
        line2: '',
        city: '',
        state: '',
        postalCode: '',
        country: 'United States',
        paymentMethod: 'cod',
        notes: '',
    });

    useEffect(() => {
        if (!cart || cart.items.length === 0) {
            navigate('/cart');
        }
    }, [cart, navigate]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm({ ...form, [name]: value });
    };

    const finalTotal = total || Math.max(0, subtotal - discount + shippingCost);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            const payload = {
                items: cart.items.map((it) => ({
                    product: it.product,
                    name: it.name,
                    image: it.image,
                    price: it.price,
                    size: it.size,
                    color: it.color,
                    quantity: it.quantity,
                })),
                shippingAddress: {
                    fullName: form.fullName,
                    phone: form.phone,
                    line1: form.line1,
                    line2: form.line2,
                    city: form.city,
                    state: form.state,
                    postalCode: form.postalCode,
                    country: form.country,
                },
                shippingCost,
                paymentMethod: form.paymentMethod,
                couponCode,
                notes: form.notes,
            };

            const res = await api.post('/api/orders', payload);
            await clearCart();
            toast.success('Order placed successfully!');
            navigate(`/order/${res.data.data._id}`);
        } catch (err) {
            toast.error(err?.message || 'Failed to place order.');
        } finally {
            setSubmitting(false);
        }
    };

    if (!cart || cart.items.length === 0) return null;

    return (
        <section className="section checkoutPage">
            <div className="container">
                <h2 className="hd mb-4">Checkout</h2>

                <form onSubmit={handleSubmit}>
                    <div className="row">
                        <div className="col-md-7">
                            <div className="card p-4 mb-4">
                                <h5 className="mb-3">Shipping Address</h5>

                                <div className="form-group">
                                    <label>Full Name</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        name="fullName"
                                        value={form.fullName}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>

                                <div className="form-group">
                                    <label>Phone</label>
                                    <input
                                        type="tel"
                                        className="form-control"
                                        name="phone"
                                        value={form.phone}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>

                                <div className="form-group">
                                    <label>Address Line 1</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        name="line1"
                                        value={form.line1}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>

                                <div className="form-group">
                                    <label>Address Line 2 (optional)</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        name="line2"
                                        value={form.line2}
                                        onChange={handleChange}
                                    />
                                </div>

                                <div className="row">
                                    <div className="col-md-6 form-group">
                                        <label>City</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            name="city"
                                            value={form.city}
                                            onChange={handleChange}
                                            required
                                        />
                                    </div>
                                    <div className="col-md-6 form-group">
                                        <label>State / Province</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            name="state"
                                            value={form.state}
                                            onChange={handleChange}
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="row">
                                    <div className="col-md-6 form-group">
                                        <label>Postal Code</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            name="postalCode"
                                            value={form.postalCode}
                                            onChange={handleChange}
                                            required
                                        />
                                    </div>
                                    <div className="col-md-6 form-group">
                                        <label>Country</label>
                                        <select
                                            className="form-control"
                                            name="country"
                                            value={form.country}
                                            onChange={handleChange}
                                        >
                                            <option>United States</option>
                                            <option>United Kingdom</option>
                                            <option>Pakistan</option>
                                            <option>India</option>
                                            <option>United Arab Emirates</option>
                                        </select>
                                    </div>
                                </div>
                            </div>

                            <div className="card p-4 mb-4">
                                <h5 className="mb-3">Payment Method</h5>
                                {['cod', 'card', 'paypal'].map((m) => (
                                    <div className="form-check mb-2" key={m}>
                                        <input
                                            type="radio"
                                            className="form-check-input"
                                            name="paymentMethod"
                                            value={m}
                                            checked={form.paymentMethod === m}
                                            onChange={handleChange}
                                            id={`pm-${m}`}
                                        />
                                        <label className="form-check-label" htmlFor={`pm-${m}`}>
                                            {m === 'cod' && 'Cash on Delivery'}
                                            {m === 'card' && 'Credit / Debit Card'}
                                            {m === 'paypal' && 'PayPal'}
                                        </label>
                                    </div>
                                ))}
                                <p className="text-muted text-sml mt-2">
                                    Note: This is a demo checkout. Card and PayPal payments are simulated.
                                </p>
                            </div>

                            <div className="card p-4">
                                <h5 className="mb-3">Order Notes (optional)</h5>
                                <textarea
                                    className="form-control"
                                    name="notes"
                                    value={form.notes}
                                    onChange={handleChange}
                                    rows={3}
                                    placeholder="Any special instructions for delivery…"
                                />
                            </div>
                        </div>

                        <div className="col-md-5">
                            <div className="card p-4 orderSummary">
                                <h5 className="mb-3">Order Summary</h5>
                                <div className="orderItems">
                                    {cart.items.map((it) => (
                                        <div key={it._id} className="d-flex mb-2">
                                            <img
                                                src={it.image || 'https://placehold.co/60'}
                                                alt={it.name}
                                                style={{ width: 60, height: 60, objectFit: 'cover', borderRadius: 6 }}
                                                loading="lazy"
                                            />
                                            <div className="ml-3 flex-grow-1">
                                                <h6 className="mb-0">{it.name}</h6>
                                                <small className="text-muted">
                                                    Qty: {it.quantity}
                                                    {it.size ? ` · Size: ${it.size}` : ''}
                                                </small>
                                            </div>
                                            <div className="ml-auto">
                                                <strong>${(it.price * it.quantity).toFixed(2)}</strong>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                <hr />

                                <div className="d-flex mb-2">
                                    <span>Subtotal</span>
                                    <span className="ml-auto">${subtotal.toFixed(2)}</span>
                                </div>
                                <div className="d-flex mb-2">
                                    <span>Shipping</span>
                                    <span className="ml-auto">
                                        {shippingCost === 0 ? 'Free' : `$${shippingCost.toFixed(2)}`}
                                    </span>
                                </div>
                                {discount > 0 && (
                                    <div className="d-flex mb-2">
                                        <span>Discount</span>
                                        <span className="ml-auto text-danger">-${discount.toFixed(2)}</span>
                                    </div>
                                )}
                                <hr />
                                <div className="d-flex mb-3">
                                    <strong>Total</strong>
                                    <strong className="ml-auto txt-green">${finalTotal.toFixed(2)}</strong>
                                </div>

                                <Button
                                    type="submit"
                                    className="btn-green btn-lg btn-big w-100"
                                    disabled={submitting}
                                >
                                    {submitting ? 'Placing Order…' : `Place Order · $${finalTotal.toFixed(2)}`}
                                </Button>

                                <Link to="/cart" className="d-block text-center mt-3 text-muted">
                                    ← Back to Cart
                                </Link>
                            </div>
                        </div>
                    </div>
                </form>
            </div>
        </section>
    );
};

export default Checkout;
