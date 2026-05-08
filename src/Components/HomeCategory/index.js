import React, { useRef } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import 'swiper/css';
import 'swiper/css/free-mode';
import 'swiper/css/navigation';
import { Navigation } from 'swiper/modules';
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";

import CheckShirt from "../../Assets/Images/Category Items/Check_Shirt.png";
import Hoodie from "../../Assets/Images/Category Items/Zipper.png";
import Jacket from "../../Assets/Images/Category Items/Jackets.png";
import Polo from "../../Assets/Images/Category Items/polo.png";
import HalfSleeves from "../../Assets/Images/Category Items/Half_Sleeves.png";
import Tshirts from "../../Assets/Images/Category Items/T-Shirt.png";
import Caps from "../../Assets/Images/Category Items/Caps.png";
import Headphones from "../../Assets/Images/Category Items/Headphones.png";
import Pants from "../../Assets/Images/Category Items/Baggy_Pants.png";
import Wallet from "../../Assets/Images/Category Items/Wallets.png";
import SunGlasses from "../../Assets/Images/Category Items/Sun_Glasses.png";
import Perfume from "../../Assets/Images/Category Items/Perfume.png";

const HomeCat = () => {

    // 🎨 static colors (no useState needed)
    const itemBg = [
        '#fffceb',
        '#ecffec',
        '#feefea',
        '#fff3eb',
        '#f2fce4',
        '#fff3ff',
        '#ecffec',
        '#feefea',
        '#fff3eb',
        '#f2fce4',
    ];

    const categories = [
        { img: CheckShirt, title: "Check Shirts" },
        { img: Polo, title: "Polo" },
        { img: Tshirts, title: "T-Shirts" },
        { img: HalfSleeves, title: "Half Sleeves" },
        { img: Pants, title: "Baggy Pants" },
        { img: Hoodie, title: "Hoodies" },
        { img: Jacket, title: "Jackets" },
        { img: Wallet, title: "Wallets" },
        { img: SunGlasses, title: "Sun Glasses" },
        { img: Caps, title: "Caps" },
        { img: Perfume, title: "Perfume" },
        { img: Headphones, title: "Headphones" },
    ];

    const prevRef = useRef(null);
    const nextRef = useRef(null);

    return (
        <section className="homeCat">
            <div className="container">

                <h3 className="hd mb-4">Featured Categories</h3>

                {/* Navigation */}
                <button className="customSwipPrev" ref={prevRef}>
                    <FaChevronLeft />
                </button>

                <button className="customSwipNext" ref={nextRef}>
                    <FaChevronRight />
                </button>

                <Swiper
                    slidesPerView={8}
                    spaceBetween={12}
                    slidesPerGroup={1}
                    modules={[Navigation]}

                    onBeforeInit={(swiper) => {
                        swiper.params.navigation.prevEl = prevRef.current;
                        swiper.params.navigation.nextEl = nextRef.current;
                    }}

                    navigation={{
                        prevEl: prevRef.current,
                        nextEl: nextRef.current,
                    }}
                    className="mySwiper"
                >
                    {
                        categories.map((item, index) => (
                            <SwiperSlide key={item.title}>
                                <ProductCatCard
                                    img={item.img}
                                    title={item.title}
                                    bg={itemBg[index % itemBg.length]}
                                />
                            </SwiperSlide>
                        ))
                    }
                </Swiper>
            </div>
        </section>
    );
};

export default HomeCat;


/* 🔥 Card Component */
const ProductCatCard = ({ img, title, bg }) => {
    return (
        <div className="item text-center cursor" style={{ background: bg }}>
            <div className="imgBox">
                <img src={img} alt={title} />
            </div>
            <h6 className="text-sml">{title}</h6>
        </div>
    );
};