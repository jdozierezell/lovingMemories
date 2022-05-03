import React, {useState, useEffect} from 'react'

import "antd/dist/antd.css";

import Header from "../components/Header/headerClose"

import {useForm} from "react-hook-form";
import {useStateMachine} from "little-state-machine";
import updateAction from "../utils/updateAction";
import clearAction from "../utils/updateAction";

import {handleAPIPostPublic, handleAPIFetch} from "../utils/auth";

import {navigate} from "gatsby"

import {LoadingOutlined} from '@ant-design/icons';


import {AiOutlineShareAlt, AiOutlineRight, AiOutlineLeft} from 'react-icons/ai';
import {ImFacebook, ImTwitter, ImLinkedin2} from 'react-icons/im';
import {Spin, Menu, Dropdown, Card} from 'antd';
import {Swiper, SwiperSlide} from 'swiper/react';
import {useRef} from "react";
import {gsap} from "gsap";
import {Draggable} from "gsap/Draggable";
import {ScrollTrigger} from "gsap/ScrollTrigger";


// Import Swiper styles
import 'swiper/css';
import "swiper/css/pagination";
import "swiper/css/navigation";
import "swiper/css/free-mode";
import "swiper/css/lazy";
import "./AddMemory/styles.css";

import SwiperCore, {
    Pagination, Navigation, FreeMode, Autoplay, Lazy
} from 'swiper';
import {StaticImage} from "gatsby-plugin-image";
import Seo from "./seo";

import LogoPlaceholder from './LogoPlaceholder';

SwiperCore.use([Pagination, Navigation, FreeMode, Autoplay, Lazy]);

