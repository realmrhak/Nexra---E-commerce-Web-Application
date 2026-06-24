import Button from '@mui/material/Button';
import { FaAngleDown } from "react-icons/fa6";
import Dialog from '@mui/material/Dialog';
import { FaSearch } from "react-icons/fa";
import { MdClose } from 'react-icons/md';
import { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';

const CountryDropdown = () => {
    const { countryList, selectedCountry, setSelectedCountry } = useApp();
    const [isOpenModel, setisOpenModel] = useState(false);
    const [selectedTab, setselectedTab] = useState(null);
    const [filteredList, setFilteredList] = useState([]);

    useEffect(() => {
        setFilteredList(countryList);
    }, [countryList]);

    const selectCountry = (index, country) => {
        setselectedTab(index);
        setisOpenModel(false);
        setSelectedCountry(country);
    };

    const filterList = (e) => {
        const keyword = e.target.value.toLowerCase();
        if (keyword.trim() === '') {
            setFilteredList(countryList);
            return;
        }
        setFilteredList(countryList.filter((item) => item.country.toLowerCase().includes(keyword)));
    };

    return (
        <>
            <Button className="countryDrop" onClick={() => setisOpenModel(true)}>
                <div className="info d-flex flex-column">
                    <span className='label'>Your Location</span>
                    <span className='name'>
                        {selectedCountry !== ""
                            ? selectedCountry.length > 10
                                ? selectedCountry.substr(0, 10) + '...'
                                : selectedCountry
                            : 'Select Location'}
                    </span>
                </div>
                <span className='ml-auto'><FaAngleDown /></span>
            </Button>

            <Dialog open={isOpenModel} onClose={() => setisOpenModel(false)} className='locationModel'>
                <h4 className='mb-0'>Choose your Delivery Location</h4>
                <p>Enter your address and we will specify the offer for the area.</p>
                <Button className='close_' onClick={() => setisOpenModel(false)}><MdClose /></Button>
                <div className="headerSearch w-100">
                    <input type="text" placeholder='Search your area' onChange={filterList} />
                    <Button><FaSearch /></Button>
                </div>

                <ul className='countryList mt-3'>
                    {filteredList?.length !== 0 && filteredList?.map((item, index) => {
                        return (
                            <li key={index}>
                                <Button
                                    onClick={() => selectCountry(index, item.country)}
                                    className={`${selectedTab === index ? 'active' : ''}`}
                                >
                                    {item.country}
                                </Button>
                            </li>
                        );
                    })}
                </ul>
            </Dialog>
        </>
    );
};

export default CountryDropdown;
