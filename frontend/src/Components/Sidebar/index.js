import React, { useState, useEffect } from 'react';
import VertBannerBox from '../../Assets/Images/Banners/Listing_Vertical_Banner.png';
import RangeSlider from 'react-range-slider-input';
import 'react-range-slider-input/dist/style.css';
import { Link, useSearchParams } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { FolderTree, DollarSign, PackageCheck, Tag } from 'lucide-react';

function Sidebar({ onFilterChange }) {
  const { categories } = useApp();
  const [searchParams, setSearchParams] = useSearchParams();
  const [value, setValue] = useState([
    Number(searchParams.get('minPrice')) || 0,
    Number(searchParams.get('maxPrice')) || 1000,
  ]);

  // Selected categories (slug-based)
  const [selectedCats, setSelectedCats] = useState(
    searchParams.getAll('category').length ? searchParams.getAll('category') : []
  );
  const [selectedStatus, setSelectedStatus] = useState(searchParams.getAll('status'));
  const [selectedBrands, setSelectedBrands] = useState([]);

  // Sync URL changes
  useEffect(() => {
    setSelectedCats(searchParams.getAll('category'));
    setSelectedStatus(searchParams.getAll('status'));
    setValue([
      Number(searchParams.get('minPrice')) || 0,
      Number(searchParams.get('maxPrice')) || 1000,
    ]);
  }, [searchParams]);

  // Propagate filter changes upward
  useEffect(() => {
    if (!onFilterChange) return;
    onFilterChange({
      categories: selectedCats,
      status: selectedStatus,
      minPrice: value[0],
      maxPrice: value[1],
    });
  }, [selectedCats, selectedStatus, value, onFilterChange]);

  const toggleCat = (slug) => {
    const next = selectedCats.includes(slug)
      ? selectedCats.filter((c) => c !== slug)
      : [...selectedCats, slug];
    setSelectedCats(next);
    const params = new URLSearchParams(searchParams);
    params.delete('category');
    next.forEach((c) => params.append('category', c));
    setSearchParams(params);
  };

  const toggleStatus = (s) => {
    const next = selectedStatus.includes(s)
      ? selectedStatus.filter((x) => x !== s)
      : [...selectedStatus, s];
    setSelectedStatus(next);
    const params = new URLSearchParams(searchParams);
    params.delete('status');
    next.forEach((x) => params.append('status', x));
    setSearchParams(params);
  };

  const applyPrice = (vals) => {
    setValue(vals);
    const params = new URLSearchParams(searchParams);
    params.set('minPrice', vals[0]);
    params.set('maxPrice', vals[1]);
    setSearchParams(params);
  };

  const brands = ['Ralph Lauren', 'Zellbury', 'Charcoal', 'Uniworth', 'Legacy'];

  return (
    <div className="sidebar">
      {/* ===== Product Categories ===== */}
      <div className="filterBox">
        <h6 className='mb-3 sidebarFilterTitle'>
          <FolderTree size={16} className="sidebarFilterIcon" />
          Product Categories
        </h6>
        <div className='scroll'>
          <ul className="sidebarCheckList">
            {categories.length === 0 && <li className="sidebarCheckItem">Loading...</li>}
            {categories.map((c) => (
              <li key={c._id} className="sidebarCheckItem">
                <label className="sidebarCheckbox">
                  <input
                    type="checkbox"
                    checked={selectedCats.includes(c.slug)}
                    onChange={() => toggleCat(c.slug)}
                  />
                  <span className="sidebarCheckmark"></span>
                  <span className="sidebarCheckLabel">{c.name}</span>
                </label>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* ===== Filter by Price ===== */}
      <div className="filterBox">
        <h6 className='mb-3 sidebarFilterTitle'>
          <DollarSign size={16} className="sidebarFilterIcon" />
          Filter by Price
        </h6>
        <RangeSlider
          value={value}
          onInput={applyPrice}
          min={0}
          max={1000}
          step={5}
        />
        <div className="d-flex pt-2 pb-2 priceRange">
          <span>From: <strong className="priceRangeValue">${value[0]}</strong></span>
          <span className="ml-auto">To: <strong className="priceRangeValue">${value[1]}</strong></span>
        </div>
      </div>

      {/* ===== Product Status ===== */}
      <div className="filterBox">
        <h6 className='mb-3 sidebarFilterTitle'>
          <PackageCheck size={16} className="sidebarFilterIcon" />
          Product Status
        </h6>
        <div className='scroll'>
          <ul className="sidebarCheckList">
            <li className="sidebarCheckItem">
              <label className="sidebarCheckbox">
                <input
                  type="checkbox"
                  checked={selectedStatus.includes('inStock')}
                  onChange={() => toggleStatus('inStock')}
                />
                <span className="sidebarCheckmark"></span>
                <span className="sidebarCheckLabel">In Stock</span>
              </label>
            </li>
            <li className="sidebarCheckItem">
              <label className="sidebarCheckbox">
                <input
                  type="checkbox"
                  checked={selectedStatus.includes('onSale')}
                  onChange={() => toggleStatus('onSale')}
                />
                <span className="sidebarCheckmark"></span>
                <span className="sidebarCheckLabel">On Sale</span>
              </label>
            </li>
          </ul>
        </div>
      </div>

      {/* ===== Brands ===== */}
      <div className="filterBox">
        <h6 className='mb-3 sidebarFilterTitle'>
          <Tag size={16} className="sidebarFilterIcon" />
          Brands
        </h6>
        <div className='scroll'>
          <ul className="sidebarCheckList">
            {brands.map((b) => (
              <li key={b} className="sidebarCheckItem">
                <label className="sidebarCheckbox">
                  <input type="checkbox" />
                  <span className="sidebarCheckmark"></span>
                  <span className="sidebarCheckLabel">{b}</span>
                </label>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <Link to='#'>
        <img
          src={VertBannerBox}
          className='w-100'
          style={{ marginLeft: '-37px', borderRadius: '15px' }}
          alt="Promotion banner"
          loading="lazy"
        />
      </Link>
    </div>
  );
}

export default Sidebar;
