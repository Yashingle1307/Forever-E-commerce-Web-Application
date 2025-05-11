import React, { useContext, useState, useEffect } from 'react'
import { ShopContext } from '../context/ShopContext'
import { assets } from '../assets/assets';
import Productitem from '../components/Productitem'
import Title from '../components/Title';


const Collections = () => {

    const { products,search,showSearch } = useContext(ShopContext);
    const [showFilter, setShowFilter] = useState(false);
    const [filterProducts, SetfilterProducts] = useState([]);

    const [category, Setcategory] = useState([]);
    const [subCategory, setsubCategory] = useState([]);

    const [sortType,setsortType]=useState('relevant');

    const toggleCategory = (e) => {
        if (category.includes(e.target.value)) {
            Setcategory(prev => prev.filter(item => item !== e.target.value));
        }
        else {
            Setcategory(prev => [...prev, e.target.value]);
        }
    }

    const toggleSubCategory=(e)=>
    {
        if (subCategory.includes(e.target.value)) {
            setsubCategory(prev => prev.filter(item => item !== e.target.value));
        }
        else {
            setsubCategory(prev => [...prev, e.target.value]);
        }

    }

    const applyFilter=()=>{
        let productsCopy=products.slice();

        if(showSearch && search)
        {
            productsCopy=productsCopy.filter(item=>item.name.toLowerCase().includes(search.toLowerCase()));
        }

        if(category.length>0)
        {
            productsCopy=productsCopy.filter(item=>category.includes(item.category));
        }

        if(subCategory.length>0)
        {
            productsCopy=productsCopy.filter(item=>subCategory.includes(item.subCategory));
        }
    
        SetfilterProducts(productsCopy);
    }

    const sortProducts=()=>{

        let fpCpy=filterProducts.slice();

        switch(sortType)
        {
            case "low-high":
                SetfilterProducts(fpCpy.sort((a,b)=>(a.price-b.price)));
                break;
            case "high-low":
                SetfilterProducts(fpCpy.sort((a,b)=>(b.price-a.price)));
                break;
            default:
                applyFilter();
                break;
        }
    
    }

    useEffect(()=>{
        applyFilter();
    },[category,subCategory,search,showSearch,products]);

    useEffect(()=>{
        sortProducts();
    },[sortType]);

    return (
        <div className="flex flex-col sm:flex-row sm:gap-10 pt-10 border-t">


            {/* filter options */}
            <div className="min-w-60">
                <p
                    onClick={() => setShowFilter(!showFilter)}
                    className="my-2 text-xl flex items-center cursor-pointer gap-2"
                >FILTERS <img className={`h-3 sm:hidden ${showFilter ? 'rotate-90' : ''}`} src={assets.dropdown_icon} alt="" /> </p>

                {/* category fliter */}
                <div className={`border border-gray-300 pl-5 py-3 mt-6 ${showFilter ? '' : 'hidden'} sm:block`}>
                    <p className='mb-3 text-sm font-medium'>CATEGORIES</p>
                    <div className='flex flex-col gap-2 text-sm font-light text-gray-700'>
                        <p className='flex gap-2'>
                            <input className='w-3' type='checkbox' value={'Men'} onChange={toggleCategory} /> Men
                        </p>
                        <p className='flex gap-2'>
                            <input className='w-3' type='checkbox' value={'Women'} onChange={toggleCategory} /> Women
                        </p>
                        <p className='flex gap-2'>
                            <input className='w-3' type='checkbox' value={'Kids'} onChange={toggleCategory} /> Kids
                        </p>
                    </div>
                </div>

                {/* subcategory fliter */}
                <div className={`border border-gray-300 pl-5 py-3 my-5 ${showFilter ? '' : 'hidden'} sm:block`}>
                    <p className='mb-3 text-sm font-medium'>TYPES</p>
                    <div className='flex flex-col gap-2 text-sm font-light text-gray-700'>
                        <p className='flex gap-2'>
                            <input className='w-3' type='checkbox' value={'Topwear'} onChange={toggleSubCategory} /> Topwear
                        </p>
                        <p className='flex gap-2'>
                            <input className='w-3' type='checkbox' value={'Bottomwear'} onChange={toggleSubCategory} /> Bottomwear
                        </p>
                        <p className='flex gap-2'>
                            <input className='w-3' type='checkbox' value={'Winterwear'} onChange={toggleSubCategory} /> Winterwear
                        </p>
                    </div>
                </div>
            </div>


            <div className='flex-1'>
                <div className='flex justify-between text-base sm:text-2xl mb-4'>
                    <Title text1={'ALL'} text2={'COLLECTIONS'} />

                    {/* {Product sort} */}
                    <select onChange={(e)=>setsortType(e.target.value)}  className='border-2 border-gray-300 text-sm px-2'>
                        <option value="relavant">Sort by relevant</option>
                        <option value="low-high">Sort by: low to high</option>
                        <option value="high-low">Sort by: High to low</option>
                    </select>
                </div>

                {/* {Map Products } */}
                <div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 gap-y-6'>
                    {filterProducts.map((item, index) => (
                        <Productitem key={index} name={item.name} id={item._id} price={item.price} image={item.image} />


                    ))}
                </div>
            </div>
        </div>
    )
}
export default Collections