const PreviewMemory = () => {
    gsap.registerPlugin(Draggable);
    gsap.registerPlugin(ScrollTrigger);
    const {state, actions} = useStateMachine({clearAction, updateAction});
    const {register, handleSubmit, formState: {errors, isValid}} = useForm({
        mode: "onChange",
        isDesktop: false,
        defaultValues: state.data
    });

    const [loading, setLoading] = useState(false);
    const loadingIcon = <LoadingOutlined style={{fontSize: 50}} spin/>;

    const [helpfulResources, setHelpfulResources] = useState([]);

    const [userName, setUserName] = useState("");
    const [description, setDescription] = useState("");
    const [description2, setDescription2] = useState("");
    const [loving, setLoving] = useState("");
    const [photos, setPhotos] = useState([]);
    const [favorites, setFavorites] = useState([]);
    const [friend_favorites, setFriend_Favorites] = useState([]);
    const [special_dates, setSpecial_dates] = useState([]);
    const [verified_friends, setVerified_friends] = useState([]);
    const [imageUrl, setImageUrl] = useState("");
    const [bgTheme, setBgTheme] = useState("");
    const [bgThemeCol, setBgThemeCol] = useState("");
    const [bgThemeScrollCol, setBgThemeScrollCol] = useState("");
    const [bgThemeMobile, setBgThemeMobile] = useState("");
    const [bgThemeTemp, setBgThemeTemp] = useState("");
    const [txtTheme, setTxtTheme] = useState("");

    const [txtBgColor, setTxtBgColor] = useState("");
    const [toolPanel, setToolPanel] = useState("");
    const [panelTotal, setPanelTotal] = useState("");
    const [panelCurrent, setPanelCurrent] = useState(1);

    const [publicData, setPublicData] = useState();
    const [offset, setOffset] = useState(0);

    const [hasLoaded, setHasLoaded] = useState(true);
    const [width, setWidth] = useState(window.innerWidth);

    const [postTitle, setPostTitle] = useState("");
    const [postImage, setPostImage] = useState("");
    const [postDescription, setPostDescription] = useState("");
    const [siteUrl, setUrl] = useState("");

    let themeColorHex = '';
    const {Meta} = Card;
    const menu = (
        <Menu className="prevMenu share-menu-list">
            <Menu.Item className="text-black hover:text-blue-500">
                <div onClick={() => { setShare("twitter")}} className="bg-white  rounded-full p-4 cursor-pointer shadow-md z-10" >
                    <ImTwitter/>
                </div>
            </Menu.Item>
            <Menu.Item className="text-black hover:text-blue-500">
                <div onClick={() => { setShare("facebook")}} className="bg-white text-black hover:text-blue-500 rounded-full p-4 cursor-pointer shadow-md z-10" >
                    <ImFacebook/>
                </div>
            </Menu.Item>
        </Menu>
    );

    let panels = useRef([]);
    let panelsContainer = useRef();
    let memoryContainer = document.getElementById('memoryHolder');
    const createPanelsRefs = (panel, index) => {
        panels.current[index] = panel;
    }

    const handlePreviewSuccess = data => {


        let newData = data.memory[0];

        if (newData.descCustom.includes("{%@}")) {
            let descriptionSplit = newData.descCustom.split("{%@}", 2);
            setDescription(descriptionSplit[0]);
            setDescription2(descriptionSplit[1]);
        }
        else {
            setDescription(newData.description);
        }
        setUserName(newData.name);
        setLoving(newData.loving);
        setPhotos(newData.photos);
        setFavorites(newData.favorites);
        setSpecial_dates(newData.special_dates);
        setFriend_Favorites(newData.friend_favorites);
        setVerified_friends(newData.verified_friends);

        setPostTitle("In memory of " + newData.name);
        setPostDescription(newData.description.substring(0, 90) + "...");

        let image_cover;

        if (typeof newData.cover_image === 'string') {
            //alert("i am string!");
            image_cover = newData.cover_image;
            setPostImage(newData.thumbnail);
        } else {
            //alert("i am object!")
            image_cover = newData.cover_image[0].preview;
            setPostImage(newData.thumbnail);
        }

        setImageUrl(image_cover);
        themeColorHex = newData.theme_color;
        setBgThemeCol(newData.theme_color);


        if (newData.theme_color === "white") {
            setBgThemeTemp('dark');
            setBgTheme("bg-gray-200");
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
        else if (newData.theme_color === "") {
            setBgThemeTemp('light');
            setBgTheme("bg-blue-500");
            setTxtTheme("text-blue-500");
            setTxtBgColor("text-white");
            setBgThemeScrollCol("blue");
            setBgThemeMobile("bg-blue-500-50");
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
        alert("error")
    }

    const handleResourceSuccess = data => {
        //setLoading(false);
        setHelpfulResources(data.helpful_resources);
    }

    const handleResourceErrors = data => {
        alert("error");
        setLoading(false);
    }
    let progressBarStyle;
    if (window.innerWidth < 990) {
        progressBarStyle = {
            height: '4px',
            background: bgThemeScrollCol,
            width: offset + '%'
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

        setPanelTotal(length);
        setLoading(false);
    }
    function setShare(type) {

        let sitelink = 'https://loving-memories.netlify.app/';
        let siteRedirect = 'https://facebook.com';

        const pos = {
            x: (window.innerWidth / 2) - (600 / 2),
            y: (window.innerHeight/2) - (300 / 2)
        };

        switch (type) {
            case "facebook":

                const faceFeatures = `width=600, height=300, left=${pos.x}, top=${pos.y}`;
                let app = "337800388276409";
                let shareFB = 'https://www.facebook.com/dialog/share?app_id=' + app + '&display=popup&picture=' + postImage +'&quote=' + postDescription + '&href=' + sitelink +'&redirect_uri=' + siteRedirect;
                window.open(shareFB, "_blank",faceFeatures);
                break;
            case "twitter":

                const tweetFeatures = `width=600, height=300, left=${pos.x}, top=${pos.y}`;
                let hashtags = '&hashtags=InMemoryOf'
                let shareTT = 'https://twitter.com/intent/tweet?text=' + postDescription;
                let link = '&url=' + sitelink;
                let tweetURL = shareTT + hashtags + link;
                window.open(tweetURL, "_blank",tweetFeatures);
                break;
            case "linkedin":

                const linkedinFeatures = `width=600, height=300, left=${pos.x}, top=${pos.y}`;

                let shareLi = 'https://www.linkedin.com/shareArticle?mini=true';
                let shareLiTxt = '&title=AFSP&summary=' + postDescription + '&source=web';
                let linkUrl = '&url=' + sitelink;
                let linkedURL = shareLi + linkUrl + shareLiTxt;
                window.open(linkedURL, "_blank",linkedinFeatures);
                break;
        }
    }
    const isMobile = width <= 990;
    const sliderRef = useRef(null);

    useEffect(() => {
        setLoading(false);


        window.addEventListener('resize', handleWindowSizeChange);
        setLoading(true);
        let type = window.location.hash.substr(1);
        let search = window.location.search;
        let params = new URLSearchParams(search);
        let admin = params.get('admin');


        let details = {
            'access_token': type
        }
        let apiMethod = 'memory/info';
        if (admin == 1) {
            apiMethod = 'memory/admin/preview'
        }
        handleAPIPostPublic(apiMethod, details, handlePreviewSuccess, handlePreviewErrors);
        handleAPIFetch('helpful-resources', handleResourceSuccess, handleResourceErrors);

        let onScroll;
        let scrollDist;

        setPanelCurrent(1);

        const horizontalSections = gsap.utils.toArray('section.horizontal')

        horizontalSections.forEach(function (sec, i) {

            var thisPinWrap = sec.querySelector('.pin-wrap');
            var thisAnimWrap = thisPinWrap.querySelector('.animation-wrap');

            var getToValue = () => -(thisAnimWrap.scrollWidth - window.innerWidth);

            gsap.fromTo(thisAnimWrap, {
                x: () => thisAnimWrap.classList.contains('to-right') ? 0 : getToValue()
            }, {
                x: () => thisAnimWrap.classList.contains('to-right') ? getToValue() : 0,
                ease: "none",
                scrollTrigger: {
                    trigger: sec,
                    start: "top top",
                    end: () => "+=" + (thisAnimWrap.scrollWidth - window.innerWidth),
                    pin: thisPinWrap,
                    invalidateOnRefresh: true,
                    //anticipatePin: 1,
                    scrub: true,
                    //markers: true,
                }
            });

        });

        // setTimeout(function () {
        //     ScrollTrigger.matchMedia({
        //
        //         // desktop
        //         "(min-width: 991px)": function() {
        //             // setup animations and ScrollTriggers for screens over 800px wide (desktop) here...
        //             // ScrollTriggers will be reverted/killed when the media query doesn't match anymore.
        //             let sections = document.querySelectorAll(".memory-panel");
        //             let scrollContainer = document.querySelector(".memory-journey");
        //
        //             let scrollTween = gsap.to(sections, {
        //                 x: -(scrollContainer.scrollWidth - window.innerWidth),
        //                 ease: "none"
        //             });
        //             let horizontalScroll = ScrollTrigger.create({
        //                 animation: scrollTween,
        //                 trigger: scrollContainer,
        //                 pin: true,
        //                 preventOverlaps: true,
        //                 scrub: 0.6,
        //                 onUpdate: self => setOffset(self.progress * 110),
        //                 end: () => "+=" + scrollContainer.offsetWidth
        //             });
        //             ScrollTrigger.addEventListener("matchMedia", () => ScrollTrigger.update());
        //             let position = horizontalScroll.scroll();
        //             window.addEventListener('scroll', () => {
        //                 let activeClass = 'normal';
        //                 scrollDist = 600;
        //                 if (window.innerWidth < 900) {
        //                     scrollDist = 200;
        //                 } else {
        //                     scrollDist = 600;
        //                 }
        //
        //                 if (window.scrollY > scrollDist) {
        //                     activeClass = 'active';
        //                 }
        //
        //                 // //console.log(position);
        //                 setToolPanel(activeClass)
        //             });
        //             window.addEventListener('scroll', onScroll, {passive: true});
        //         },
        //
        //         // mobile
        //         "(max-width: 990px)": function() {
        //             // Any ScrollTriggers created inside these functions are segregated and get
        //             // reverted/killed when the media query doesn't match anymore.
        //
        //         },
        //
        //         // all
        //         "all": function() {
        //             // ScrollTriggers created here aren't associated with a particular media query,
        //             // so they persist.
        //         }
        //
        //     });
        //     setTimeout(function () {
        //         ScrollTrigger.refresh();
        //         setLoading(false);
        //     }, 1500);
        // }, 1500);
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

        // clean up code
        return () => {
            //Draggable.kill(); // no error but media query events still fire after unmount
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
                <div className="relative memory-module"  theme={bgThemeCol}>
                    <div className={`memory-tools ${toolPanel} ${bgThemeTemp}`}>
                        <Header toLink={"/"} title={"Preview"}/>
                        <Seo title={postTitle} description={postDescription} image={postImage}/>
                        <div className="progress-bar" style={progressBarStyle}/>
                        <Dropdown overlay={menu} trigger={['click']} placement="topCenter" className="share-menu-list">
                            <a className="ant-dropdown-link share-menu">
                                <div className="bg-transparent text-black rounded-full p-4 flex items-center justify-center w-16 h-16 cursor-pointer border-2 border-black z-10">
                                    Share
                                </div>
                            </a>
                        </Dropdown>
                    </div>

                    <div className="memory-holder" id="memoryHolder" ref={sliderRef}>
                        {(isMobile == false) ? (
                            <div >
                                <section className="blank">
                                    <h1>ScrollTrigger Bi-Directional Fake Horizontal Scroll</h1>
                                    <p>...</p>
                                </section>

                                <section className="horizontal">
                                    <div className="pin-wrap">
                                        <div className="animation-wrap to-right">

                                            <div className="item">Lorem ipsum, dolor sit amet consectetur adipisicing
                                                elit. Necessitatibus, temporibus esse magni illum eos natus ipsum minus?
                                                Quis excepturi voluptates atque dolorum minus eligendi! Omnis minima
                                                magni recusandae ex dignissimos.
                                            </div>
                                            <div className="item">Eaque ullam illum nobis deleniti mollitia unde, sed,
                                                nemo ipsa ratione ex, dicta aliquam voluptates! Odio vitae eum nobis
                                                dignissimos sunt ipsum repellendus totam optio distinctio. Laborum
                                                suscipit quia aperiam.
                                            </div>
                                            <div className="item">Animi, porro molestias? Reiciendis dolor aspernatur ab
                                                quos nulla impedit, dolores ullam hic commodi nobis nam. Dolorem
                                                expedita laudantium dignissimos nobis a. Dolorem, unde quidem. Tempora
                                                et a quibusdam inventore!
                                            </div>
                                            <div className="item">Labore, unde amet! Alias delectus hic laboriosam et
                                                dolorum? Saepe, dicta eaque? Veniam eos blanditiis neque. Officia et
                                                nostrum, tempore modi quo praesentium aspernatur vero dolor, ipsa unde
                                                perspiciatis minima.
                                            </div>
                                            <div className="item">Quaerat error dolorem aspernatur magni dicta ut
                                                consequuntur maxime tempore. Animi odio eos quod culpa nulla
                                                consectetur? Aperiam ipsam ducimus delectus reprehenderit unde, non
                                                laborum voluptate laboriosam, officiis at ea!
                                            </div>
                                            <div className="item">Rem nobis facere provident magni minima iste commodi
                                                aliquam harum? Facere error quos cumque perspiciatis voluptatibus
                                                deserunt maiores, fugiat sunt sit ab inventore natus saepe, eveniet
                                                alias ipsam placeat voluptas!
                                            </div>
                                            <div className="item">Lorem ipsum, dolor sit amet consectetur adipisicing
                                                elit. Necessitatibus, temporibus esse magni illum eos natus ipsum minus?
                                                Quis excepturi voluptates atque dolorum minus eligendi! Omnis minima
                                                magni recusandae ex dignissimos.
                                            </div>
                                            <div className="item">Magnam eveniet inventore assumenda ullam. At saepe
                                                voluptatibus sed dicta reiciendis, excepturi nisi perferendis,
                                                accusantium est suscipit tempora dolorum praesentium cupiditate
                                                doloribus non? Sint numquam recusandae dolore quis esse ea?
                                            </div>
                                            <div className="item">Temporibus cum dolor minima consequatur esse veritatis
                                                enim nemo cupiditate laborum doloribus reiciendis perferendis, quas
                                                fugit earum rerum, at beatae alias amet aspernatur dolorem dolore error
                                                commodi. Perspiciatis, reiciendis amet!
                                            </div>
                                            <div className="item">Vitae, tenetur beatae error corrupti odit expedita
                                                quisquam commodi ea aspernatur aliquid, eveniet reprehenderit sequi,
                                                similique maiores praesentium quam! Optio tenetur saepe unde voluptatem
                                                minus tempora maxime temporibus ducimus ullam!
                                            </div>

                                        </div>
                                    </div>
                                </section>


                                <section className="blank">
                                    <h1>Nothing to see here...</h1>
                                    <p>...</p>
                                </section>


                                <section className="horizontal">
                                    <div className="pin-wrap">
                                        <div className="animation-wrap to-left">
                                            <div className="item">Lorem ipsum, dolor sit amet consectetur adipisicing
                                                elit. Necessitatibus, temporibus esse magni illum eos natus ipsum minus?
                                                Quis excepturi voluptates atque dolorum minus eligendi! Omnis minima
                                                magni recusandae ex dignissimos.
                                            </div>
                                            <div className="item">Eaque ullam illum nobis deleniti mollitia unde, sed,
                                                nemo ipsa ratione ex, dicta aliquam voluptates! Odio vitae eum nobis
                                                dignissimos sunt ipsum repellendus totam optio distinctio. Laborum
                                                suscipit quia aperiam.
                                            </div>
                                            <div className="item">Animi, porro molestias? Reiciendis dolor aspernatur ab
                                                quos nulla impedit, dolores ullam hic commodi nobis nam. Dolorem
                                                expedita laudantium dignissimos nobis a. Dolorem, unde quidem. Tempora
                                                et a quibusdam inventore!
                                            </div>
                                            <div className="item">Labore, unde amet! Alias delectus hic laboriosam et
                                                dolorum? Saepe, dicta eaque? Veniam eos blanditiis neque. Officia et
                                                nostrum, tempore modi quo praesentium aspernatur vero dolor, ipsa unde
                                                perspiciatis minima.
                                            </div>
                                            <div className="item">Quaerat error dolorem aspernatur magni dicta ut
                                                consequuntur maxime tempore. Animi odio eos quod culpa nulla
                                                consectetur? Aperiam ipsam ducimus delectus reprehenderit unde, non
                                                laborum voluptate laboriosam, officiis at ea!
                                            </div>
                                            <div className="item">Rem nobis facere provident magni minima iste commodi
                                                aliquam harum? Facere error quos cumque perspiciatis voluptatibus
                                                deserunt maiores, fugiat sunt sit ab inventore natus saepe, eveniet
                                                alias ipsam placeat voluptas!
                                            </div>
                                            <div className="item">Lorem ipsum, dolor sit amet consectetur adipisicing
                                                elit. Necessitatibus, temporibus esse magni illum eos natus ipsum minus?
                                                Quis excepturi voluptates atque dolorum minus eligendi! Omnis minima
                                                magni recusandae ex dignissimos.
                                            </div>
                                            <div className="item">Magnam eveniet inventore assumenda ullam. At saepe
                                                voluptatibus sed dicta reiciendis, excepturi nisi perferendis,
                                                accusantium est suscipit tempora dolorum praesentium cupiditate
                                                doloribus non? Sint numquam recusandae dolore quis esse ea?
                                            </div>
                                            <div className="item">Temporibus cum dolor minima consequatur esse veritatis
                                                enim nemo cupiditate laborum doloribus reiciendis perferendis, quas
                                                fugit earum rerum, at beatae alias amet aspernatur dolorem dolore error
                                                commodi. Perspiciatis, reiciendis amet!
                                            </div>
                                            <div className="item">Vitae, tenetur beatae error corrupti odit expedita
                                                quisquam commodi ea aspernatur aliquid, eveniet reprehenderit sequi,
                                                similique maiores praesentium quam! Optio tenetur saepe unde voluptatem
                                                minus tempora maxime temporibus ducimus ullam!
                                            </div>

                                        </div>
                                    </div>
                                </section>


                                <section className="blank">
                                    <h1>...ScrollTrigger for the win...</h1>
                                    <p>...</p>
                                </section>


                                <section className="horizontal">
                                    <div className="pin-wrap">
                                        <div className="animation-wrap to-right">
                                            <div className="item">Lorem ipsum, dolor sit amet consectetur adipisicing
                                                elit. Necessitatibus, temporibus esse magni illum eos natus ipsum minus?
                                                Quis excepturi voluptates atque dolorum minus eligendi! Omnis minima
                                                magni recusandae ex dignissimos.
                                            </div>
                                            <div className="item">Eaque ullam illum nobis deleniti mollitia unde, sed,
                                                nemo ipsa ratione ex, dicta aliquam voluptates! Odio vitae eum nobis
                                                dignissimos sunt ipsum repellendus totam optio distinctio. Laborum
                                                suscipit quia aperiam.
                                            </div>
                                            <div className="item">Animi, porro molestias? Reiciendis dolor aspernatur ab
                                                quos nulla impedit, dolores ullam hic commodi nobis nam. Dolorem
                                                expedita laudantium dignissimos nobis a. Dolorem, unde quidem. Tempora
                                                et a quibusdam inventore!
                                            </div>
                                            <div className="item">Labore, unde amet! Alias delectus hic laboriosam et
                                                dolorum? Saepe, dicta eaque? Veniam eos blanditiis neque. Officia et
                                                nostrum, tempore modi quo praesentium aspernatur vero dolor, ipsa unde
                                                perspiciatis minima.
                                            </div>
                                            <div className="item">Quaerat error dolorem aspernatur magni dicta ut
                                                consequuntur maxime tempore. Animi odio eos quod culpa nulla
                                                consectetur? Aperiam ipsam ducimus delectus reprehenderit unde, non
                                                laborum voluptate laboriosam, officiis at ea!
                                            </div>
                                            <div className="item">Rem nobis facere provident magni minima iste commodi
                                                aliquam harum? Facere error quos cumque perspiciatis voluptatibus
                                                deserunt maiores, fugiat sunt sit ab inventore natus saepe, eveniet
                                                alias ipsam placeat voluptas!
                                            </div>
                                            <div className="item">Lorem ipsum, dolor sit amet consectetur adipisicing
                                                elit. Necessitatibus, temporibus esse magni illum eos natus ipsum minus?
                                                Quis excepturi voluptates atque dolorum minus eligendi! Omnis minima
                                                magni recusandae ex dignissimos.
                                            </div>
                                            <div className="item">Magnam eveniet inventore assumenda ullam. At saepe
                                                voluptatibus sed dicta reiciendis, excepturi nisi perferendis,
                                                accusantium est suscipit tempora dolorum praesentium cupiditate
                                                doloribus non? Sint numquam recusandae dolore quis esse ea?
                                            </div>
                                            <div className="item">Temporibus cum dolor minima consequatur esse veritatis
                                                enim nemo cupiditate laborum doloribus reiciendis perferendis, quas
                                                fugit earum rerum, at beatae alias amet aspernatur dolorem dolore error
                                                commodi. Perspiciatis, reiciendis amet!
                                            </div>
                                            <div className="item">Vitae, tenetur beatae error corrupti odit expedita
                                                quisquam commodi ea aspernatur aliquid, eveniet reprehenderit sequi,
                                                similique maiores praesentium quam! Optio tenetur saepe unde voluptatem
                                                minus tempora maxime temporibus ducimus ullam!
                                            </div>

                                        </div>
                                    </div>
                                </section>


                                <section className="blank">
                                    <h1>...keep scrollin' scrollin' scrollin' scrollin'...</h1>
                                    <p>...</p>
                                </section>


                                <section className="horizontal">
                                    <div className="pin-wrap">
                                        <div className="animation-wrap to-left">
                                            <div className="item">Lorem ipsum, dolor sit amet consectetur adipisicing
                                                elit. Necessitatibus, temporibus esse magni illum eos natus ipsum minus?
                                                Quis excepturi voluptates atque dolorum minus eligendi! Omnis minima
                                                magni recusandae ex dignissimos.
                                            </div>
                                            <div className="item">Eaque ullam illum nobis deleniti mollitia unde, sed,
                                                nemo ipsa ratione ex, dicta aliquam voluptates! Odio vitae eum nobis
                                                dignissimos sunt ipsum repellendus totam optio distinctio. Laborum
                                                suscipit quia aperiam.
                                            </div>
                                            <div className="item">Animi, porro molestias? Reiciendis dolor aspernatur ab
                                                quos nulla impedit, dolores ullam hic commodi nobis nam. Dolorem
                                                expedita laudantium dignissimos nobis a. Dolorem, unde quidem. Tempora
                                                et a quibusdam inventore!
                                            </div>
                                            <div className="item">Labore, unde amet! Alias delectus hic laboriosam et
                                                dolorum? Saepe, dicta eaque? Veniam eos blanditiis neque. Officia et
                                                nostrum, tempore modi quo praesentium aspernatur vero dolor, ipsa unde
                                                perspiciatis minima.
                                            </div>
                                            <div className="item">Quaerat error dolorem aspernatur magni dicta ut
                                                consequuntur maxime tempore. Animi odio eos quod culpa nulla
                                                consectetur? Aperiam ipsam ducimus delectus reprehenderit unde, non
                                                laborum voluptate laboriosam, officiis at ea!
                                            </div>
                                            <div className="item">Rem nobis facere provident magni minima iste commodi
                                                aliquam harum? Facere error quos cumque perspiciatis voluptatibus
                                                deserunt maiores, fugiat sunt sit ab inventore natus saepe, eveniet
                                                alias ipsam placeat voluptas!
                                            </div>
                                            <div className="item">Lorem ipsum, dolor sit amet consectetur adipisicing
                                                elit. Necessitatibus, temporibus esse magni illum eos natus ipsum minus?
                                                Quis excepturi voluptates atque dolorum minus eligendi! Omnis minima
                                                magni recusandae ex dignissimos.
                                            </div>
                                            <div className="item">Magnam eveniet inventore assumenda ullam. At saepe
                                                voluptatibus sed dicta reiciendis, excepturi nisi perferendis,
                                                accusantium est suscipit tempora dolorum praesentium cupiditate
                                                doloribus non? Sint numquam recusandae dolore quis esse ea?
                                            </div>
                                            <div className="item">Temporibus cum dolor minima consequatur esse veritatis
                                                enim nemo cupiditate laborum doloribus reiciendis perferendis, quas
                                                fugit earum rerum, at beatae alias amet aspernatur dolorem dolore error
                                                commodi. Perspiciatis, reiciendis amet!
                                            </div>
                                            <div className="item">Vitae, tenetur beatae error corrupti odit expedita
                                                quisquam commodi ea aspernatur aliquid, eveniet reprehenderit sequi,
                                                similique maiores praesentium quam! Optio tenetur saepe unde voluptatem
                                                minus tempora maxime temporibus ducimus ullam!
                                            </div>

                                        </div>
                                    </div>
                                </section>

                                <section className="blank">
                                    <h1>...lorem ipsum...</h1>
                                    <p>...</p>
                                </section>

                                <section className="horizontal">
                                    <div className="pin-wrap">
                                        <div className="animation-wrap to-left">
                                            <div className="item">Lorem ipsum, dolor sit amet consectetur adipisicing
                                                elit. Necessitatibus, temporibus esse magni illum eos natus ipsum minus?
                                                Quis excepturi voluptates atque dolorum minus eligendi! Omnis minima
                                                magni recusandae ex dignissimos.
                                            </div>
                                            <div className="item">Eaque ullam illum nobis deleniti mollitia unde, sed,
                                                nemo ipsa ratione ex, dicta aliquam voluptates! Odio vitae eum nobis
                                                dignissimos sunt ipsum repellendus totam optio distinctio. Laborum
                                                suscipit quia aperiam.
                                            </div>
                                            <div className="item">Animi, porro molestias? Reiciendis dolor aspernatur ab
                                                quos nulla impedit, dolores ullam hic commodi nobis nam. Dolorem
                                                expedita laudantium dignissimos nobis a. Dolorem, unde quidem. Tempora
                                                et a quibusdam inventore!
                                            </div>
                                            <div className="item">Labore, unde amet! Alias delectus hic laboriosam et
                                                dolorum? Saepe, dicta eaque? Veniam eos blanditiis neque. Officia et
                                                nostrum, tempore modi quo praesentium aspernatur vero dolor, ipsa unde
                                                perspiciatis minima.
                                            </div>
                                            <div className="item">Quaerat error dolorem aspernatur magni dicta ut
                                                consequuntur maxime tempore. Animi odio eos quod culpa nulla
                                                consectetur? Aperiam ipsam ducimus delectus reprehenderit unde, non
                                                laborum voluptate laboriosam, officiis at ea!
                                            </div>
                                            <div className="item">Rem nobis facere provident magni minima iste commodi
                                                aliquam harum? Facere error quos cumque perspiciatis voluptatibus
                                                deserunt maiores, fugiat sunt sit ab inventore natus saepe, eveniet
                                                alias ipsam placeat voluptas!
                                            </div>
                                            <div className="item">Lorem ipsum, dolor sit amet consectetur adipisicing
                                                elit. Necessitatibus, temporibus esse magni illum eos natus ipsum minus?
                                                Quis excepturi voluptates atque dolorum minus eligendi! Omnis minima
                                                magni recusandae ex dignissimos.
                                            </div>
                                            <div className="item">Magnam eveniet inventore assumenda ullam. At saepe
                                                voluptatibus sed dicta reiciendis, excepturi nisi perferendis,
                                                accusantium est suscipit tempora dolorum praesentium cupiditate
                                                doloribus non? Sint numquam recusandae dolore quis esse ea?
                                            </div>
                                            <div className="item">Temporibus cum dolor minima consequatur esse veritatis
                                                enim nemo cupiditate laborum doloribus reiciendis perferendis, quas
                                                fugit earum rerum, at beatae alias amet aspernatur dolorem dolore error
                                                commodi. Perspiciatis, reiciendis amet!
                                            </div>
                                            <div className="item">Vitae, tenetur beatae error corrupti odit expedita
                                                quisquam commodi ea aspernatur aliquid, eveniet reprehenderit sequi,
                                                similique maiores praesentium quam! Optio tenetur saepe unde voluptatem
                                                minus tempora maxime temporibus ducimus ullam!
                                            </div>

                                        </div>
                                    </div>
                                </section>


                                <section className="blank">
                                    <h1>...what do you think?</h1>
                                    <p>...</p>
                                </section>
                            </div>
                        ) : (
                            <div className="memory-journey" id="memoryJourney" ref={panelsContainer}>
                                <Swiper
                                    freeMode={false}
                                    pagination={false}
                                    navigation={{
                                        nextEl: '.swiper-button-next',
                                        prevEl: '.swiper-button-prev',
                                    }}
                                    spaceBetween={0}
                                    onSlideChange={(index) => setPanelCurrent(index.activeIndex + 1)}
                                    onAfterInit={(swiper) => setTimeout(function () {handleSliderInit(swiper.slides.length)}, 2000)}
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
                                                <div className="text-white text-left px-20 md:px-32 ">
                                                    <h1 className={`font-bold text-left leading-tight ${txtBgColor}`}>In
                                                        loving memory of <br/> {userName}</h1>
                                                    <p className={`my-2 text-left ${txtBgColor}`}>A
                                                        loving {loving}</p>
                                                </div>
                                            </div>
                                            <div className={'split-50'} style={{backgroundImage: 'url(' + imageUrl + ')', backgroundColor: '#ffffff5e', backdropFilter: 'hue-rotate(15deg)', backgroundSize: 'cover', backgroundPosition: 'center'}}></div>

                                        </section>

                                    </SwiperSlide>
                                    {(description !== "" ) ? (
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
                                    {( photos.length >= 2 ) ? (
                                        <SwiperSlide >
                                            <section id="panel3"
                                                     className={`memory-panel h-full w-full flex flex-col items-center scrollable ${bgTheme}`}
                                                     ref={(e) => createPanelsRefs(e, 2)}>
                                                {photos.map((value, index) => {
                                                    return (
                                                        <div key={index} className="memory-pic">
                                                            <img src={photos[index].image} alt="" className="z-10"/>
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
                                                    <div className="text-white text-left px-20 md:px-32">
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

                                                        {favorites.map((value, favorites_index) => {
                                                            return (
                                                                <div key={favorites_index}>

                                                                    <SwiperSlide key={favorites_index + 300}>
                                                                        <div
                                                                            className="swiper-lazy-preloader swiper-lazy-preloader-black z-0"></div>
                                                                        <p>
                                                                            {favorites[favorites_index].name}
                                                                        </p>
                                                                        <img src={favorites[favorites_index].image} alt=""
                                                                             className="swiper-lazy z-10"/>
                                                                    </SwiperSlide>

                                                                </div>
                                                            )
                                                        })}
                                                        {verified_friends.map((value, verified_friends_index) => {
                                                            return (
                                                                <div key={verified_friends_index}>

                                                                    <SwiperSlide key={verified_friends_index + 400}>
                                                                        <div
                                                                            className="swiper-lazy-preloader swiper-lazy-preloader-black z-0"></div>
                                                                        <p>
                                                                            {verified_friends[verified_friends_index].description}

                                                                            <span>{verified_friends[verified_friends_index].name}</span>
                                                                        </p>


                                                                        <img src={verified_friends[verified_friends_index].image} alt=""
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
                                                         style={{backgroundImage: "url(" + {imageUrl} + ")"}}><img src={imageUrl}
                                                                                                                   alt=""
                                                                                                                   className="z-10"/>
                                                    </div>
                                                    <h1 className={`text-center leading-tight ${txtBgColor}`}>You will
                                                        always be loved {userName}</h1>
                                                </div>
                                            </div>
                                        </section>
                                    </SwiperSlide>
                                    <SwiperSlide>
                                        <section id="panel7"
                                                 className={`memory-panel outro h-full w-full flex flex-col items-center pattern-bg ${bgTheme} `}
                                                 ref={(e) => createPanelsRefs(e, 6)}>
                                            <div className={'split-50 helpful-info text-left bg-white'}>
                                                <img src="../svg/logo-afsp.png" className="logo" placeholder="white" alt="logo"/>
                                                <h2 className="px-5 text-left font-medium leading-tight">Helpful Resources</h2>
                                                <div className={'helpful-resources flex flex-wrap'}>
                                                    {helpfulResources.map((value, index) => {
                                                        return (
                                                            <div key={index} className="resource-card">
                                                                <Card
                                                                    bordered={false}
                                                                    cover={<img alt="example" src={value.image}/>}
                                                                >
                                                                    <Meta title={value.name}/>
                                                                    <a href={value.url}>Learn more</a>
                                                                </Card>


                                                            </div>
                                                        )
                                                    })}
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
