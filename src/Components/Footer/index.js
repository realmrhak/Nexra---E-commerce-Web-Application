import React from "react";
import logo from "../../Assets/Images/Logo.png";

import { IoIosShirt } from "react-icons/io";
import { TbTruckDelivery, TbRosetteDiscount } from "react-icons/tb";
import { AiOutlineDollarCircle } from "react-icons/ai";

import { FaFacebookF, FaPinterestP, FaInstagram, FaYoutube } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";

const Footer = () => {
    return (
        <footer>
            <div className="container">

                {/* ===== TOP INFO BAR ===== */}
                <div className="topInfo row">
                    <div className="col d-flex align-items-center">
                        <span><IoIosShirt /></span>
                        <span className="ml-3">Everyday upgrade your fashion</span>
                    </div>

                    <div className="col d-flex align-items-center">
                        <span><TbTruckDelivery /></span>
                        <span className="ml-3">Free delivery for order over $70</span>
                    </div>

                    <div className="col d-flex align-items-center">
                        <span><TbRosetteDiscount /></span>
                        <span className="ml-3">Daily Mega Discounts</span>
                    </div>

                    <div className="col d-flex align-items-center">
                        <span><AiOutlineDollarCircle /></span>
                        <span className="ml-3">Best price on the market</span>
                    </div>
                </div>

                {/* ===== MAIN FOOTER ===== */}
                <div className="footerMain row">

                    {/* LEFT */}
                    <div className="col-md-3 footer-left">
                        <img src={logo} alt="Nexra Logo" className="footer-logo" />

                        <p>685 Market Street</p>
                        <p>San Francisco, CA 94105,</p>
                        <p>United States</p>

                        <div className="footer-contact">
                            <p>123 Main St, Anytown, USA</p>
                            <p>+123 456 7890</p>
                        </div>
                    </div>

                    {/* SHOP */}
                    <div className="col-md-2 footer-column">
                        <h4>Shop</h4>
                        <ul>
                            <li>New In</li>
                            <li>Trend</li>
                            <li>Shoes</li>
                            <li>Bags & Accessories</li>
                            <li>Top Brands</li>
                            <li>Sale & Special</li>
                            <li>Offers</li>
                            <li>Lookbook</li>
                        </ul>
                    </div>

                    {/* INFO */}
                    <div className="col-md-2 footer-column">
                        <h4>Information</h4>
                        <ul>
                            <li>About</li>
                            <li>Customer Service</li>
                            <li>Reward Program</li>
                            <li>Shipping & Returns</li>
                            <li>Privacy Policy</li>
                            <li>Terms & Conditions</li>
                            <li>Blog</li>
                        </ul>
                    </div>

                    {/* CUSTOMER */}
                    <div className="col-md-2 footer-column">
                        <h4>Customer Service</h4>
                        <ul>
                            <li>Search Terms</li>
                            <li>Advanced Search</li>
                            <li>Orders and Returns</li>
                            <li>Contact Us</li>
                            <li>Theme FAQs</li>
                            <li>Consultant</li>
                            <li>Store Locations</li>
                        </ul>
                    </div>

                    {/* SOCIAL */}
                    <div className="col-md-3 footer-column">
                        <h4>Follow Us</h4>
                        <div className="social-icons">
                            <FaXTwitter />
                            <FaFacebookF />
                            <FaPinterestP />
                            <FaInstagram />
                            <FaYoutube />
                        </div>
                    </div>

                </div>
                {/* ===== BOTTOM FOOTER ===== */}
                <div className="footerBottom">

                    <div className="row align-items-center">

                        {/* LEFT - CONTACT */}
                        <div className="col-md-4 d-flex align-items-center bottom-contact">
                            <span className="phone-icon">📞</span>
                            <div className="ml-3">
                                <strong>8 800 555-55</strong>
                                <p>Working 8:00 - 22:00</p>
                            </div>
                        </div>

                        {/* CENTER - APP DOWNLOAD */}
                        <div className="col-md-4 text-center">
                            <p className="mb-1"><strong>Download App on Mobile :</strong></p>
                            <p className="small-text">15% discount on your first purchase</p>

                            <div className="app-buttons">
                                <img
                                    src="https://upload.wikimedia.org/wikipedia/commons/7/78/Google_Play_Store_badge_EN.svg"
                                    alt="Google Play"
                                />
                                <img
                                    src="https://developer.apple.com/assets/elements/badges/download-on-the-app-store.svg"
                                    alt="App Store"
                                />
                            </div>
                        </div>

                       

                    </div>

                    <hr />

                    {/* COPYRIGHT ROW */}
                    <div className="row align-items-center footer-copy">

                        <div className="col-md-6">
                            <p>
                                Copyright 2026 © Nexra react Theme. All rights reserved.
                                Powered by RealmrHak.
                            </p>
                        </div>

                        <div className="col-md-6 text-right">
                            <span>Privacy Policy</span>
                            <span>Terms and Conditions</span>
                            <span>Cookie</span>

                            <div className="payment-icons">
                                <img src="https://img.icons8.com/color/48/visa.png" alt="visa" />
                                <img src="https://img.icons8.com/color/48/mastercard.png" alt="mc" />
                                <img src="https://img.icons8.com/color/48/paypal.png" alt="paypal" />
                                <img src="https://img.icons8.com/ios-filled/50/stripe.png" alt="stripe" />
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;