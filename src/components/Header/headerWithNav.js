import {Link} from "gatsby"
import PropTypes from "prop-types"
import React, {useState, useEffect} from "react"
import {isLoggedIn, getCurrentUser, logout} from "../../utils/auth"

import {Menu, Dropdown} from 'antd';
import {AiFillMinusCircle} from 'react-icons/ai';

import {RiLoginCircleLine} from 'react-icons/ri'
import {navigate} from "gatsby"

import {useStateMachine} from "little-state-machine";
import updateAction from "../../utils/updateAction";

import {handleAPIPost} from "../../utils/auth";

import {useForm} from "react-hook-form";

import LogoPlaceholder from './../LogoPlaceholder';

function Main({siteTitle, isLanding}) {

    const [isUserLoggedIn, setIsUserLoggedIn] = useState(isLoggedIn())
    const [memoryNotification, setMemoryNotification] = useState([])
    const [currentUserName, setCurrentUserName] = useState([])
    const {state, actions} = useStateMachine({updateAction});

    const [userLetter, setUserLetter] = useState("I")

    const {getValues, formState: {errors, isValid}} = useForm({
        mode: "onChange",
        defaultValues: state.data
    });

    const menu = (

        <Menu>
            <Menu.Item style={{padding: "10px 30px 0 30px"}} key="0">
                <span className="pointer-events-none text-xs text-gray-400">Logged in as:</span>
                <p className="pointer-events-none text-sm text-gray-700">
                    {currentUserName}
                </p>
            </Menu.Item>
            <Menu.Divider/>
            <Menu.Item style={{padding: "10px 30px"}} key="1">
                <Link to="/app/your-memories">Your memories</Link>
            </Menu.Item>
            <Menu.Item style={{padding: "10px 30px", position: "relative"}} key="2">
                <Link to="/app/notifications">
                    Notifications
                    {(memoryNotification === true) ? (
                        <span className='has-notification dropdown-nav'></span>
                    ) : (
                        <></>
                    )}
                </Link>
            </Menu.Item>
            <Menu.Item style={{padding: "10px 30px"}} key="3">
                <Link to="/app/account-settings">Settings</Link>

            </Menu.Item>
            <Menu.Divider/>
            <Menu.Item onClick={() => handleSignOut(callback)} style={{padding: "10px 30px"}} key="4">Log
                out</Menu.Item>
            <Menu.Divider/>
            <Menu.Item style={{padding: "10px 30px 0 30px"}} key="5">
                <Link to="https://suicidepreventionlifeline.org/" target="_blank">
                    <p className="pointer-events-none text-sm text-gray-700">
                        If you are experiencing a crisis <br/><span
                        className="pointer-events-none text-sm text-blue-700">Please get immediate help</span>
                    </p>
                </Link>
            </Menu.Item>
        </Menu>
    );

    const handleSignOut = () => {
        logout(callback)
        navigate("/");

        let data = [];
        data.access_token = "";
        data.name = "";
        data.loving = "";
        data.cover_image = null;
        data.photos = [];
        data.description = "";
        data.favorites = [];
        data.special_dates = [];
        data.reminder = 0;
        data.friends = [];
        data.id = null;
        data.user_id = null;
        data.status_id = null;
        data.active = null;
        data.visible_type = "public";
        data.user = {
            name: '',
            email: '',
            all_memory_reminder: 0,
            receive_afsp_resources: 0
        };
        data.theme_color = "";
        data.thumbnail = "";
        data.prevFrom = 0;

        actions.updateAction(data);

        window.location.reload();

    }

    const callback = () => {

        setIsUserLoggedIn(isLoggedIn());

    }


    const handleNotificationReadSuccess = data => {
        //console.log(data);
        setMemoryNotification(data.show_notification);
    }

    const handleNotificationReadErrors = data => {
        console.log("error");
    }


    useEffect(() => {

        let details = {}
        let getUserDetails = getCurrentUser();

        if (getUserDetails.user === undefined) {
            logout(callback);
        } else {
            setCurrentUserName(getUserDetails.user);
            setUserLetter(getUserDetails.user.charAt(0).toUpperCase());
            handleAPIPost('user/check/new/notifications', details, getUserDetails.token, handleNotificationReadSuccess, handleNotificationReadErrors);
        }


    }, []);

    return (
        <div>
            <div
                className="fixed top-0 left-0 lg:absolute w-full z-40 bg-white bg-opacity-20 lg:bg-transparent  lg:shadow-none header-nav">

                {(isLanding) ? (<></>) : (

                    <div
                        className={`flex items-center justify-between py-0 px-0 ${isUserLoggedIn ? "bg-white bg-opacity-20" : ""}`}>

                        <div>
                            <Link to="/">
                                <span className="absolute bg-white">
                                    <img src="../../svg/afsp-logo-lovingmemories.svg"
                                     className="cursor-pointer h-20 lg:h-24 max-w-xs w-11/12 " placeholder="white" alt="logo"/>
                                </span>
                                <LogoPlaceholder />
                            </Link>
                        </div>

                        {(isUserLoggedIn) ? (<div className="relative w-full top-0 pointer-events-none hidden lg:block">
                            <div
                                className="flex gap-10 items-center justify-center mx-auto pointer-events-auto header-nav">

                                <div className="text-lg font-bold ">
                                    <Link to="/app/your-memories">
                        <span className="text-gray-400 text-sm">
                          Memories
                        </span>

                                    </Link>
                                </div>
                                <div className="text-lg font-bold ">
                                    <Link to="/app/notifications">
                        <span className="text-gray-400 text-sm relative">
                          Notifications
                            {(memoryNotification === true) ? (
                                <span className='has-notification'></span>
                            ) : (
                                <></>
                            )}
                        </span>
                                    </Link>
                                </div>
                                <div className="text-lg font-bold ">

                                    <Link to="/app/account-settings">
                        <span className="text-gray-400 text-sm">
                          Settings
                        </span>
                                    </Link>

                                </div>
                            </div>
                        </div>) : (
                            <></>
                        )}


                        <div style={{width: '233px'}} className="flex items-center justify-end">

                            {(isUserLoggedIn) ? (

                                <Dropdown overlay={menu} trigger={['click']}>
                                    <a className="ant-dropdown-link menu-btn absolute right-4 top-4" onClick={e => e.preventDefault()}>
                                       <span className="pt-1 transform -rotate-90 bg-blue-500 text-white w-10 h-10 rounded-full flex items-center justify-center text-lg font-bold">
                                    {userLetter}  
                                </span>
                                    </a>
                                </Dropdown>

                            ) : (
                                <Link to="/app/login">
              <span>                
                 <button
                     className="btn-signin inline-block sm:px-8 w-20 md:w-auto text-xs md:text-lg leading-none bg-white text-blue-500 border border-blue-500 rounded-full hover:border-transparent hover:text-white hover:bg-blue-500 lg:mt-0 absolute right-4 top-4"
                 >
                <span>Sign In</span>
                </button>
              </span>
                                </Link>
                            )}

                        </div>

                    </div>

                )}

            </div>

            {(isLanding) ? (<></>) : (

                <div>

                    {(isUserLoggedIn) ? (
                        <div className={`fixed w-full bottom-0 left-0 flex items-center justify-center px-0 py-0 mobile-nav-bar lg:hidden ${isUserLoggedIn ? "bg-white bg-opacity-20" : ""}`}>

                        <div className="pointer-events-none block">
                            <div className="flex gap-10 items-center justify-center mx-auto pointer-events-auto py-4">

                                <div className="text-lg font-bold ">
                                    <Link to="/app/your-memories">
                        <span className="text-gray-400 text-sm">
                          Memories
                        </span>

                                    </Link>
                                </div>
                                <div className="text-lg font-bold ">
                                    <Link to="/app/notifications">
                        <span className="text-gray-400 text-sm relative">
                          Notifications
                            {(memoryNotification == true) ? (
                                <span className='has-notification'></span>
                            ) : (
                                <></>
                            )}
                        </span>
                                    </Link>
                                </div>
                                <div className="text-lg font-bold ">

                                    <Link to="/app/account-settings">
                        <span className="text-gray-400 text-sm">
                          Settings
                        </span>
                                    </Link>

                                </div>
                            </div>
                        </div>
                        </div>)
                        : (
                        <></>
                    )}

                </div>

            )}
        </div>


    )
}

Main.propTypes = {
    siteTitle: PropTypes.string,
}

Main.defaultProps = {
    siteTitle: ``,
}

export default Main
