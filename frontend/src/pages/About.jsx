import React from 'react'
import Title from '../components/Title';
import { assets } from '../assets/assets';

import NewsLetterBox from  '../components/NewsLetterBox';

const About = () => {

    return(
        <div>

            <div className='text-2xl tex-center pt-8 border-t'>
                <Title text1={'ABOUT '} text2={'US'}  />
            </div>

            <div className='my-10 flex flex-col md:flex-row gap-16'>
                <img className='w-full md:max-w-[450px]'src={assets.about_img}  alt="" />
                <div className='flex flex-col justify-center gap-6 md:w-2/4 text-gray-600'>
                    <p>Lorem ipsum dolor sit amet consectetur, adipisicing elit. Iusto cum quod tempora officia consectetur mollitia tempore molestiae accusantium voluptatum reprehenderit eum assumenda esse aperiam praesentium iste officiis fugit, inventore dolore!</p>
                    <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Ab ipsam ut assumenda incidunt maiores animi voluptas esse? Illo nostrum id, optio aut aspernatur dicta eos animi deleniti, officiis maxime modi.</p>
                    <b className='text-gray-800'>Our Mission</b>
                    <p>Lorem ipsum dolor, sit amet consectetur adipisicing elit. Incidunt porro illum exercitationem totam! Facilis, ea. Hic amet sunt exercitationem doloremque consequatur neque totam impedit, adipisci sit vero, ab quibusdam odit?</p>
                </div>
            </div>

            <div className='text-xl py-4'>
                <Title text1={'WHY '} text2={'CHOOSE US'}/>
            </div>

            <div className='flex flex-col md:flex-row text-sm mb-20'>
                <div className='border px-10 md:px-16 sm:py-20 flex flex-col gap-5'>
                    <b>Quality Assurance: </b>
                    <p className='text-gray-600'>Lorem ipsum dolor sit amet consectetur adipisicing elit. Delectus incidunt labore nihil? Incidunt est repellat, dicta cupiditate ex ea maiores possimus, iure magnam corrupti cum. Magnam perferendis rerum harum pariatur!</p>
                </div>

                <div className='border px-10 md:px-16 sm:py-20 flex flex-col gap-5'>
                    <b>Convinience: </b>
                    <p className='text-gray-600'>Lorem ipsum dolor sit, amet consectetur adipisicing elit. Itaque quod facilis fugit repellendus laudantium, minus laborum quas perspiciatis libero commodi nulla dignissimos nisi suscipit iure enim odio a temporibus nesciunt?</p>
                </div>
    
                <div className='border px-10 md:px-16 sm:py-20 flex flex-col gap-5'>
                    <b>Exceptional Customer Service: </b>
                    <p className='text-gray-600'>Lorem ipsum dolor sit, amet consectetur adipisicing elit. Itaque quod facilis fugit repellendus laudantium, minus laborum quas perspiciatis libero commodi nulla dignissimos nisi suscipit iure enim odio a temporibus nesciunt?</p>
                </div>
            </div>

            <NewsLetterBox/>


        </div>
    )
}

export default About