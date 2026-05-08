import HomeBanner from "../../Components/HomeBanner";
import BannerBox from "../../Assets/Images/Banners/Vertical-Banner-02.jpg";
import BannerBox1 from "../../Assets/Images/Banners/Vertical-Banner-03.jpg";
import BannerBox2 from "../../Assets/Images/Banners/Horizontal-Banner-02.png";
import newsLetterImg from '../../Assets/Images/News_Letter.webp'
import ProductItem from "../../Components/ProductItem";
import ProductCardSection from "../../Components/ProductCardSection";
import HomeCat from "../../Components/HomeCategory";
import Button from '@mui/material/Button';
import { IoIosArrowRoundForward } from "react-icons/io";
import { IoMailOutline } from 'react-icons/io5'



const Home = () => {
    
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
                            <ProductCardSection />

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

