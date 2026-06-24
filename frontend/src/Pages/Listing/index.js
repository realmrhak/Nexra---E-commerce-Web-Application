import React, { useState, useEffect, useCallback, useMemo } from 'react';
import Button from "@mui/material/Button";
import { SlMenu } from "react-icons/sl";
import { HiViewGrid } from "react-icons/hi";
import { BiSolidGrid } from "react-icons/bi";
import { TfiLayoutGrid4Alt } from "react-icons/tfi";
import { FaAngleDown } from 'react-icons/fa';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Sidebar from '../../Components/Sidebar';
import HoriBannerBox from '../../Assets/Images/Banners/Listing_Horizontal_Banner.jpg';
import ProductItem from '../../Components/ProductItem';
import ProductModel from '../../Components/ProductModel';
import Pagination from '@mui/material/Pagination';
import { useSearchParams, Link } from 'react-router-dom';
import { Plus } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import api from '../../api/axios';

function Listing() {
  const id = React.useId();
  const buttonId = `${id}-button`;
  const menuId = `${id}-menu`;
  const [anchorEl, setAnchorEl] = React.useState(null);
  const openDropdown = Boolean(anchorEl);
  const { isAdmin } = useAuth();

  const [searchParams, setSearchParams] = useSearchParams();
  const [productView, setProductView] = useState('four');
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(Number(searchParams.get('page')) || 1);
  const [pages, setPages] = useState(1);
  const [limit, setLimit] = useState(Number(searchParams.get('limit')) || 12);
  const [total, setTotal] = useState(0);
  const [filters, setFilters] = useState({ categories: [], status: [], minPrice: 0, maxPrice: 1000 });

  const [isOpenProductModel, setIsOpenProductModel] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  // Sync page + limit back to URL
  useEffect(() => {
    const params = new URLSearchParams(searchParams);
    params.set('page', page);
    params.set('limit', limit);
    setSearchParams(params, { replace: true });
  }, [page, limit]);

  const loadProducts = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams(searchParams);
      params.set('page', page);
      params.set('limit', limit);

      // Ensure sort is always set (default newest)
      if (!params.get('sort')) params.set('sort', 'newest');

      // status filters
      const status = params.getAll('status');
      if (status.includes('inStock')) params.set('inStock', 'true');

      // Use categorySlug if a single category is selected
      const selectedCats = params.getAll('category');
      params.delete('category');
      if (selectedCats.length === 1) {
        params.set('categorySlug', selectedCats[0]);
      }

      const res = await api.get('/api/products', { params });
      setProducts(res.data.data || []);
      setPages(res.data.pages || 1);
      setTotal(res.data.total || 0);
    } catch (err) {
      console.warn('Failed to load products:', err.message);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  }, [searchParams, page, limit]);

  useEffect(() => {
    loadProducts();
  }, [loadProducts]);

  const viewProductDetails = (product) => {
    setSelectedProduct(product);
    setIsOpenProductModel(true);
  };

  const closeProductModal = () => setIsOpenProductModel(false);

  const handleSortChange = (e) => {
    const params = new URLSearchParams(searchParams);
    params.set('sort', e.target.value);
    setSearchParams(params);
  };

  const currentSort = searchParams.get('sort') || 'newest';

  const categoryTitle = useMemo(() => {
    const cats = searchParams.getAll('category');
    if (cats.length === 1) {
      return `Category: ${cats[0]}`;
    }
    if (searchParams.get('search')) {
      return `Search: "${searchParams.get('search')}"`;
    }
    return 'All Products';
  }, [searchParams]);

  return (
    <section className='product_listing_page'>
      <div className="container">
        <div className="productListing d-flex">
          <Sidebar onFilterChange={setFilters} />

          <div className="content_right">
            <img
              className='w-100 ml-4'
              style={{ borderRadius: '8px' }}
              src={HoriBannerBox}
              alt="Promotional banner"
              loading="lazy"
            />

            <div className="showBy ml-4 mb-3 mt-3 d-flex align-items-center">
              <div className="d-flex align-items-center btnWrapper">
                <Button className={`ico2 ${productView === 'one' ? 'act' : ''}`}
                  onClick={() => setProductView('one')}><SlMenu /></Button>
                <Button className={`ico1 ${productView === 'two' ? 'act' : ''}`}
                  onClick={() => setProductView('two')}><HiViewGrid /></Button>
                <Button className={`ico1 ${productView === 'three' ? 'act' : ''}`}
                  onClick={() => setProductView('three')}><BiSolidGrid /></Button>
                <Button
                  className={`ico2 ${productView === 'four' ? 'act' : ''}`}
                  onClick={() => setProductView('four')}
                >
                  <TfiLayoutGrid4Alt />
                </Button>
              </div>

              <div className="ml-auto d-flex align-items-center">
                <span className="mr-2 text-sml">Sort:</span>
                <select
                  className="form-control"
                  style={{ width: 'auto' }}
                  value={currentSort}
                  onChange={handleSortChange}
                >
                  <option value="newest">Newest</option>
                  <option value="price-asc">Price: Low to High</option>
                  <option value="price-desc">Price: High to Low</option>
                  <option value="rating-desc">Top Rated</option>
                  <option value="popular">Most Popular</option>
                </select>

                <div className="showByFilter ml-2">
                  <Button onClick={(e) => setAnchorEl(e.currentTarget)}>
                    Show {limit} <FaAngleDown />
                  </Button>
                  <Menu
                    className='w-100 showPerPageDropdown'
                    id={menuId}
                    anchorEl={anchorEl}
                    open={openDropdown}
                    onClose={() => setAnchorEl(null)}
                    slotProps={{ list: { 'aria-labelledby': buttonId } }}
                  >
                    {[8, 12, 16, 24, 32, 40].map((n) => (
                      <MenuItem
                        key={n}
                        onClick={() => {
                          setLimit(n);
                          setPage(1);
                          setAnchorEl(null);
                        }}
                      >
                        {n}
                      </MenuItem>
                    ))}
                  </Menu>
                </div>
              </div>
            </div>

            <div className="ml-4 mb-3 d-flex align-items-center flex-wrap" style={{ gap: 8 }}>
              <div style={{ flex: 1, minWidth: 200 }}>
                <h5 className="hd">{categoryTitle}</h5>
                <p className="text-light text-sml mb-0">
                  {loading ? 'Loading…' : `Showing ${products.length} of ${total} products`}
                </p>
              </div>
              {/* ===== ADMIN-ONLY: Add Product button ===== */}
              {isAdmin && (
                <Link to="/admin/products/new" className="adminAddCardBtn">
                  <Plus size={16} /> Add Product
                </Link>
              )}
            </div>

            <div className="productGrid ml-5">
              {loading ? (
                <div className="text-center py-5">Loading products…</div>
              ) : products.length === 0 ? (
                <div className="text-center py-5 text-muted">
                  No products match your filters. <a href="/shop">Clear filters</a>
                </div>
              ) : (
                products.map((product) => (
                  <ProductItem
                    key={product._id}
                    itemView={productView}
                    product={product}
                    viewProductDetails={viewProductDetails}
                    onDelete={(deletedId) => {
                      setProducts((prev) => prev.filter((p) => p._id !== deletedId));
                      setTotal((t) => Math.max(0, t - 1));
                    }}
                  />
                ))
              )}
            </div>

            <div className="PaginationPart d-flex align-items-center justify-content-center mt-5">
              <Pagination
                count={pages}
                page={page}
                color='primary'
                onChange={(_e, v) => setPage(v)}
              />
            </div>
          </div>
        </div>
      </div>

      {isOpenProductModel && (
        <ProductModel
          product={selectedProduct}
          closeProductModal={closeProductModal}
        />
      )}
    </section>
  );
}

export default Listing;
