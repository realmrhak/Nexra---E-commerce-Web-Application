import { useRef, useState} from "react";
import ProductModel from "../../../Components/ProductModel";
import ProductItem from "../../../Components/ProductItem";
import BaggyPant from "../../../Assets/Images/Items/Baggy_Pants.jpeg";
import Zipper1 from "../../../Assets/Images/Items/Zipper-1.jpeg";
import Jacket1 from "../../../Assets/Images/Items/Jacket-1.jpeg";
import Wallet1 from "../../../Assets/Images/Items/Wallet-1.jpeg";
import SunGlasses from "../../../Assets/Images/Items/Sun_Glasses.jpeg";
import TShirt from "../../../Assets/Images/Items/T_Shirt.jpeg";
import Jacket2 from "../../../Assets/Images/Items/Jacket-2.jpeg";
import Caps1 from "../../../Assets/Images/Items/Caps-1.jpeg";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import { Navigation } from "swiper/modules";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";





function RelatedProducts(props) {

    const prevRef = useRef(null);
    const nextRef = useRef(null);
    const [isOpenProductModel, setIsOpenProductModel] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState(null);

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

    const viewProductDetails = (product) => {
        setSelectedProduct(product);
        setIsOpenProductModel(true);
    };

    const closeProductModal = () => {
        setIsOpenProductModel(false);
    };

    return (
        <>
            <div className="d-flex align-items-center mt-3">
                <div className="info w-75 ">
                    <h3 className="mb-0 hd">{props.title}</h3>
                </div>

            </div>
            <div className="product_row w-100 mt-3 position-relative">

                {/* CUSTOM NAVIGATION BUTTONS */}
                <button className="customSwipPrev" ref={prevRef}>
                    <FaChevronLeft />
                </button>

                <button className="customSwipNext" ref={nextRef}>
                    <FaChevronRight />
                </button>

                <Swiper
                    slidesPerView={5}
                    spaceBetween={8}
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

                    className="mySwiper">
                    {products.map((product) => (
                        <SwiperSlide key={product.id}>
                            <ProductItem
                                itemView="four"
                                product={product}
                                viewProductDetails={viewProductDetails}
                            />
                        </SwiperSlide>
                    ))}

                </Swiper>
            </div>
            {isOpenProductModel && (
                <ProductModel
                    product={selectedProduct}
                    closeProductModal={closeProductModal}
                />
            )}
        </>
    )
}

export default RelatedProducts