import React, { useState } from 'react'
import upload from '../../assets/upload.svg'
import info from '../../assets/info.svg'
import arrowdown from '../../assets/arrowdown.svg'
import plastic from '../../assets/plastic.svg'
import grams from '../../assets/grams.svg'
import { getCountryInfoByISO } from '../../utils/iso-country-currency'
import RemoveModel from './RemoveModel'


const userCountry = 'PK'
const countryInfo = getCountryInfoByISO(userCountry);
const ranges = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11];

const EditList = () => {
    const [model, setModel] = useState(false)
    const [inputValues, setInputValues] = useState({
        discimage: null,
        quantity: 1,
        discName: 'Annax',
        brand: 'Discmania',
        range: 'Hex',
        condition: 9,
        plastic: 'Plastic',
        grams: '22.2',
        named: false,
        dyed: true,
        blank: false,
        glow: true,
        collectible: false,
        firstRun: false,
        priceType: 'auction',
        startingPrice: '6000',
        minPrice: '6100',
        endDay: "2023-03-29",
        endTime: "13:48",
    });

    const [optional, setOptional] = useState(false);
    const handleOptionalChange = (event) => {
        if (event.target.name === 'priceType') {
            setInputValues((prevInputValues) => ({
                ...prevInputValues,
                [event.target.name]: event.target.id,
            }));
            return
        }
        if (event.target.type === 'checkbox' && event.target.name !== 'priceType') {
            const { name, type, checked, value } = event.target;
            const newValue = type === 'checkbox' ? checked : value;
            setInputValues((prevInputValues) => ({
                ...prevInputValues,
                [name]: newValue,
            }));
            return
        }
        setInputValues((prevInputValues) => ({
            ...prevInputValues,
            [event.target.name]: event.target.value,
        }));
    };

    const handleCondition = (range2) => {
        setInputValues((prevInputValues) => ({
            ...prevInputValues,
            "condition": range2,
        }));
    };

    const handlePublish = () => {
        console.log(inputValues);
    }
    return (
        <div>
            <div className='relative left-1/2  sm:text-[1rem] xsm:text-[1rem] text-[1.25rem] -translate-x-1/2 mr-[50px] min-h-[90vh] max-w-[1350px]  mt-[0.5em] '>
                <div className='flex justify-between w-full items-center mb-[15px]'>
                    <h1 className='font-[700] text-[1.25em] '>Edit listing</h1>
                </div>
                <div className='bg-[#FFFFFF] rounded-[8px] pb-[40px] px-[20px] xsm:px-[0] sm:px-[0] border-[#0000001f] border-[0.5px]'>
                    <div className='flex justify-center items-center h-[219px]'>
                        <img src={upload} alt="upload a picture" />
                    </div>
                    <div className=' border-[0.5px] border-[#0000002e] mb-[14px]'></div>
                    <div>
                        <label htmlFor="Qty" className='text-[0.75em] ml-[1em] text-[#595959] font-[700]'>Qty :<input name='quantity'
                            value={inputValues.quantity}
                            onChange={handleOptionalChange} type="number" min='1' className='ml-[8px] pl-[2px] border-[1px] h-[20px] rounded-[2px] w-[45px]' /></label>
                    </div>
                    <div className='flex justify-end mb-[3px] '>
                        <div className='w-[50%] flex pl-[10px] items-center '>
                            <h1 className=' font-sans text-[12px] font-[700] mr-[10px]'>Condition*</h1>
                            <img src={info} className='' alt="information" />
                        </div>
                    </div>

                    <div className='px-[0.8em] flex'>
                        <div className='w-[50%] flex flex-col gap-[9px] mr-[10px]'>
                            <input name='discName'
                                value={inputValues.discName}
                                onChange={handleOptionalChange} type="text" className='text-[0.75em] placeholder:font-[700] pl-[7px] border-[1px] border-[#595959]  xsm:h-[23px] sm:h-[23px] h-[1.938em] rounded-[2px] ' placeholder='Disc Name *' />
                            <select name='brand' value={inputValues.brand}
                                onChange={handleOptionalChange} className="w-full  text-[0.75em]  pl-[2px] border-[1px] border-[#595959]   rounded-[2px]  xsm:h-[23px] sm:h-[23px] h-[1.938em]  ">
                                <option disabled value="" selected hidden>Brand *</option>
                                <option>Zara</option>
                                <option>Gucci</option>
                                <option>Leopard</option>
                            </select>
                            <input
                                name='range'
                                value={inputValues.range}
                                onChange={handleOptionalChange}
                                list="rangeOptions"
                                className="w-full text-[0.75em] bg-white border-[1px] border-[#595959] pl-[6px] rounded-[2px]  xsm:h-[23px] sm:h-[23px] h-[1.938em]"
                                placeholder="Range *"
                            />
                            <datalist id="rangeOptions">
                                <option value="Zara" />
                                <option value="Gucci" />
                                <option value="Leopard" />
                                <option value="" disabled>
                                    Type something else
                                </option>
                            </datalist>
                        </div>
                        <div className="w-[50%] grid grid-cols-4 gap-x-2 gap-y-[6px]">
                            {ranges.map((condition, index) => (
                                <div
                                    key={index}
                                    className={`flex justify-center items-center rounded-full px-[8px] py-[3px] ${inputValues.condition === condition ? 'bg-[#81b29a2f]' : ''} border border-[#595959] cursor-pointer`}
                                    onClick={() => handleCondition(condition)}
                                >
                                    <span className="text-[12px]">{condition}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                    <span onClick={() => setOptional((prev) => !prev)} className='inline-flex text-[0.75em] mt-[18px] ml-[1em] text-[#595959] font-[700]'>Optional details <img className={`ml-[7px] transform ${optional ? 'rotate-180' : ''}`} src={arrowdown} /></span>
                    {optional &&
                        <div className='px-[0.8em] mt-[9px] flex flex-wrap  mb-[20px]'>

                            <div className='flex w-full'>
                                <div className='flex w-[50%] items-center gap-[6px]'>
                                    <img src={plastic} className="h-[20px]" alt="plastic" />
                                    <input name='plastic'
                                        value={inputValues.plastic}
                                        onChange={handleOptionalChange} type="text" className='border rounded-[2px] w-full  mr-[20px]   xsm:h-[1.25em] m:h-[1.25em] h-[1.75em]  text-[.75em] placeholder:font-[700] pl-[8px]' placeholder='Plastic...' />
                                </div>
                                <div className='flex w-[50%] items-center gap-[6px]'>
                                    <img src={grams} className="h-[20px]" alt="plastic" />
                                    <input name='grams'
                                        value={inputValues.grams}
                                        onChange={handleOptionalChange} type="number" className='border rounded-[2px] w-[50%] xsm:h-[1.25em] m:h-[1.25em] h-[1.75em]  text-[.75em] placeholder:font-[700] pl-[8px]' placeholder='Grams' />
                                </div>
                            </div>

                            <div className='w-[50%]  mt-[15px] flex items-center gap-[6px]'>
                                <input name='named'
                                    checked={inputValues.named}
                                    onChange={handleOptionalChange} id='named' type="checkbox" className="peer/published w-[18px] h-[18px] border border-gray-400 rounded-md bg-white checked:border-transparent checked:background-[#fffff] focus:outline-none focus:ring-1 focus:ring-offset-2 focus:ring-black" />
                                <svg width="18" height="18" className='peer-checked/published:fill-[#000000] fill-[#AAAAAA] '><path d="M0 15.6V18h18v-2.4H0Zm5.786-5.04h6.428l1.157 2.64h2.7L9.964 0H8.036L1.929 13.2h2.7l1.157-2.64ZM9 2.376 11.404 8.4H6.596L9 2.376Z" /></svg>
                                <p className='peer-checked/published:text-[#000000] text-[#AAAAAA] text-[12px] font-[700] '>Named</p>
                            </div>
                            <div className='w-[50%]  mt-[15px] flex items-center gap-[6px]'>
                                <input
                                    id='dyed'
                                    name='dyed'
                                    checked={inputValues.dyed}
                                    onChange={handleOptionalChange} type="checkbox" className="peer/published w-[18px] h-[18px] border border-gray-400 rounded-md bg-white checked:border-transparent checked:background-[#fffff] focus:outline-none focus:ring-1 focus:ring-offset-2 focus:ring-black" />
                                <svg width="20" height="20" className='peer-checked/published:fill-[#000000] fill-[#AAAAAA]  '><path d="M16.1111 10C15.6691 10 15.2452 9.82441 14.9326 9.51185C14.62 9.19928 14.4444 8.77536 14.4444 8.33333C14.4444 7.89131 14.62 7.46738 14.9326 7.15482C15.2452 6.84226 15.6691 6.66667 16.1111 6.66667C16.5531 6.66667 16.9771 6.84226 17.2896 7.15482C17.6022 7.46738 17.7778 7.89131 17.7778 8.33333C17.7778 8.77536 17.6022 9.19928 17.2896 9.51185C16.9771 9.82441 16.5531 10 16.1111 10ZM12.7778 5.55556C12.3358 5.55556 11.9118 5.37996 11.5993 5.0674C11.2867 4.75484 11.1111 4.33092 11.1111 3.88889C11.1111 3.44686 11.2867 3.02294 11.5993 2.71038C11.9118 2.39782 12.3358 2.22222 12.7778 2.22222C13.2198 2.22222 13.6437 2.39782 13.9563 2.71038C14.2689 3.02294 14.4444 3.44686 14.4444 3.88889C14.4444 4.33092 14.2689 4.75484 13.9563 5.0674C13.6437 5.37996 13.2198 5.55556 12.7778 5.55556ZM7.22222 5.55556C6.7802 5.55556 6.35627 5.37996 6.04371 5.0674C5.73115 4.75484 5.55556 4.33092 5.55556 3.88889C5.55556 3.44686 5.73115 3.02294 6.04371 2.71038C6.35627 2.39782 6.7802 2.22222 7.22222 2.22222C7.66425 2.22222 8.08817 2.39782 8.40073 2.71038C8.71329 3.02294 8.88889 3.44686 8.88889 3.88889C8.88889 4.33092 8.71329 4.75484 8.40073 5.0674C8.08817 5.37996 7.66425 5.55556 7.22222 5.55556ZM3.88889 10C3.44686 10 3.02294 9.82441 2.71038 9.51185C2.39782 9.19928 2.22222 8.77536 2.22222 8.33333C2.22222 7.89131 2.39782 7.46738 2.71038 7.15482C3.02294 6.84226 3.44686 6.66667 3.88889 6.66667C4.33092 6.66667 4.75484 6.84226 5.0674 7.15482C5.37996 7.46738 5.55556 7.89131 5.55556 8.33333C5.55556 8.77536 5.37996 9.19928 5.0674 9.51185C4.75484 9.82441 4.33092 10 3.88889 10ZM10 0C7.34784 0 4.8043 1.05357 2.92893 2.92893C1.05357 4.8043 0 7.34784 0 10C0 12.6522 1.05357 15.1957 2.92893 17.0711C4.8043 18.9464 7.34784 20 10 20C10.442 20 10.866 19.8244 11.1785 19.5118C11.4911 19.1993 11.6667 18.7754 11.6667 18.3333C11.6667 17.9 11.5 17.5111 11.2333 17.2222C10.9778 16.9222 10.8111 16.5333 10.8111 16.1111C10.8111 15.6691 10.9867 15.2452 11.2993 14.9326C11.6118 14.62 12.0358 14.4444 12.4778 14.4444H14.4444C15.9179 14.4444 17.3309 13.8591 18.3728 12.8173C19.4147 11.7754 20 10.3623 20 8.88889C20 3.97778 15.5222 0 10 0Z" /></svg>
                                <p className='peer-checked/published:text-[#000000] text-[#AAAAAA] text-[12px] font-[700] '>Dyed</p>
                            </div>
                            <div className='w-[50%]  mt-[15px] flex items-center gap-[6px]'>
                                <input name='blank'
                                    checked={inputValues.blank}
                                    onChange={handleOptionalChange} id='blank' type="checkbox" className="peer/published w-[18px] h-[18px] border border-gray-400 rounded-md bg-white checked:border-transparent checked:background-[#fffff] focus:outline-none focus:ring-1 focus:ring-offset-2 focus:ring-black" />
                                <svg width="20" height="20" className='peer-checked/published:fill-[#000000] fill-[#AAAAAA] '><path d="M10 0C4.47 0 0 4.47 0 10C0 15.53 4.47 20 10 20C15.53 20 20 15.53 20 10C20 4.47 15.53 0 10 0ZM10 18C5.59 18 2 14.41 2 10C2 5.59 5.59 2 10 2C14.41 2 18 5.59 18 10C18 14.41 14.41 18 10 18Z" /></svg>
                                <p className='peer-checked/published:text-[#000000] text-[#AAAAAA] text-[12px] font-[700] '>Blank</p>
                            </div>
                            <div className='w-[50%]  mt-[15px] flex items-center gap-[6px]'>
                                <input name='glow'
                                    checked={inputValues.glow}
                                    onChange={handleOptionalChange} id='glow' type="checkbox" className="peer/published w-[18px] h-[18px] border border-gray-400 rounded-md bg-white checked:border-transparent checked:background-[#fffff] focus:outline-none focus:ring-1 focus:ring-offset-2 focus:ring-black" />
                                <svg width="20" height="20" className='peer-checked/published:fill-[#000000] fill-[#AAAAAA] '><path d="M10 4.54545C11.4466 4.54545 12.834 5.12013 13.8569 6.14305C14.8799 7.16598 15.4545 8.55336 15.4545 10C15.4545 12.0182 14.3545 13.7818 12.7273 14.7273V16.3636C12.7273 16.6047 12.6315 16.836 12.461 17.0065C12.2905 17.177 12.0593 17.2727 11.8182 17.2727H8.18182C7.94071 17.2727 7.70948 17.177 7.53899 17.0065C7.36851 16.836 7.27273 16.6047 7.27273 16.3636V14.7273C5.64545 13.7818 4.54545 12.0182 4.54545 10C4.54545 8.55336 5.12013 7.16598 6.14305 6.14305C7.16598 5.12013 8.55336 4.54545 10 4.54545ZM11.8182 18.1818V19.0909C11.8182 19.332 11.7224 19.5632 11.5519 19.7337C11.3814 19.9042 11.1502 20 10.9091 20H9.09091C8.8498 20 8.61857 19.9042 8.44808 19.7337C8.2776 19.5632 8.18182 19.332 8.18182 19.0909V18.1818H11.8182ZM17.2727 9.09091H20V10.9091H17.2727V9.09091ZM0 9.09091H2.72727V10.9091H0V9.09091ZM10.9091 0V2.72727H9.09091V0H10.9091ZM3.56364 2.27273L5.5 4.21818L4.20909 5.5L2.27273 3.57273L3.56364 2.27273ZM14.5 4.20909L16.4273 2.27273L17.7273 3.57273L15.7909 5.5L14.5 4.20909Z" /></svg>
                                <p className='peer-checked/published:text-[#000000] text-[#AAAAAA] text-[12px] font-[700] '>Glow</p>
                            </div>
                            <div className='w-[50%]  mt-[15px] flex items-center gap-[6px]'>
                                <input name='collectible'
                                    checked={inputValues.collectible}
                                    onChange={handleOptionalChange} id='collectible' type="checkbox" className="peer/published w-[18px] h-[18px] border border-gray-400 rounded-md bg-white checked:border-transparent checked:background-[#fffff] focus:outline-none focus:ring-1 focus:ring-offset-2 focus:ring-black" />
                                <svg width="18" height="18" className='peer-checked/published:fill-[#000000] fill-[#AAAAAA] '><path d="M9 18L7.695 16.7052C3.06 12.1243 0 9.103 0 5.3951C0 2.37384 2.178 0 4.95 0C6.516 0 8.019 0.794551 9 2.05014C9.981 0.794551 11.484 0 13.05 0C15.822 0 18 2.37384 18 5.3951C18 9.103 14.94 12.1243 10.305 16.715L9 18Z" /></svg>
                                <p className='peer-checked/published:text-[#000000] text-[#AAAAAA] text-[12px] font-[700] '>Collectible</p>
                            </div>
                            <div className='w-[50%]  mt-[15px] flex items-center gap-[6px]'>
                                <input name='firstRun'
                                    checked={inputValues.firstRun}
                                    onChange={handleOptionalChange} id='firstRun' type="checkbox" className="peer/published w-[18px] h-[18px] border border-gray-400 rounded-md bg-white checked:border-transparent checked:background-[#fffff] focus:outline-none focus:ring-1 focus:ring-offset-2 focus:ring-black" />
                                <svg width="20" height="20" className='peer-checked/published:fill-[#000000] fill-[#AAAAAA] '><path d="M12.2222 15.5556H10V6.66667H7.77778V4.44444H12.2222M17.7778 0H2.22222C1.63285 0 1.06762 0.234126 0.650874 0.650874C0.234126 1.06762 0 1.63285 0 2.22222V17.7778C0 18.3671 0.234126 18.9324 0.650874 19.3491C1.06762 19.7659 1.63285 20 2.22222 20H17.7778C18.3671 20 18.9324 19.7659 19.3491 19.3491C19.7659 18.9324 20 18.3671 20 17.7778V2.22222C20 1.63285 19.7659 1.06762 19.3491 0.650874C18.9324 0.234126 18.3671 0 17.7778 0Z" /></svg>
                                <p className='peer-checked/published:text-[#000000] text-[#AAAAAA] text-[12px] font-[700] '>First Run</p>
                            </div>
                        </div>}
                    <div className='flex flex-wrap px-[0.8em]'>
                        <div className='w-[50%]  mt-[15px] flex items-center gap-[6px]'>
                            <input
                                id="auction"
                                name='priceType'
                                type="checkbox"
                                onChange={handleOptionalChange}
                                checked={inputValues.priceType === 'auction'}
                                className="peer/published w-[18px] h-[18px] border border-gray-400 rounded-md bg-white checked:border-transparent checked:background-[#fffff] focus:outline-none focus:ring-1 focus:ring-offset-2 focus:ring-black" />
                            <p className='peer-checked/published:text-[#000000] text-[#AAAAAA] text-[12px] font-[700] '>Auction</p>
                        </div>
                        <div className='w-[50%]  mt-[15px] flex items-center gap-[6px]'>
                            <input
                                id='fixedPrice'
                                name='priceType'
                                type="checkbox"
                                onChange={handleOptionalChange}
                                checked={inputValues.priceType === 'fixedPrice'}
                                className="peer/published w-[18px] h-[18px] border border-gray-400 rounded-md bg-white checked:border-transparent checked:background-[#fffff] focus:outline-none focus:ring-1 focus:ring-offset-2 focus:ring-black" />
                            <p className='peer-checked/published:text-[#000000] text-[#AAAAAA] text-[12px] font-[700] '>Fixed Price</p>
                        </div>
                    </div>
                    <div className='flex  items-start gap-[0px] px-[0.8em]'>
                        <div className='w-[50%] pr-[10px] mt-[15px] flex items-center '>
                            <input name='startingPrice'
                                value={inputValues.startingPrice}
                                onChange={handleOptionalChange} type="number" min={0} className='w-full text-[0.75em] h-[1.938em] placeholder:font-[700] pl-[7px] border-[1px] font-sans border-[#595959]  rounded-[2px] ' placeholder={`Starting Price (${countryInfo.currency})`} />
                        </div>
                        <div className='w-[50%]  justify-start mt-[15px] flex flex-col items-start '>
                            <input name='minPrice'
                                value={inputValues.minPrice}
                                onChange={handleOptionalChange} type="number" min={0} className='w-full text-[0.75em] placeholder:font-[700] pl-[7px] border-[1px] font-sans border-[#595959] h-[1.938em] rounded-[2px] ' placeholder={`Min Price (${countryInfo.currency})`} />
                            <p className='font-[400] text-[.6em] mt-[.2em] text-[#AAAAAA] text-left'>5 {countryInfo.currency} min price</p>
                        </div>
                    </div>
                    <div className='flex flex-wrap mx-[0.8em] mt-[10px] gap-[10px] w-full '>
                        <div className='flex items-center   font-[500] '>
                            <span className='mr-[5px] text-[.75em]'>End time :</span>
                            <input name='endDay'
                                value={inputValues.endDay}
                                onChange={handleOptionalChange} className='  text-[#595959bf]  xsm:h-[1.25em] sm:h-[1.25em] h-[1.75em]  text-[.75em] rounded-[2px] border-[1px] border-[#000000]' id="data" type="date" placeholder='sss' />
                        </div>
                        <label htmlFor="time" className='text-[.75em] xsm:h-[1.25em] sm:h-[1.25em] h-[1.75em]  font-[500]'>at<input name='endTime'
                            value={inputValues.endTime}
                            onChange={handleOptionalChange} className='min-w-[80px] xsm:h-[1.25em] sm:h-[1.25em] h-[1.75em]  ml-2  text-[#595959bf]  rounded-[2px] border-[1px] border-[#000000]' type="time" id="time" /></label>
                    </div>
                </div>

                <div className='flex justify-center  mb-[20px] gap-[8px]'>
                    <button onClick={handlePublish} className='w-[7.5em] h-[2.3125em] mt-[18px] text-[0.875rem] font-[600] bg-primary text-[#ffff] shadow-2xl rounded-[2px]' style={{ boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 6px 4px -1px rgba(0, 0, 0, 0.06)" }}>Update</button>
                    <button onClick={() => setModel(true)} className='w-[7.5em] h-[2.3125em] mt-[18px] text-[0.875rem] font-[600] bg-[#F21111] text-[#ffff] shadow-2xl rounded-[2px]' style={{ boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 6px 4px -1px rgba(0, 0, 0, 0.06)" }}>Remove</button>
                </div>

            </div>
            {model && <RemoveModel setModel={setModel} />}
        </div>
    )
}

export default EditList