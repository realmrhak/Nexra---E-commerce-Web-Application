import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Header from './Components/Header';
import Home from './Pages/Home';
import Listing from './Pages/Listing';
import { createContext } from 'react';
import { useState } from 'react';
import axios from 'axios';
import { useEffect } from 'react';
import Footer from "../src/Components/Footer/index";

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
    <Routes>
      <Route path = "/" exact = {true} element={<Home/>} />
      <Route path = "/shop/:id" exact = {true} element={<Listing/>} />
    </Routes>
    <Footer />
    </MyContext.Provider>
    </BrowserRouter>
  );
}

export default App;

export {MyContext}
