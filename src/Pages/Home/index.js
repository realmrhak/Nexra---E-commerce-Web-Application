import HomeBanner from "../../Components/HomeBanner";
import BannerBox from "../../Assets/Images/Banners/Vertical-Banner-02.jpg";
import BannerBox1 from "../../Assets/Images/Banners/Vertical-Banner-03.jpg";
import BannerBox2 from "../../Assets/Images/Banners/Horizontal-Banner-02.png";
import BaggyPant from "../../Assets/Images/Items/Baggy_Pants.jpeg";
import Zipper1 from "../../Assets/Images/Items/Zipper-1.jpeg";
import Jacket1 from "../../Assets/Images/Items/Jacket-1.jpeg";

import Wallet1 from "../../Assets/Images/Items/Wallet-1.jpeg";
import SunGlasses from "../../Assets/Images/Items/Sun_Glasses.jpeg";
import TShirt from "../../Assets/Images/Items/T_Shirt.jpeg";
import Jacket2 from "../../Assets/Images/Items/Jacket-2.jpeg";
import Caps1 from "../../Assets/Images/Items/Caps-1.jpeg";
import newsLetterImg from '../../Assets/Images/News_Letter.webp'
import ProductItem from "../../Components/ProductItem";
import HomeCat from "../../Components/HomeCategory";
import Button from '@mui/material/Button';
import { TfiFullscreen } from "react-icons/tfi";
import { IoMdHeartEmpty } from "react-icons/io";
import Rating from "@mui/material/Rating";
import { IoIosArrowRoundForward } from "react-icons/io";
import { IoMailOutline } from 'react-icons/io5'



const Home = () => {
    const products = [
        {
            id: 1,
            img: BaggyPant,
            title: "Baggy Pant",
            oldPrice: "$20.00",
            newPrice: "$14.00"
        },
        {
            id: 2,
            img: Zipper1,
            title: "Zipper Jacket",
            oldPrice: "$25.00",
            newPrice: "$18.00"
        },
        {
            id: 3,
            img: Jacket1,
            title: "Winter Jacket",
            oldPrice: "$40.00",
            newPrice: "$30.00"
        },
        {
            id: 4,
            img: Wallet1,
            title: "Leather Wallet",
            oldPrice: "$15.00",
            newPrice: "$10.00"
        },
        {
            id: 5,
            img: SunGlasses,
            title: "Sun Glasses",
            oldPrice: "$22.00",
            newPrice: "$16.00"
        },
        {
            id: 6,
            img: TShirt,
            title: "T-Shirt",
            oldPrice: "$18.00",
            newPrice: "$12.00"
        },
        {
            id: 7,
            img: Jacket2,
            title: "Casual Jacket",
            oldPrice: "$35.00",
            newPrice: "$28.00"
        },
        {
            id: 8,
            img: Caps1,
            title: "Stylish Cap",
            oldPrice: "$10.00",
            newPrice: "$7.00"
        }
    ];

    return (
        <>
            <HomeBanner />
            <HomeCat />

            <section className="homeProducts w-100">
                <div className="container">
                    <div className="row">
                        <div className="col-md-3">
                            <div className="sticky">
                                <div className="banner">
                                    <img src={BannerBox} alt="Not found" className="cursor " />
                                </div>

                                <div className="banner mt-5">
                                    <img src={BannerBox1} alt="Not found" className="cursor " />
                                </div>
                            </div>
                        </div>

                        <div className="col-md-9 productRow">
                            <div className="d-flex align-items-center">
                                <div className="info w-75 ">
                                    <h3 className="mb-0 hd">Best Sellers</h3>
                                    <p className="text-light text-sml mb-0">Do not miss the current offers until the end of April.</p>
                                </div>

                                <Button className="veiwAllBtn ml-auto">View all <IoIosArrowRoundForward /></Button>

                            </div>
                            <ProductItem />


                            <div className="d-flex align-items-center mt-5">
                                <div className="info w-75 ">
                                    <h3 className="mb-0 hd">New Products</h3>
                                    <p className="text-light text-sml mb-0">New products with updated stocks.</p>
                                </div>

                                <Button className="veiwAllBtn ml-auto">View all <IoIosArrowRoundForward /></Button>

                            </div>
                            <div className="product_row productRow2 w-100 mt-4 d-flex">
                                {
                                    products.map((product) => (
                                        <NewProductCard
                                            key={product.id}
                                            img={product.img}
                                            title={product.title}
                                            oldPrice={product.oldPrice}
                                            newPrice={product.newPrice}
                                        />
                                    ))
                                }
                            </div>

                        </div>
                    </div>
                </div>
            </section>

            <section className="Horizontal-Banner">
                <div className="banner mt-4">
                    <img src={BannerBox2} alt="Not found" className="cursor " />
                </div>
            </section>

            <section className="newsLetterSection mt-3 mb-3 d-flex align-items-center">
                <div className="container">
                    <div className="row">
                        <div className="col-md-6">
                            <p className="text-white mb-1">$20 discount for your first order</p>
                            <h3 className="text-white">Join our newsletter and get...</h3>
                            <p className="text-light">Join our email subscription now to get updates on <br /> promotions and coupons.</p>

                            <form className="d-flex align-items-center">
                                <IoMailOutline />
                                <input type="text" placeholder="Your Email Address" />
                                <button>Subscribe</button>
                            </form>
                        </div>

                        <div className="col-md-6">
                            <img src={newsLetterImg} alt="Not found" />
                        </div>

                    </div>
                </div>
            </section>



        </>
    )
}

export default Home;

const NewProductCard = ({ img, title, oldPrice, newPrice }) => {
    return (
        <div className="item productItem mb-4">
            <div className="imageWrapper">
                <img src={img} alt={title} className="w-100" />

                <span className="badge badge-primary">28%</span>

                <div className="actions">
                    <Button>
                        <TfiFullscreen />
                    </Button>

                    <Button>
                        <IoMdHeartEmpty style={{ fontSize: "20px" }} />
                    </Button>
                </div>
            </div>

            <div className="info">
                <h4>{title}</h4>

                <span className="text-success d-block">
                    In Stock
                </span>

                <Rating
                    className="mt-2 mb-2"
                    value={5}
                    readOnly
                    size="small"
                />

                <div className="d-flex">
                    <span className="oldPrice">
                        {oldPrice}
                    </span>

                    <span className="netPrice text-danger ml-2">
                        {newPrice}
                    </span>
                </div>
            </div>
        </div>
    );
};