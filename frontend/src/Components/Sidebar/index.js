import React, { useState, useEffect } from 'react';
import VertBannerBox from '../../Assets/Images/Banners/Listing_Vertical_Banner.png';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import RangeSlider from 'react-range-slider-input';
import 'react-range-slider-input/dist/style.css';
import { Link, useSearchParams } from 'react-router-dom';
import { useApp } from '../../context/AppContext';

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
      <div className="filterBox">
        <h6 className='mb-3'>Product Categories</h6>
        <div className='scroll'>
          <ul>
            {categories.length === 0 && <li>Loading...</li>}
            {categories.map((c) => (
              <li key={c._id}>
                <FormControlLabel
                  className='w-100'
                  control={
                    <Checkbox
                      checked={selectedCats.includes(c.slug)}
                      onChange={() => toggleCat(c.slug)}
                    />
                  }
                  label={c.name}
                />
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="filterBox">
        <h6 className='mb-3'>Filter by Price</h6>
        <RangeSlider
          value={value}
          onInput={applyPrice}
          min={0}
          max={1000}
          step={5}
        />
        <div className="d-flex pt-2 pb-2 priceRange">
          <span>From: <strong className="text-dark">${value[0]}</strong></span>
          <span className="ml-auto">To: <strong className="text-dark">${value[1]}</strong></span>
        </div>
      </div>

      <div className="filterBox">
        <h6 className='mb-3'>Product Status</h6>
        <div className='scroll'>
          <ul>
            <li>
              <FormControlLabel
                className='w-100'
                control={
                  <Checkbox
                    checked={selectedStatus.includes('inStock')}
                    onChange={() => toggleStatus('inStock')}
                  />
                }
                label='In Stock'
              />
            </li>
            <li>
              <FormControlLabel
                className='w-100'
                control={
                  <Checkbox
                    checked={selectedStatus.includes('onSale')}
                    onChange={() => toggleStatus('onSale')}
                  />
                }
                label='On Sale'
              />
            </li>
          </ul>
        </div>
      </div>

      <div className="filterBox">
        <h6 className='mb-3'>Brands</h6>
        <div className='scroll'>
          <ul>
            {brands.map((b) => (
              <li key={b}>
                <FormControlLabel
                  className='w-100'
                  control={<Checkbox />}
                  label={b}
                />
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
