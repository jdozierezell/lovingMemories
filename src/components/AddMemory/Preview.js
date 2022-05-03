import React, { useState, useEffect } from 'react'

import "antd/dist/antd.css";

import Header from "../Header/headerClose"

import { useForm } from "react-hook-form";
import { useStateMachine } from "little-state-machine";
import updateAction from "../../utils/updateAction";

import { handleAPIPostPublic, handleAPIFetch } from "../../utils/auth";

import { navigate } from "gatsby"


import { LoadingOutlined } from '@ant-design/icons';


import {AiOutlineShareAlt, AiOutlineRight, AiOutlineLeft} from 'react-icons/ai';
import {ImFacebook, ImTwitter, ImLinkedin2} from 'react-icons/im';
import { Spin, Menu, Dropdown, Card } from 'antd';
import { Swiper, SwiperSlide } from 'swiper/react';
import { useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
// Import Swiper styles
import 'swiper/css';
import "swiper/css/pagination";
import "swiper/css/navigation";
import "swiper/css/free-mode";
import "swiper/css/lazy";
import "./styles.css";

import SwiperCore, {
    Pagination,Navigation,FreeMode,Autoplay,Lazy
} from 'swiper';

SwiperCore.use([Pagination,Navigation,FreeMode,Autoplay,Lazy]);

gsap.registerPlugin(ScrollTrigger);



const PreviewMemory = () => {

    const { state, actions } = useStateMachine({ updateAction });
    const { register, handleSubmit, formState: {errors, isValid} } = useForm({
        mode:"onChange",
        defaultValues: state.data
    });

    const [loading, setLoading] = useState(false);
    const loadingIcon = <LoadingOutlined style={{ fontSize: 50 }} spin />;

    const [helpfulResources, setHelpfulResources] = useState([]);

    const [userName, setUserName] = useState("");
    const [description, setDescription] = useState("");
    const [description2, setDescription2] = useState("");
    const [loving, setLoving] = useState("");
    const [photos, setPhotos] = useState([]);
    const [favorites, setFavorites] = useState([]);
    const [verified_friends, setVerified_friends] = useState([]);
    const [special_dates, setSpecial_dates] = useState([]);

    const [imageUrl, setImageUrl] = useState("");
    const [bgTheme, setBgTheme] = useState("");
    const [bgThemeCol, setBgThemeCol] = useState("");
    const [bgThemeScrollCol, setBgThemeScrollCol] = useState("");
    const [bgThemeMobile, setBgThemeMobile] = useState("");
    const [bgThemeTemp, setBgThemeTemp] = useState("");

    const [txtTheme, setTxtTheme] = useState("");
    const [width, setWidth] = useState(window.innerWidth);
    const [txtBgColor, setTxtBgColor] = useState("");
    const [toolPanel, setToolPanel] = useState("");
    const [panelTotal, setPanelTotal] = useState("");
    const [panelCurrent, setPanelCurrent] = useState(1);
    const [offset, setOffset] = useState(0);
    const [imageCount, setImageCount] = useState("");
    const [descriptionWidth, setDescriptionWidth] = useState("");
    const[publicData, setPublicData] = useState();

    const [hasLoaded, setHasLoaded] = useState(true);
    let themeColorHex = '';
    const { Meta } = Card;
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

    //console.log(state.data);
    const handlePreviewSuccess = data => {


        let newData=data.memory[0];
        //console.log(newData);
        setUserName(newData.name);
        if (newData.descCustom.includes("{%@}")) {
            let descriptionSplit = newData.descCustom.split("{%@}", 2);
            setDescription(descriptionSplit[0]);
            setDescription2(descriptionSplit[1]);
        }
        else {
            setDescription(newData.description);
        }
        setLoving(newData.loving);
        setPhotos(newData.photos);
        setFavorites(newData.favorites);
        setSpecial_dates(newData.special_dates);

        let image_cover;

        if(typeof newData.cover_image === 'string') {
            console.log("i am string!");
            image_cover = newData.cover_image;
        }
        else {
            console.log("i am object!")
            image_cover = newData.cover_image[0].preview;
        }

        setImageUrl(image_cover);
        themeColorHex = newData.theme_color;
        setBgThemeCol(newData.theme_color);

        if(newData.theme_color === "white") {

            setBgThemeTemp('dark');
            setBgTheme("bg-white");
            setTxtTheme("text-black");
            setTxtBgColor("text-black");
            setBgThemeScrollCol("black");
            setBgThemeMobile("bg-slate-500-50");
        }
        else if (newData.theme_color === "pink") {
            setBgThemeTemp('light');
            setBgTheme("bg-" + newData.theme_color + "-500");
            setTxtTheme("text-" + newData.theme_color + "-500");
            setTxtBgColor("text-white");
            setBgThemeScrollCol("deeppink");
            setBgThemeMobile("bg-" + newData.theme_color + "-500-50");
        }
        else if (newData.theme_color === "yellow") {
            setBgThemeTemp('dark');
            setBgTheme("bg-" + newData.theme_color + "-500");
            setTxtTheme("text-" + newData.theme_color + "-500");
            setTxtBgColor("black");
            setBgThemeScrollCol("gold");
            setBgThemeMobile("bg-" + newData.theme_color + "-500-50");
        }
        else if (newData.theme_color === "green") {
            setBgThemeTemp('dark');
            setBgTheme("bg-" + newData.theme_color + "-500");
            setTxtTheme("text-" + newData.theme_color + "-500");
            setTxtBgColor("black");
            setBgThemeScrollCol("seagreen");
            setBgThemeMobile("bg-" + newData.theme_color + "-500-50");
        }
        else {
            setBgThemeTemp('light');
            setBgTheme("bg-" + newData.theme_color + "-500");
            setTxtTheme("text-" + newData.theme_color + "-500");
            setTxtBgColor("text-white");
            setBgThemeScrollCol(newData.theme_color);
            setBgThemeMobile("bg-" + newData.theme_color + "-500-50");
        }

        let bodyContainer = document.querySelector('body');
        bodyContainer.setAttribute('theme', newData.theme_color);
        setLoading(false);
        setHasLoaded(false);


    }

    const handlePreviewErrors = data => {
        console.log("error preview")
    }

    const panels = useRef([]);
    const panelsContainer = useRef();

    const createPanelsRefs = (panel, index) => {
        panels.current[index] = panel;
    };

    let progressBarStyle;
    if(window.innerWidth < 900) {
        progressBarStyle = {
            height: '4px',
            background: bgThemeScrollCol,
            width:   offset + '%'
        }
    }
    else {
        progressBarStyle = {
            height: offset + '%',
            background: bgThemeScrollCol,
            width: '4px'
        }
    }

    function handleWindowSizeChange() {
        setWidth(window.innerWidth);
    }
    function handleSlider(index) {
        if (index >= 2) {
            setToolPanel('active');
        }
        else if (index === 1)  {

            setToolPanel('normal');
        }
    }

    function debounce(fn, ms) {
        let timer
        return _ => {
            clearTimeout(timer)
            timer = setTimeout(_ => {
                timer = null
                fn.apply(this, arguments)
            }, ms)
        };
    }
    function handleSliderInit(length) {
        setLoading(false);
        setPanelTotal(length);
    }
    const isMobile = width <= 990;
    const sliderRef = useRef(null);

    useEffect(() => {


        window.addEventListener('resize', handleWindowSizeChange);
        setLoading(true);

        let type = window.location.hash.substr(1);
        setUserName(state.data.username);
        let image_cover;


        if(typeof state.data.cover_image === 'string') {
            image_cover = state.data.cover_image;
        }
        else if(typeof state.data.cover_image.photos != null){
            image_cover = state.data.cover_image.photos[0].image;
        }
        else {
            image_cover = state.data.cover_image;
            //image_cover = state.data.cover_image[0].preview;
        }

        if (state.data.description !== null) {
            if (state.data.description.includes("{%@}")) {
                let descriptionSplit = state.data.description.split("{%@}", 2);
                setDescription(descriptionSplit[0]);
                setDescription2(descriptionSplit[1]);
            }
            else {
                setDescription(state.data.description);
                if (state.data.description.length < 240) {
                    setDescriptionWidth('short')
                }
            }
        }
        setImageCount("image-length-" + state.data.photos.length);
        console.log(state.data.photos);
        setImageUrl(image_cover);

        themeColorHex = state.data.theme_color;
        setBgThemeCol(state.data.theme_color);

        if(state.data.theme_color === "white") {

            setBgThemeTemp('dark');
            setBgTheme("bg-white");
            setTxtTheme("text-black");
            setTxtBgColor("text-black");
            setBgThemeScrollCol("black");
            setBgThemeMobile("bg-slate-500-50");
        }
        else if (state.data.theme_color === "pink") {
            setBgThemeTemp('light');
            setBgTheme("bg-" + state.data.theme_color + "-500");
            setTxtTheme("text-" + state.data.theme_color + "-500");
            setTxtBgColor("text-white");
            setBgThemeScrollCol("deeppink");
            setBgThemeMobile("bg-" + state.data.theme_color + "-500-50");
        }
        else if (state.data.theme_color === "yellow") {
            setBgThemeTemp('dark');
            setBgTheme("bg-" + state.data.theme_color + "-500");
            setTxtTheme("text-" + state.data.theme_color + "-500");
            setTxtBgColor("black");
            setBgThemeScrollCol("gold");
            setBgThemeMobile("bg-" + state.data.theme_color + "-500-50");
        }
        else if (state.data.theme_color === "green") {
            setBgThemeTemp('dark');
            setBgTheme("bg-" + state.data.theme_color + "-500");
            setTxtTheme("text-" + state.data.theme_color + "-500");
            setTxtBgColor("black");
            setBgThemeScrollCol("seagreen");
            setBgThemeMobile("bg-" + state.data.theme_color + "-500-50");
        }
        else if (state.data.theme_color === "") {
            setBgThemeTemp('light');
            setBgTheme("bg-blue-500");
            setTxtTheme("text-blue-500");
            setTxtBgColor("text-white");
            setBgThemeScrollCol("blue");
            setBgThemeMobile("bg-blue-500-50");
        }
        else {
            setBgThemeTemp('light');
            setBgTheme("bg-" + state.data.theme_color + "-500");
            setTxtTheme("text-" + state.data.theme_color + "-500");
            setTxtBgColor("text-white");
            setBgThemeScrollCol(state.data.theme_color);
            setBgThemeMobile("bg-" + state.data.theme_color + "-500-50");
        }

        let bodyContainer = document.querySelector('body');
        bodyContainer.setAttribute('theme', state.data.theme_color);


        let onScroll;
        let scrollDist;

        setPanelCurrent(1);

        setTimeout(function () {
            ScrollTrigger.matchMedia({

                // desktop
                "(min-width: 991px)": function() {
                    // setup animations and ScrollTriggers for screens over 800px wide (desktop) here...
                    // ScrollTriggers will be reverted/killed when the media query doesn't match anymore.
                    let sections = document.querySelectorAll(".memory-panel");
                    let scrollContainer = document.querySelector(".memory-journey");

                    let scrollTween = gsap.to(sections, {
                        x: -(scrollContainer.scrollWidth - window.innerWidth),
                        ease: "none"
                    });
                    let horizontalScroll = ScrollTrigger.create({
                        animation: scrollTween,
                        trigger: scrollContainer,
                        pin: true,
                        preventOverlaps: true,
                        scrub: 0.6,
                        onUpdate: self => setOffset(self.progress * 110),
                        end: () => "+=" + scrollContainer.offsetWidth
                    });
                    ScrollTrigger.addEventListener("matchMedia", () => ScrollTrigger.update());
                    let position = horizontalScroll.scroll();
                    window.addEventListener('scroll', () => {
                        let activeClass = 'normal';
                        scrollDist = 600;
                        if (window.innerWidth < 900) {
                            scrollDist = 200;
                        } else {
                            scrollDist = 600;
                        }

                        if (window.scrollY > scrollDist) {
                            activeClass = 'active';
                        }

                        // //console.log(position);
                        setToolPanel(activeClass)
                    });
                    window.addEventListener('scroll', onScroll, {passive: true});
                },

                // mobile
                "(max-width: 990px)": function() {
                    // Any ScrollTriggers created inside these functions are segregated and get
                    // reverted/killed when the media query doesn't match anymore.

                },

                // all
                "all": function() {
                    // ScrollTriggers created here aren't associated with a particular media query,
                    // so they persist.
                }

            });
            setTimeout(function () {
                ScrollTrigger.refresh();
                setLoading(false);
            }, 1500);
        }, 1500);
        // check for resize, update scrolltrigger and clear scroll memory so no glitches occur
        const debouncedHandleResize = debounce(function handleResize() {
            setWidth(window.innerWidth);
            if (window.innerWidth < 990) {

            }
            else {
                setTimeout(function () {
                    //ScrollTrigger.refresh();
                    ScrollTrigger.clearScrollMemory();
                    ScrollTrigger.update();
                }, 1500);
            }

        }, 1000);
        window.addEventListener('resize', debouncedHandleResize);
        let details = {
            'access_token': type
        }
        return () => {
            ScrollTrigger.getAll().forEach(t => t.kill()); // no error but media query events still fire after unmount
            //ScrollTrigger.kill(); // error, resize mq events still fire on unmount
            window.removeEventListener('scroll', onScroll);
            window.removeEventListener('resize', handleWindowSizeChange);
            window.removeEventListener('resize', debouncedHandleResize);
            let bodyContainer = document.querySelector('body');
            bodyContainer.setAttribute('theme', 'blue');
        }

    }, []);

    return (
        <div>
            <Spin spinning={loading} indicator={loadingIcon}>

                <div className='relative memory-module ' theme={bgThemeCol}>
                    <div className={`memory-tools ${toolPanel} ${bgThemeTemp}`}>
                        {(state.data.prevFrom === 0) ? (<Header toLink={"/app/add-memory/in-memory-of"} title={"Preview"}/>) : (<Header toLink={"/app/your-memories"} title={"Preview"}/>)}
                        <div className="progress-bar" style={progressBarStyle}/>
                    </div>
                    <div className="preview-tag">Preview</div>
                    <div className="memory-holder" id="memoryHolder" ref={sliderRef}>
                        {(isMobile === false) ? (
                            <div className="memory-journey" id="memoryJourney" >
                                <section id="panel1" className={`memory-panel intro h-full w-full flex flex-col md:flex-row items-center pattern-bg ${bgTheme} `} >
                                    <div className={'split-50 pt-40 pb-10 md:pt-0 md:pb-0'}>
                                        <div className="text-white text-left px-5 md:px-36 mx-auto">
                                            <h1 className={`text-center xl:text-left leading-tight ${txtBgColor}`}>In loving
                                                memory of <br/> <span className="capitalize">{state.data.name.toLowerCase()}</span></h1>
                                            {(state.data.loving !== null) ? (
                                                <h2 className={`memory-of my-2 md:my-10 text-center xl:text-left ${txtBgColor}`}>A
                                                    loving {state.data.loving}</h2>
                                            ) : (
                                                <></>
                                            )}

                                        </div>
                                    </div>
                                    <div className={'split-50 h-full w-full'} style={{backgroundImage: 'url(' + imageUrl + ')', backgroundColor: '#ffffff5e', backdropFilter: 'hue-rotate(15deg)', backgroundSize: 'cover', backgroundPosition: 'top center'}}></div>

                                </section>
                                {(state.data.description !== null ) ? (
                                    <section id="panel2" className={`memory-panel description h-full w-full flex flex-col md:flex-row items-center ${descriptionWidth}`} >
                                        {(description2 !== '') ? (
                                            <div className='split-description flex flex-col md:flex-row'>
                                                <p className="my-10 text-center xl:text-left ">{description}</p>
                                                <p className="my-10 text-center xl:text-left ">{description2}</p>
                                            </div>
                                        ) : (
                                            <p className="my-10 text-center xl:text-left ">{state.data.description}</p>
                                        )}
                                    </section>
                                ) : (
                                    <></>
                                )}
                                {( state.data.photos.length >= 2 ) ? (
                                    <section id="panel3" className={`memory-panel image-holder h-full w-full vertical flex flex-col md:flex-row items-center scrollable ${imageCount}`} >
                                        {state.data.photos.map((value, index) => {
                                            if(index != 0){
                                                return (
                                                    <div key={index} className="memory-pic" style={{backgroundImage: 'url(' + state.data.photos[index].image + ')', backgroundColor: '#ffffff5e', backdropFilter: 'hue-rotate(15deg)', backgroundSize: 'cover', backgroundPosition: 'center center'}}>
                                                        {/*<img src={state.data.photos[index].image} alt="" className="z-10"/>*/}
                                                    </div>
                                                )
                                            }
                                        })}
                                    </section>
                                ) : (
                                    <></>
                                )}


                                {(state.data.favorites.length <= 0) ? (

                                    <></>
                                ) : (
                                    <section id="panel4" className={`memory-panel h-full w-full flex flex-col md:flex-row items-center pattern-bg ${bgTheme} `} style={{touchAction: 'pan-y'}} >
                                        <div className={'split-40 pt-40 pb-10 md:pt-0 md:pb-0'}>
                                            <div className="text-white text-left px-5 md:px-36 mx-auto">
                                                <h1 className={`font-bold text-center xl:text-left leading-tight ${txtBgColor}`}>You gave us memories we’ll never forget</h1>
                                            </div>
                                        </div>
                                        <div className={'split-60'}>
                                            <Swiper
                                                freeMode={true}

                                                pagination={{
                                                    "dynamicBullets": true
                                                }}
                                                navigation={false}
                                                pagination={{clickable: true}}
                                                autoplay={{
                                                    "delay": 10000,
                                                    "disableOnInteraction": false
                                                }}
                                                spaceBetween={0}
                                                breakpoints={{
                                                    640: {
                                                        slidesPerView: 1,
                                                        slidesPerGroup: 1
                                                    },
                                                    768: {

                                                        slidesPerView: 1,
                                                        slidesPerGroup: 1
                                                    },
                                                    1024: {

                                                        slidesPerView: 1,
                                                        slidesPerGroup: 1
                                                    },
                                                }}

                                            >

                                                {state.data.favorites.map((value, favorites_index) => {
                                                    return (
                                                        <div key={favorites_index}>

                                                            <SwiperSlide key={favorites_index + 300}>
                                                                <div
                                                                    className="swiper-lazy-preloader swiper-lazy-preloader-black z-0"></div>
                                                                <p>
                                                                    {state.data.favorites[favorites_index].name}
                                                                </p>
                                                                <img src={state.data.favorites[favorites_index].image} alt=""
                                                                     className="swiper-lazy z-10"/>
                                                            </SwiperSlide>

                                                        </div>
                                                    )
                                                })}

                                            </Swiper>
                                        </div>
                                    </section>
                                )}

                                <section id="panel5" className={`memory-panel outro h-full w-full flex flex-col md:flex-row items-center pattern-bg ${bgTheme} `} >
                                    <div className={'w-full'}>
                                        <div
                                            className="text-white text-left px-10 pl-24 pt-24 pb-10 md:pt-0 md:pb-0 md:pl-40 md:px-36  mx-auto">
                                            <div className="profile-poster"
                                                 style={{backgroundImage: 'url(' + imageUrl + ')', backgroundColor: '#ffffff5e', backdropFilter: 'hue-rotate(15deg)', backgroundSize: 'cover', backgroundPosition: 'top center' }}>
                                            </div>
                                            <h1 className={`text-center leading-tight capitalize ${txtBgColor}`}>You will always be
                                                loved<br/> <span className="capitalize">{state.data.name.toLowerCase()}</span></h1>
                                        </div>
                                    </div>
                                </section>
                            </div>
                        ) : (
                            <div className="memory-journey" id="memoryJourney" >
                                <Swiper
                                    freeMode={false}
                                    pagination={false}
                                    navigation={{
                                        nextEl: '.swiper-button-next',
                                        prevEl: '.swiper-button-prev',
                                    }}
                                    spaceBetween={0}
                                    onSlideChange={(index) => setPanelCurrent(index.activeIndex + 1)}
                                    onAfterInit={(swiper) => setTimeout(function () {handleSliderInit(swiper.slides.length)}, 3000)}
                                    onActiveIndexChange={(swiper) => handleSlider(swiper.activeIndex + 1)}
                                    breakpoints= {{
                                        640: {

                                            slidesPerView: 1,
                                            slidesPerGroup:1
                                        },
                                        990: {

                                            slidesPerView: 1,
                                            slidesPerGroup:1
                                        }
                                    }}
                                >
                                    <SwiperSlide>

                                        <section id="panel1"
                                                 className={`memory-panel intro h-full w-full flex flex-col items-center pattern-bg ${bgTheme} `}
                                                 ref={(e) => createPanelsRefs(e, 0)}>
                                            <div className={'split-50 pt-40 pb-10 md:pt-0 '}>
                                                <div className="text-white text-left px-20 md:px-32">
                                                    <h1 className={`font-bold text-left leading-tight ${txtBgColor}`}>In
                                                        loving memory of <br/> <span className="capitalize">{state.data.name.toLowerCase()}</span></h1>

                                                    {(state.data.loving !== null) ? (
                                                        <p className={`my-2 text-left ${txtBgColor}`}>A
                                                            loving {state.data.loving}</p>
                                                    ) : (
                                                        <></>
                                                    )}

                                                </div>
                                            </div>
                                            <div className={'split-50'} style={{backgroundImage: 'url(' + imageUrl + ')', backgroundColor: '#ffffff5e', backdropFilter: 'hue-rotate(15deg)', backgroundSize: 'cover', backgroundPosition: 'top center'}}></div>

                                        </section>

                                    </SwiperSlide>
                                    {(state.data.description !== "" ) ? (
                                        <SwiperSlide>

                                            <section id="panel2" className="memory-panel description h-full w-full flex flex-col items-center" ref={(e) => createPanelsRefs(e, 1)}>
                                                {(description2 !== '') ? (
                                                    <div className='split-description flex flex-col'>
                                                        <p className="my-3 text-left ">{description}</p>
                                                        <p className="my-3 text-left ">{description2}</p>
                                                    </div>
                                                ) : (
                                                    <p className="my-3 text-left">{description}</p>
                                                )}
                                            </section>

                                        </SwiperSlide>
                                    ) : (
                                        <></>
                                    )}

                                    {( state.data.photos.length >= 1 ) ? (
                                        <SwiperSlide >
                                            <section id="panel3"
                                                     className={`memory-panel h-full w-full flex flex-col items-center scrollable ${bgTheme} ${imageCount}`}
                                                     ref={(e) => createPanelsRefs(e, 2)}>
                                                {state.data.photos.map((value, index) => {
                                                    return (
                                                        <div key={index} className="memory-pic">
                                                            <img src={state.data.photos[index].image} alt="" className="z-10"/>
                                                        </div>
                                                    )
                                                })}
                                            </section>
                                        </SwiperSlide>
                                    ) : (
                                        <></>
                                    )}

                                    {(favorites.length <= 0) ? (

                                        <></>
                                    ) : (
                                        <SwiperSlide>

                                            <section id="panel4"
                                                     className={`memory-panel h-full w-full flex flex-col items-center pattern-bg ${bgTheme} `}
                                                     ref={(e) => createPanelsRefs(e, 3)}>
                                                <div className={'split-40 pt-0 pb-0 md:pt-0 '}>
                                                    <div className="text-white text-left px-20 md:px-32 ">
                                                        <h1 className={`font-bold text-left leading-tight ${txtBgColor}`}>You
                                                            gave us memories we’ll never forget</h1>
                                                    </div>
                                                </div>
                                            </section>

                                        </SwiperSlide>
                                    )}
                                    {(favorites.length <= 0) ? (

                                        <></>
                                    ) : (
                                        <SwiperSlide>

                                            <section id="panel5" className={`memory-panel h-full w-full flex flex-col items-center  `} ref={(e) => createPanelsRefs(e, 4)}>
                                                <div className={'split-60 h-full w-full'}>
                                                    <Swiper
                                                        freeMode={true}

                                                        pagination={{
                                                            "dynamicBullets": true
                                                        }}
                                                        navigation={false}
                                                        pagination={{clickable: true}}
                                                        autoplay={{
                                                            "delay": 10000,
                                                            "disableOnInteraction": false
                                                        }}
                                                        spaceBetween={0}
                                                        breakpoints={{
                                                            640: {
                                                                slidesPerView: 1,
                                                                slidesPerGroup: 1
                                                            },
                                                            768: {

                                                                slidesPerView: 1,
                                                                slidesPerGroup: 1
                                                            },
                                                            1024: {

                                                                slidesPerView: 1,
                                                                slidesPerGroup: 1
                                                            },
                                                        }}

                                                    >

                                                        {state.data.favorites.map((value, favorites_index) => {
                                                            return (
                                                                <div key={favorites_index}>

                                                                    <SwiperSlide key={favorites_index + 300}>
                                                                        <div
                                                                            className="swiper-lazy-preloader swiper-lazy-preloader-black z-0"></div>
                                                                        <p>
                                                                            {state.data.favorites[favorites_index].name}
                                                                        </p>
                                                                        <img src={state.data.favorites[favorites_index].image} alt=""
                                                                             className="swiper-lazy z-10"/>
                                                                    </SwiperSlide>

                                                                </div>
                                                            )
                                                        })}

                                                    </Swiper>
                                                </div>
                                            </section>

                                        </SwiperSlide>
                                    )}

                                    <SwiperSlide>
                                        <section id="panel6"
                                                 className={`memory-panel h-full w-full flex flex-col items-center justify-center pattern-bg ${bgTheme} `}
                                                 ref={(e) => createPanelsRefs(e, 5)}>
                                            <div className={'split-50'}>
                                                <div className="text-white text-left px-5 pt-3 md:px-10  pb-0 mx-auto">
                                                    <div className="profile-poster"
                                                         style={{backgroundImage: 'url(' + imageUrl + ')', backgroundColor: '#ffffff5e', backdropFilter: 'hue-rotate(15deg)', backgroundSize: 'cover', backgroundPosition: 'top center' }}>
                                                    </div>
                                                    <h1 className={`text-center leading-tight  ${txtBgColor}`}>You will always be
                                                        loved<br/> <span className="capitalize">{state.data.name.toLowerCase()}</span> </h1>
                                                </div>
                                            </div>
                                        </section>
                                    </SwiperSlide>
                                    <div className={`mobile-footer ${bgThemeMobile}`}>
                                        <span className="swiper-button-next"> <AiOutlineLeft size={30} /></span>
                                        <p><span>{panelCurrent}</span> / <span>{panelTotal}</span></p>
                                        <span className="swiper-button-prev"><AiOutlineRight size={30} /></span>
                                    </div>
                                </Swiper>

                            </div>
                        )}
                    </div>


                </div>

            </Spin>
        </div>

    )
}

export default PreviewMemory
