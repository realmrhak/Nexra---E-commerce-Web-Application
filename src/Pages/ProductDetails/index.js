import ProductZoom from '../../Components/ProductZoom'
import QuantityBox from '../../Components/QuantityBox';
import Rating from "@mui/material/Rating";
import Button from '@mui/material/Button';
import Tooltip from "@mui/material/Tooltip";
import { BsCartFill } from "react-icons/bs";
import { useState } from 'react'
import { FaRegHeart } from "react-icons/fa";
import { IoShuffleOutline } from "react-icons/io5";
import RelatedProducts from './RelatedProducts';
import RecentlyViewedProduct from './RecentlyViewedProduct';

const reviewsData = [
    {
      name: "Abdul Hannan",
      date: "December 4, 2023",
      rating: 5,
      text: "Lorem ipsum dolor sit amet consectetur adipisicing elit.",
      img: "https://i.pravatar.cc/100?img=1",
    },
    {
      name: "Ahmad Ali",
      date: "December 4, 2023",
      rating: 4,
      text: "Lorem ipsum dolor sit amet consectetur adipisicing elit.",
      img: "https://i.pravatar.cc/100?img=2",
    },
    {
      name: "Dawood Don",
      date: "December 4, 2023",
      rating: 5,
      text: "Lorem ipsum dolor sit amet consectetur adipisicing elit.",
      img: "https://i.pravatar.cc/100?img=3",
    },
  ];

