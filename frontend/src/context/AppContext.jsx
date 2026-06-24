import { createContext, useContext, useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import api from '../api/axios';

const AppContext = createContext(null);

/**
 * App-wide context: country list (loaded once from public API),
 * global categories (loaded once from backend).
 */
export const AppProvider = ({ children }) => {
  const [countryList, setCountryList] = useState([]);
  const [selectedCountry, setSelectedCountry] = useState('');
  const [categories, setCategories] = useState([]);

  // Load country list once
  useEffect(() => {
    let cancelled = false;
    axios
      .get('https://countriesnow.space/api/v0.1/countries/')
      .then((res) => {
        if (!cancelled) setCountryList(res.data.data || []);
      })
      .catch(() => {
        // Fallback list
        if (!cancelled) {
          setCountryList([
            { iso2: 'US', country: 'United States' },
            { iso2: 'GB', country: 'United Kingdom' },
            { iso2: 'PK', country: 'Pakistan' },
            { iso2: 'IN', country: 'India' },
            { iso2: 'AE', country: 'United Arab Emirates' },
          ]);
        }
      });
    return () => {
      cancelled = true;
    };
  }, []);

  // Load categories once from backend
  const fetchCategories = useCallback(async () => {
    try {
      const res = await api.get('/api/categories');
      setCategories(res.data.data || []);
    } catch {
      setCategories([]);
    }
  }, []);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  const value = {
    countryList,
    selectedCountry,
    setSelectedCountry,
    categories,
    refreshCategories: fetchCategories,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useApp = () => {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
};

export default AppContext;
