import React, { useState, useEffect } from 'react'

import Header from "../Header/headerClose"
import SideComponent from "../AddMemory/memory-side"

import "antd/dist/antd.css";

import { useForm } from "react-hook-form";
import { useStateMachine } from "little-state-machine";
import updateAction from "../../utils/updateAction";

import { handleAPIPost } from "../../utils/auth";

import { navigate } from "gatsby"

import { Spin } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';

import { Swiper, SwiperSlide } from 'swiper/react';

import { AiOutlineShareAlt } from 'react-icons/ai';

import {ImFacebook, ImTwitter, ImLinkedin2} from 'react-icons/im'

import { Menu, Dropdown } from 'antd';



// Import Swiper styles
import 'swiper/css';
import "swiper/css/pagination";
import "swiper/css/navigation";

import "./styles.css";

import SwiperCore, {
  Pagination,Navigation
} from 'swiper';

SwiperCore.use([Pagination,Navigation]);

const Preview = props => {

    const { state, actions } = useStateMachine({ updateAction });
    const { register, handleSubmit, formState: {errors, isValid} } = useForm({
        mode:"onChange",
        defaultValues: state.data
    });

    const [loading, setLoading] = useState(false);
    const loadingIcon = <LoadingOutlined style={{ fontSize: 50 }} spin />;

    const [userName, setUserName] = useState("");
    const [imageUrl, setImageUrl] = useState("");
    const [bgTheme, setBgTheme] = useState("");
    const [txtTheme, setTxtTheme] = useState("");

    const [txtBgColor, setTxtBgColor] = useState("");

    const menu = (
    <Menu className="prevMenu">
        <Menu.Item className="text-black hover:text-blue-500">
            <div className="bg-white rounded-full p-4 cursor-pointer shadow-md z-10">
                <ImLinkedin2 />
            </div>
        </Menu.Item>
        <Menu.Item className="text-black hover:text-blue-500">
            <div className="bg-white  rounded-full p-4 cursor-pointer shadow-md z-10">
                <ImTwitter />
            </div>
        </Menu.Item>
        <Menu.Item className="text-black hover:text-blue-500">
       
            <div className="bg-white text-black hover:text-blue-500 rounded-full p-4 cursor-pointer shadow-md z-10">
                <ImFacebook />
            </div>
        
        </Menu.Item>
        
    </Menu>
    );


     useEffect(() => {
    
        setUserName(state.data.username)

        let image_cover;

        
        if(typeof state.data.cover_image === 'string') {
            //alert("i am string!");
            image_cover = state.data.cover_image;
        }
        else {
            //alert("i am object!")
            image_cover = state.data.cover_image;
            //image_cover = state.data.cover_image[0].preview;
        }

        setImageUrl(image_cover);

        if(state.data.theme_color === "white") {
          
            setBgTheme("bg-white");
            setTxtTheme("text-black");
            setTxtBgColor("text-black");
        }
        else {
            setBgTheme("bg-"+state.data.theme_color+"-500");
            setTxtTheme("text-"+state.data.theme_color+"-500");
            setTxtBgColor("text-white");
        }

    }, []);



    return (
        <div>
            <Spin spinning={loading} indicator={loadingIcon}>

                {(state.data.prevFrom === 0) ? (<Header toLink={"/app/add-memory/in-memory-of"} title={"Preview"}/>) : (<Header toLink={"/app/your-memories"} title={"Preview"}/>)}                
                
                <section className="grid grid-cols-1">
                    <div>
                       <Swiper
                        pagination={{"type": "fraction"}}
                        navigation={true}
                        spaceBetween={0}                       
                        onSlideChange={() => //console.log('slide change')}
                        onSwiper={(swiper) => //console.log(swiper)}
                        breakpoints= {{
                            640: {                                
                              
                                slidesPerView: 1,
                                slidesPerGroup:1
                            },
                            768: {
                                
                                slidesPerView: 1,
                                slidesPerGroup:1
                            },
                            1024: {
                                
                                slidesPerView: 2,
                                slidesPerGroup:2
                            },
                        }}
                       
                        >

                            

                        <SwiperSlide>

                            <div className={`absolute top-0 left-0 h-full w-full flex items-center ${bgTheme} `}>

                            <div className="text-white text-left px-20 md:px-40 mx-auto">
                                <h1 className={`font-bold text-center xl:text-left leading-tight text-3xl xl:text-4xl ${txtBgColor}`}>In loving memory of <br/> {state.data.name}</h1>                                
                                <p className={`my-10 text-center xl:text-left ${txtBgColor}`}>A loving  {state.data.loving}</p>
                            </div>

                            </div>
                            
                        </SwiperSlide>

                        <SwiperSlide>

                            <img src={imageUrl} alt="" />    
                            
                        </SwiperSlide>

                        {state.data.photos.map((value,index) => {                                                              
                            return (
                            <div key={index}>
                               
                               
                                
                                 <SwiperSlide  key={index+100}>
                                     <div className="absolute w-full h-full bg-white flex items-center">
                                         <div className="px-20 md:px-40 mx-auto">
                                            <h1 className={`font-bold text-center xl:text-left leading-tight text-3xl xl:text-4xl ${txtTheme}`}>
                                                Photos of                                                <br />
                                                {state.data.name}
                                            </h1>                                            
                                         </div>                                        
                                     </div>
                                     
                                 </SwiperSlide>
                                 <SwiperSlide key={index+200}>
                                    <img src={state.data.photos[index].image} alt="" />     
                                </SwiperSlide>
                               
                            </div>
                            )
                        })} 

                        {state.data.favorites.map((value,index) => {                                                              
                            return (
                            <div key={index}>
                               
                                <SwiperSlide key={index+300}>
                                    <img src={state.data.favorites[index].image} alt="" />     
                                </SwiperSlide>
                                 <SwiperSlide key={index+400}>
                                     <div className="absolute w-full h-full bg-white flex items-center">
                                         <div>
                                            <p className="px-20 md:px-40 text-center xl:text-left">
                                                 {state.data.favorites[index].name}
                                            </p>
                                         </div>                                        
                                     </div>
                                     
                                 </SwiperSlide>
                               
                            </div>
                            )
                        })} 

                        {state.data.special_dates.map((value,index) => {                                                              
                            return (
                            <div key={index}>
                               
                                <SwiperSlide key={index+500}>
                                    <div className={`w-full h-full flex items-center justify-center ${bgTheme}`}>
                                        <h1 className="font-bold text-center xl:text-left leading-tight text-3xl xl:text-4xl text-white">
                                                 {state.data.special_dates[index].date}
                                        </h1>
                                    </div>
                                    
                                </SwiperSlide>
                                 <SwiperSlide key={index+600}>
                                     <div className="absolute w-full h-full bg-white flex items-center">
                                         <div>
                                            <p className="px-20 md:px-40 text-center xl:text-left">
                                                 {state.data.special_dates[index].name}
                                            </p>
                                         </div>                                        
                                     </div>
                                     
                                 </SwiperSlide>
                               
                            </div>
                            )
                        })} 

                        

                        <SwiperSlide>

                            <div className={`absolute top-0 left-0 h-full w-full flex items-center ${bgTheme}`}>

                                <div className="text-left px-20 md:px-40 mx-auto">
                                    <h1 className={`font-bold text-center xl:text-left leading-tight text-3xl xl:text-4xl ${txtBgColor}`}>You gave us memories we will never forget {state.data.name}</h1>                                
                                </div>

                            </div>
                            
                        </SwiperSlide>

                        <SwiperSlide>

                            <div className="bg-white absolute top-0 left-0 h-full w-full flex items-center">

                                <div className="absolute w-full h-full flex items-center justify-center">
                                    <div className="inline-block rounded-full bg-gray-100">
                                        <img className="max-w-xs rounded-full shadow-md" src={imageUrl} alt="" />
                                    </div>
                                </div>

                            </div>
                            
                        </SwiperSlide>
                        
                        </Swiper>
                    </div>
                    
                </section>


            <div className="fixed bottom-0 left-0 z-20 p-6" style={{left:'10px'}}>

                <Dropdown overlay={menu} placement="bottomRight">
                    <a className="ant-dropdown-link" onClick={e => e.preventDefault()}>
                        <div className="bg-white text-black rounded-full p-4 cursor-pointer shadow-md z-10">
                         <AiOutlineShareAlt />
                        </div>
                    </a>
                </Dropdown>,
                
               {/*  <div className="bg-white rounded-full p-4 cursor-pointer shadow-md z-10">
                    <AiOutlineShareAlt />
                </div> */}

            </div>
                
            </Spin>            
        </div>
    )
}

export default Preview
