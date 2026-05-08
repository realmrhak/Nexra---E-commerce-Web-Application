import { FaMinus } from 'react-icons/fa6';
import { FaPlus } from 'react-icons/fa6';
import Button from '@mui/material/Button';
import { useState } from 'react';


const QuantityBox = () => {

    const [inputVal, setinputVal] = useState(1)

    const minusHandler = () => {
        if(inputVal > 1) {
            setinputVal(inputVal - 1);
        }
    }

    const plusHandler = () => {
        setinputVal(inputVal + 1);
    }

    return (
        <>
            <div className="quantityDrop d-flex align-items-center">
                <Button onClick={minusHandler}><FaMinus /></Button>
                <input type="text" value={inputVal}/>
                <Button onClick={plusHandler}><FaPlus /></Button>
            </div>
        </>
    );
}

export default QuantityBox;