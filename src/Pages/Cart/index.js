import React from "react";
import QuantityBox from '../../Components/QuantityBox'
import Rating from "@mui/material/Rating";
import Button from '@mui/material/Button';
import { Trash  } from 'lucide-react';
import { PiSignOut } from "react-icons/pi";
import { RefreshCcw  } from 'lucide-react';
import { MoveLeft  } from 'lucide-react';
import BaggyPant from "../../Assets/Images/Items/Baggy_Pants.jpeg";
import { Link } from "react-router-dom";

function Cart() {
  return (
    <>
      <section className="section cartPage">
        <div className="container">
        <h2 className="hd mb-0">Your Cart</h2>
              <p>
                There are <b className="txt-green">2</b> products in your cart
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
                    <tr>
                      <td width='40%'>
                        <Link to="/product/1">
                          <div className="d-flex align-item-center cartItemImgWrapper">
                            <div className="imgWrapper">
                              <img
                                className="w-100"
                                src={BaggyPant}
                                alt="Not Found"
                              />
                            </div>
                            <div className="info px-3">
                              <h6>Sky-Blue Baggy Jeans Pant</h6>
                              <Rating
                                name="read-only"
                                value={4.5}
                                size="small"
                                precision={0.5}
                                readOnly
                              />
                            </div>
                          </div>
                        </Link>
                      </td>
                      <td width='20%'>$14.00</td>
                      <td width='20%'><QuantityBox /></td>
                      <td width='15%'>$14.00</td>
                      <td width='5%'><span className="remove"><Trash size={14}/></span></td>
                      
                    </tr>
                    <tr>
                      <td width='40%'>
                        <Link to="/product/1">
                          <div className="d-flex align-item-center cartItemImgWrapper">
                            <div className="imgWrapper">
                              <img
                                className="w-100"
                                src={BaggyPant}
                                alt="Not Found"
                              />
                            </div>
                            <div className="info px-3">
                              <h6>Sky-Blue Baggy Jeans Pant</h6>
                              <Rating
                                name="read-only"
                                value={4.5}
                                size="small"
                                precision={0.5}
                                readOnly
                              />
                            </div>
                          </div>
                        </Link>
                      </td>
                      <td width='20%'>$14.00</td>
                      <td width='20%'><QuantityBox /></td>
                      <td width='15%'>$14.00</td>
                      <td width='5%'><span className="remove"><Trash size={14}/></span></td>
                      
                    </tr>
                  </tbody>
                </table>
              </div>
              {/* ACTION BUTTONS */}
            <div className="cartActions d-flex justify-content-between">
              <Button className="btn-green">
               <MoveLeft size={16}/>  Continue Shopping
              </Button>
              
              <Button className="btn-green">
              <RefreshCcw size={16}/> Update Cart
              </Button>
            </div>

            {/* SHIPPING + COUPON */}
            <div className="row mt-5">
              <div className="col-md-6">
                <div className="card  box">
                  <h5>Calculate Shipping</h5>
                  <p>Flat rate: $5</p>

                  <select className="form-control mb-3">
                    <option>United Kingdom</option>
                  </select>

                  <div className="d-flex gap">
                    <input className="form-control" placeholder="State/Country" />
                    <input className="form-control" placeholder="Postcode/ZIP" />
                  </div>
                </div>
              </div>

              <div className="col-md-6">
                <div className="card p-3 box2">
                  <h5>Apply Coupon</h5>
                  <p>Using A Promo Code?</p>

                  <div className="d-flex gap">
                    <input className="form-control" placeholder="Enter Your Coupon" />
                    <Button className="btn-green">Apply</Button>
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
                        <span className="ml-auto txt-green font-weight-bold">$28.00</span>
                    </div>
                    <div className="d-flex align-items-center mb-3">
                        <span>Shipping</span>
                        <span className="ml-auto">Free</span>
                    </div>
                    <div className="d-flex align-items-center mb-3">
                        <span>Estimate for</span>
                        <span className="ml-auto"><b>Pakistan</b></span>
                    </div>
                    <div className="d-flex align-items-center mb-3">
                        <span>Total</span>
                        <span className="ml-auto txt-green font-weight-bold">$28.00</span>
                    </div>
                    <br />

                    <Button className='btn-green btn-lg btn-big'>Proceed to checkout
                        <span><PiSignOut /></span>
                    </Button>
                </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

export default Cart;