const Productdetails = () => {

    const [activeSize, setActiveSize] = useState(null);
    const [activeTabs, setActiveTabs] = useState(0)

    const isActive = (index) => {
        setActiveSize(index);
    }

    return (
        <>
            <section className="ProductDetails section">
                <div className="container">
                    <div className="row">
                        <div className="col-md-4 pl-5">
                            <ProductZoom />
                        </div>
                        <div className="col-md-7 pl-5">
                            <h2 className="hd text-capitalize">Multicolor Casual Collar Long Sleeve Check Shirt</h2>
                            <ul className="list list-inline d-flex align-items-center">
                                <li className="list-inline-items">
                                    <div className="d-flex align-items-center">
                                        <span className="text-light mr-2">Brands: </span>
                                        <span className='mr-4'>Ralph Lauren</span>
                                    </div>
                                </li>
                                <li className="list-inline-items">
                                    <div className="d-flex align-items-center">
                                        <Rating className='mt-1' name='read-only' value={4.5} readonly size="small" precision={0.5} />
                                        <span className='text-light cursor ml-2'>3 Reviews</span>
                                    </div>
                                </li>
                            </ul>


                            <div className="d-fex info mb-3">
                                <span className="oldPrice">$20.00</span>
                                <span className="netPrice text-danger ml-2">$14.00</span>
                            </div>
                            <span className="badge bg-success">IN STOCK</span>

                            <p className='mt-3'>Vivamus adipiscing nisl ut dolor dignissim semper. Nulla luctus malesuada tincidunt. Class aptent taciti sociosqu ad litora torquentVivamus adipiscing nisl ut dolor dignissim semper. Nulla luctus malesuada tincidunt. Class aptent taciti sociosqu ad litora torquent</p>


                            <div className="productSize d-flex align-items-center">
                                <span>Size:</span>
                                <ul className="list list-inline mb-0 pl-4">
                                    <li className="list-inline-item">
                                        <a className={`tag ${activeSize === 0 ? 'active' : ''}`} onClick={() => isActive(0)}>Small</a>
                                    </li>
                                    <li className="list-inline-item">
                                        <a className={`tag ${activeSize === 1 ? 'active' : ''}`} onClick={() => isActive(1)}>Medium</a>
                                    </li>
                                    <li className="list-inline-item">
                                        <a className={`tag ${activeSize === 2 ? 'active' : ''}`} onClick={() => isActive(2)}>Large</a>
                                    </li>
                                    <li className="list-inline-item">
                                        <a className={`tag ${activeSize === 3 ? 'active' : ''}`} onClick={() => isActive(3)}>XL</a>
                                    </li>
                                </ul>
                            </div>
                            <div className="d-flex align-items-center mt-4">
                                <QuantityBox />
                                <Button className='btn-green btn-lg btn-big btn-round ml-3'> <BsCartFill /> &nbsp; Add To Cart</Button>
                                <Tooltip title='Add To Wishlist' placement='top'>
                                    <Button className='btn-green btn-lg btn-circle ml-4'> <FaRegHeart /></Button>
                                </Tooltip>
                                <Tooltip title='Add To Compare' placement='top'>
                                    <Button className='btn-green btn-lg  btn-circle ml-2'> <IoShuffleOutline /></Button>
                                </Tooltip>
                            </div>
                        </div>
                    </div>

                    <br />

                    <div className="card mt-5 p-5 detalsPageTabs">
                        <div className="customTabs">
                            <ul className="list-inline">
                                <li className="list-inline-item">
                                    <button
                                        className={activeTabs === 0 ? "active" : ""}
                                        onClick={() => setActiveTabs(0)}
                                    >
                                        Description
                                    </button>
                                </li>
                                <li className="list-inline-item">
                                    <button
                                        className={activeTabs === 1 ? "active" : ""}
                                        onClick={() => setActiveTabs(1)}
                                    >
                                        Additional Info
                                    </button>
                                </li>
                                <li className="list-inline-item">
                                    <button
                                        className={activeTabs === 2 ? "active" : ""}
                                        onClick={() => setActiveTabs(2)}
                                    >
                                        Reviews ({reviewsData.length})
                                    </button>
                                </li>
                            </ul>

                            {/* DESCRIPTION */}
                            {activeTabs === 0 && (
                                <div className="tabContent">
                                    <p>
                                        Lorem ipsum dolor sit, amet consectetur adipisicing elit. Necessitatibus accusamus quae, alias minima dignissimos aperiam doloribus illum ea delectus magni laboriosam, maiores laborum blanditiis voluptatibus quibusdam earum repudiandae impedit pariatur.
                                        Totam, pariatur vero? Accusamus esse voluptas eos minima amet? Nisi suscipit perspiciatis rem tempore autem dolor explicabo vero unde sequi libero aliquid, provident, earum, nihil deleniti quasi ad neque consequatur!
                                        Enim illo sint iure dolore ipsam vero necessitatibus commodi quibusdam quia, aspernatur minus repellat nesciunt earum architecto autem esse debitis officia. Inventore veritatis molestiae voluptatum reiciendis suscipit minus dolores iure!
                                    </p>
                                </div>
                            )}

                            {/* ADDITIONAL INFO */}
                            {activeTabs === 1 && (
                                <div className="tabContent">
                                    <table className="table table-bordered">
                                        <tbody>
                                            <tr>
                                                <th>Size</th>
                                                <td>Small, Medium, Large, Extra Large</td>
                                            </tr>
                                            <tr>
                                                <th>GSM</th>
                                                <td>100–160</td>
                                            </tr>
                                            <tr>
                                                <th>Color</th>
                                                <td>Black, Blue, Brown</td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                            )}

                            {/* REVIEWS */}
                            {activeTabs === 2 && (
                                <div className="tabContent">
                                    <div className="row">
                                        {/* LEFT SIDE */}
                                        <div className="col-md-8 mt-3">
                                            <h5>Customer questions & answers</h5>

                                            {reviewsData.map((review, index) => (
                                                <div className="reviewsCard" key={index}>
                                                    <div className="reviewLeft">
                                                        <img src={review.img} alt="" />
                                                    </div>

                                                    <div className="reviewRight">
                                                        <div className="reviewTop">
                                                            <h6>{review.name}</h6>
                                                            <span>{review.date}</span>
                                                            <Rating value={review.rating} readOnly size="small" />
                                                        </div>
                                                        <p>{review.text}</p>
                                                    </div>
                                                </div>
                                            ))}

                                            {/* ADD REVIEW */}
                                            <div className="reviewForm mt-4">
                                                <h4>Add a review</h4>
                                                <textarea placeholder="Write Comment"></textarea>

                                                <div className="row mt-3">
                                                    <div className="col-md-6">
                                                        <input type="text" placeholder="Name" />
                                                    </div>
                                                    <div className="col-md-6">
                                                        <input type="email" placeholder="Email" />
                                                    </div>
                                                </div>

                                                <input
                                                    type="text"
                                                    className="mt-3"
                                                    placeholder="Website"
                                                />

                                                <button className="submitBtn mt-3">
                                                    Submit Review
                                                </button>
                                            </div>
                                        </div>

                                        {/* RIGHT SIDE (RATING SUMMARY) */}
                                        <div className="col-md-4">
                                            <h4>Customer reviews</h4>
                                            <h5>4.8 out of 5</h5>
                                            <Rating value={4.8} readOnly size="small" />

                                            <div className="ratingBars">
                                                {[5, 4, 3, 2, 1].map((star) => (
                                                    <div key={star} className="barRow">
                                                        <span>{star} star</span>
                                                        <div className="bar">
                                                            <div
                                                                className="fill"
                                                                style={{ width: `${star * 15}%` }}
                                                            ></div>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    <br />


                    <RelatedProducts title = 'Related products'/>
                    <RecentlyViewedProduct />


                </div>
            </section>
        </>
    )
}

export default Productdetails;