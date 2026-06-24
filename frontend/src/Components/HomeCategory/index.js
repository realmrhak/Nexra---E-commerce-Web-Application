import React, { useRef, useMemo } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import 'swiper/css';
import 'swiper/css/free-mode';
import 'swiper/css/navigation';
import { Navigation } from 'swiper/modules';
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { Link } from 'react-router-dom';
import { useApp } from "../../context/AppContext";

// Fallback local images used if the category has no image
import CheckShirt from "../../Assets/Images/Category Items/Check_Shirt.png";
import Polo from "../../Assets/Images/Category Items/polo.png";
import Tshirts from "../../Assets/Images/Category Items/T-Shirt.png";
import Pants from "../../Assets/Images/Category Items/Baggy_Pants.png";
import Wallet from "../../Assets/Images/Category Items/Wallets.png";
import SunGlasses from "../../Assets/Images/Category Items/Sun_Glasses.png";
import Perfume from "../../Assets/Images/Category Items/Perfume.png";
import Headphones from "../../Assets/Images/Category Items/Headphones.png";

const FALLBACK_IMG = {
    Shirts: CheckShirt,
    Pants: Pants,
    Wallets: Wallet,
    'Sun Glasses': SunGlasses,
    Perfume: Perfume,
    Caps: Headphones,
    Polo: Polo,
    Tshirts: Tshirts,
};

const itemBg = [
    '#fffceb', '#ecffec', '#feefea', '#fff3eb', '#f2fce4',
    '#fff3ff', '#ecffec', '#feefea', '#fff3eb', '#f2fce4',
];

const HomeCat = () => {
    const { categories } = useApp();
    const prevRef = useRef(null);
    const nextRef = useRef(null);

    const items = useMemo(() => {
        return categories.map((c) => ({
            _id: c._id,
            slug: c.slug,
            title: c.name,
            img: c.image?.url || FALLBACK_IMG[c.name] || Polo,
        }));
    }, [categories]);

    return (
        <section className="homeCat">
            <div className="container">
                <h3 className="hd mb-4">Featured Categories</h3>

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
                    breakpoints={{
                        0: { slidesPerView: 3 },
                        576: { slidesPerView: 4 },
                        768: { slidesPerView: 6 },
                        992: { slidesPerView: 8 },
                    }}
                >
                    {items.map((item, index) => (
                        <SwiperSlide key={item._id}>
                            <Link to={`/category/${item.slug}`}>
                                <ProductCatCard
                                    img={item.img}
                                    title={item.title}
                                    bg={itemBg[index % itemBg.length]}
                                />
                            </Link>
                        </SwiperSlide>
                    ))}
                </Swiper>
            </div>
        </section>
    );
};

const ProductCatCard = ({ img, title, bg }) => {
    return (
        <div className="item text-center cursor" style={{ background: bg }}>
            <div className="imgBox">
                <img src={img} alt={title} loading="lazy" />
            </div>
            <h6 className="text-sml">{title}</h6>
        </div>
    );
};

export default HomeCat;
