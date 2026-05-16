import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Header from './Components/Header';
import Home from './Pages/Home';
import Listing from './Pages/Listing';
import ProductDetails from './Pages/ProductDetails';
import Cart from "./Pages/Cart";
import Login from "./Pages/Login";
import { createContext } from 'react';
import { useState } from 'react';
import axios from 'axios';
import { useEffect } from 'react';
import Footer from "../src/Components/Footer/index";
import Breadcrumbs from "./Components/Breadcrumbs";

const MyContext = createContext();

function App() {

  const [countryList, setcountryList] = useState([]);
  const [selectedcountry, setselectedcountry] = useState('');

  useEffect(()=>{
    getCountry("https://countriesnow.space/api/v0.1/countries/")
  },[])

  const getCountry = async(url) =>{
    const response = await axios.get(url).then((res)=>{
      setcountryList(res.data.data)
    })
  }

  const values = {
    countryList,
    setselectedcountry,
    selectedcountry

  }
  return (
    
    <BrowserRouter>
    <MyContext.Provider value = {values}>
    <Header/>
    <Breadcrumbs /> 
    <Routes>
      <Route path = "/" exact = {true} element={<Home />} />
      <Route path = "/shop/:id" exact = {true} element={<Listing />} />
      <Route path = "/product/:id" exact = {true} element={<ProductDetails />} />
      <Route path = "/cart" exact = {true} element={<Cart />} />
      <Route path = "/login" exact = {true} element={<Login />} />
    </Routes>
    <Footer />
    </MyContext.Provider>
    </BrowserRouter>
  );
}

export default App;

export {MyContext}
