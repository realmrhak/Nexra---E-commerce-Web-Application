import { useRef, useState, useEffect } from "react";
import ProductModel from "../../../Components/ProductModel";
import ProductItem from "../../../Components/ProductItem";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import { Navigation } from "swiper/modules";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";

function RelatedProducts({ title = 'Related products', products: initialProducts = [], onProductDeleted }) {
    const prevRef = useRef(null);
    const nextRef = useRef(null);
    const [isOpenProductModel, setIsOpenProductModel] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [products, setProducts] = useState(initialProducts);

    // Sync if parent refetches with a new list
    useEffect(() => {
        setProducts(initialProducts);
    }, [initialProducts]);

    const viewProductDetails = (product) => {
        setSelectedProduct(product);
        setIsOpenProductModel(true);
    };

    const closeProductModal = () => setIsOpenProductModel(false);

    const handleDelete = (deletedId) => {
        setProducts((prev) => prev.filter((p) => p._id !== deletedId));
        if (onProductDeleted) onProductDeleted(deletedId);
    };

    if (!products || products.length === 0) return null;

    return (
        <>
            <div className="d-flex align-items-center mt-3">
                <div className="info w-75">
                    <h3 className="mb-0 hd">{title}</h3>
                </div>
            </div>
            <div className="product_row w-100 mt-3 position-relative">
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
                    breakpoints={{
                        0: { slidesPerView: 1 },
                        576: { slidesPerView: 2 },
                        992: { slidesPerView: 3 },
                        1200: { slidesPerView: 4 },
                        1400: { slidesPerView: 5 },
                    }}
                    className="mySwiper"
                >
                    {products.map((product) => (
                        <SwiperSlide key={product._id}>
                            <ProductItem
                                itemView="four"
                                product={product}
                                viewProductDetails={viewProductDetails}
                                onDelete={handleDelete}
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
    );
}

export default RelatedProducts;
