import { BrowserRouter, Routes, Route } from 'react-router-dom';
import AuthLayout from './Layouts/AuthLayout.js';
import MainLayout from './Layouts/MainLayout.js';
import Home from './Pages/Home';
import Listing from './Pages/Listing';
import ProductDetails from './Pages/ProductDetails';
import Cart from "./Pages/Cart";
import LoginPage from './Pages/Login/index.js';
import RegisterPage from './Pages/Register/index.js';
import ForgotPasswordPage from "./Pages/ForgotPasswordPage/index.js";
import { createContext, useState, useEffect } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';

const MyContext = createContext();

function App() {

  const [countryList, setcountryList] = useState([]);
  const [selectedcountry, setselectedcountry] = useState('');

  useEffect(() => {
    getCountry("https://countriesnow.space/api/v0.1/countries/");
  }, []);

  const getCountry = async (url) => {
    const res = await axios.get(url);
    setcountryList(res.data.data);
  };

  const values = {
    countryList,
    setselectedcountry,
    selectedcountry
  };

  return (
    <BrowserRouter>
      <MyContext.Provider value={values}>
        <Routes>

          {/* ✅ MAIN APP PAGES */}
          <Route element={<MainLayout />}>
            <Route path="/" element={<Home />} />
            <Route path="/shop/:id" element={<Listing />} />
            <Route path="/product/:id" element={<ProductDetails />} />
            <Route path="/cart" element={<Cart />} />
          </Route>

          {/* ✅ AUTH PAGES */}
          <Route element={<AuthLayout />}>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          </Route>
        </Routes>
      </MyContext.Provider>
    </BrowserRouter>
  );
}

export default App;
export { MyContext };