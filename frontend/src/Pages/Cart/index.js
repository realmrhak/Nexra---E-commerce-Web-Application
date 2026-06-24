import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import QuantityBox from '../../Components/QuantityBox';
import Rating from "@mui/material/Rating";
import Button from '@mui/material/Button';
import { Trash } from 'lucide-react';
import { PiSignOut } from "react-icons/pi";
import { RefreshCcw, MoveLeft } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import { useApp } from '../../context/AppContext';
import api from '../../api/axios';
import toast from 'react-hot-toast';

function Cart() {
    const { cart, loading, itemCount, subtotal, fetchCart, updateQuantity, removeItem } = useCart();
    const { countryList, selectedCountry } = useApp();
    const { isAuthenticated } = useAuth();
    const navigate = useNavigate();
    const [couponCode, setCouponCode] = useState('');
    const [discount, setDiscount] = useState(0);
    const [applyingCoupon, setApplyingCoupon] = useState(false);

    useEffect(() => {
        if (isAuthenticated) fetchCart();
    }, [isAuthenticated, fetchCart]);

    if (!isAuthenticated) {
        return (
            <section className="section cartPage">
                <div className="container">
                    <h2 className="hd mb-3">Your Cart</h2>
                    <p>Please log in to view your cart.</p>
                    <Link to="/login" className="btn-green btn">Sign in</Link>
                </div>
            </section>
        );
    }

    if (loading && !cart) {
        return (
            <section className="section cartPage">
                <div className="container">
                    <div className="text-center py-5">Loading cart…</div>
                </div>
            </section>
        );
    }

    if (!cart || cart.items.length === 0) {
        return (
            <section className="section cartPage">
                <div className="container">
                    <h2 className="hd mb-0">Your Cart</h2>
                    <p>Your cart is empty.</p>
                    <Link to="/shop" className="btn-green btn">
                        <MoveLeft size={16} /> Continue Shopping
                    </Link>
                </div>
            </section>
        );
    }

    const shippingCost = subtotal >= 70 ? 0 : 5;
    const total = Math.max(0, subtotal - discount + shippingCost);

    const handleApplyCoupon = async () => {
        if (!couponCode.trim()) {
            toast.error('Enter a coupon code first.');
            return;
        }
        setApplyingCoupon(true);
        try {
            const res = await api.post('/api/coupons/validate', {
                code: couponCode,
                subtotal,
            });
            setDiscount(res.data.data.discount);
            toast.success(`Coupon applied — you saved $${res.data.data.discount.toFixed(2)}!`);
        } catch (err) {
            setDiscount(0);
            toast.error(err?.message || 'Invalid coupon.');
        } finally {
            setApplyingCoupon(false);
        }
    };

    return (
        <section className="section cartPage">
            <div className="container">
                <h2 className="hd mb-0">Your Cart</h2>
                <p>
                    There are <b className="txt-green">{itemCount}</b> item{itemCount !== 1 ? 's' : ''} in your cart
                </p>
                <div className="row">
                    <div className="col-md-9 pr-3">
                        <div className="table-responsive">
                            <table className="table">
                                <thead>
                                    <tr>
                                        <th width='40%'>Product</th>
                                        <th width='20%'>Unit Price</th>
                                        <th width='20%'>Quantity</th>
                                        <th width='15%'>Subtotal</th>
                                        <th width='5%'>Remove</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {cart.items.map((item) => (
                                        <tr key={item._id}>
                                            <td width='40%'>
                                                <Link to={`/product/${item.product}`}>
                                                    <div className="d-flex align-item-center cartItemImgWrapper">
                                                        <div className="imgWrapper">
                                                            <img
                                                                className="w-100"
                                                                src={item.image || 'https://placehold.co/100?text=No+Image'}
                                                                alt={item.name}
                                                                loading="lazy"
                                                            />
                                                        </div>
                                                        <div className="info px-3">
                                                            <h6>{item.name}</h6>
                                                            {item.size && <small>Size: {item.size}</small>}
                                                            <Rating
                                                                name="read-only"
                                                                value={5}
                                                                size="small"
                                                                precision={0.5}
                                                                readOnly
                                                            />
                                                        </div>
                                                    </div>
                                                </Link>
                                            </td>
                                            <td width='20%'>${item.price.toFixed(2)}</td>
                                            <td width='20%'>
                                                <QuantityBox
                                                    value={item.quantity}
                                                    onChange={(q) => updateQuantity(item._id, q)}
                                                    max={99}
                                                />
                                            </td>
                                            <td width='15%'>${(item.price * item.quantity).toFixed(2)}</td>
                                            <td width='5%'>
                                                <span
                                                    className="remove cursor"
                                                    onClick={() => removeItem(item._id)}
                                                    role="button"
                                                    aria-label="Remove item"
                                                >
                                                    <Trash size={14} />
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        <div className="cartActions d-flex justify-content-between">
                            <Link to="/shop" className="btn-green btn">
                                <MoveLeft size={16} /> Continue Shopping
                            </Link>
                            <Button className="btn-green" onClick={fetchCart}>
                                <RefreshCcw size={16} /> Update Cart
                            </Button>
                        </div>

                        <div className="row mt-5">
                            <div className="col-md-6">
                                <div className="card box">
                                    <h5>Calculate Shipping</h5>
                                    <p>Flat rate: $5 (free over $70)</p>
                                    <select className="form-control mb-3" defaultValue="">
                                        <option value="" disabled>
                                            {countryList.length === 0 ? 'Loading countries…' : 'Select Country'}
                                        </option>
                                        {countryList.map((c, i) => (
                                            <option key={i} value={c.country}>
                                                {c.country}
                                            </option>
                                        ))}
                                    </select>
                                    <div className="d-flex gap">
                                        <input className="form-control" placeholder="State / Province" />
                                        <input className="form-control" placeholder="Postcode / ZIP" />
                                    </div>
                                </div>
                            </div>

                            <div className="col-md-6">
                                <div className="card p-3 box2">
                                    <h5>Apply Coupon</h5>
                                    <p>Try <code>WELCOME10</code> or <code>SAVE25</code></p>
                                    <div className="d-flex gap">
                                        <input
                                            className="form-control"
                                            placeholder="Enter Your Coupon"
                                            value={couponCode}
                                            onChange={(e) => setCouponCode(e.target.value)}
                                        />
                                        <Button
                                            className="btn-green"
                                            onClick={handleApplyCoupon}
                                            disabled={applyingCoupon}
                                        >
                                            {applyingCoupon ? 'Applying…' : 'Apply'}
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="col-md-3">
                        <div className="card border p-3 cartDetails">
                            <h4>Cart Totals</h4>
                            <div className="d-flex align-items-center mb-3">
                                <span>Subtotal</span>
                                <span className="ml-auto txt-green font-weight-bold">${subtotal.toFixed(2)}</span>
                            </div>
                            <div className="d-flex align-items-center mb-3">
                                <span>Shipping</span>
                                <span className="ml-auto">
                                    {shippingCost === 0 ? 'Free' : `$${shippingCost.toFixed(2)}`}
                                </span>
                            </div>
                            {discount > 0 && (
                                <div className="d-flex align-items-center mb-3">
                                    <span>Discount</span>
                                    <span className="ml-auto text-danger">-${discount.toFixed(2)}</span>
                                </div>
                            )}
                            <div className="d-flex align-items-center mb-3">
                                <span>Total</span>
                                <span className="ml-auto txt-green font-weight-bold">${total.toFixed(2)}</span>
                            </div>
                            <br />

                            <Button
                                className='btn-green btn-lg btn-big'
                                onClick={() => navigate('/checkout', {
                                    state: {
                                        discount,
                                        couponCode,
                                        shippingCost,
                                        total,
                                    },
                                })}
                            >
                                Proceed to checkout <PiSignOut />
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}

export default Cart;
