import { useState, useEffect } from 'react';
import ProductModel from '../../../Components/ProductModel';
import ProductItem from '../../../Components/ProductItem';

function RecentlyViewedProduct() {
    const [products, setProducts] = useState([]);
    const [isOpenProductModel, setIsOpenProductModel] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState(null);

    useEffect(() => {
        try {
            const list = JSON.parse(localStorage.getItem('nexra_recent') || '[]');
            setProducts(list);
        } catch {
            setProducts([]);
        }
    }, []);

    const viewProductDetails = (product) => {
        setSelectedProduct(product);
        setIsOpenProductModel(true);
    };

    const closeProductModal = () => setIsOpenProductModel(false);

    const handleDelete = (deletedId) => {
        // Remove from local state
        setProducts((prev) => prev.filter((p) => p._id !== deletedId));
        // Also remove from localStorage
        try {
            const list = JSON.parse(localStorage.getItem('nexra_recent') || '[]');
            const filtered = list.filter((p) => p._id !== deletedId);
            localStorage.setItem('nexra_recent', JSON.stringify(filtered));
        } catch {
            // ignore
        }
    };

    if (products.length === 0) return null;

    return (
        <>
            <div className="d-flex align-items-center mt-5">
                <div className="info w-75">
                    <h3 className="mb-0 hd">Recently Viewed Products</h3>
                </div>
            </div>
            <div className="product_row productRow5 w-100 mt-4 d-flex flex-wrap">
                {products.map((product) => (
                    <ProductItem
                        key={product._id}
                        itemView="four"
                        product={product}
                        viewProductDetails={viewProductDetails}
                        onDelete={handleDelete}
                    />
                ))}
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

export default RecentlyViewedProduct;
