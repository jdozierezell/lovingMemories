import React, { useState } from 'react'

import {Link} from "gatsby"

import Header from "../Header/headerPlain"
import SideComponent from "../AddMemory/memory-side"

import { useForm } from "react-hook-form";
import { useStateMachine } from "little-state-machine";
import updateAction from "../../utils/updateAction";

import { navigate } from "gatsby"

import { Spin, Card  } from 'antd';
import { BsLifePreserver } from 'react-icons/bs';

import logo from '../../images/gatsby-icon.svg'

import ImagePlaceholder from "../ImagePlaceholder";



const memorySide = ({handleDelete, text1, text2, thumbnail, token}) => {

    return (
        <div>

            {(thumbnail == "") ? (
                <div className="memory-side bg-gray-100 ml-auto mr-28 text-center w-full lg:w-96 px-10 py-10">
                    <span className="flex items-center justify-center mb-5 w-full text-center mx-auto">

                        <img src={logo} className="logo w-16" placeholder="white" alt="logo"/>
                        
                    </span>

                    <span className="text-left">
                        <p className="mb-5">
                            {text1}
                        </p>
                        <p>
                            {text2}
                        </p>
                        <p>
                            If you are experiences a crisis <br />
                            <a className="underline" href="#">Please get immediate help</a>
                        </p>
                    </span>

                </div>
            ) : (
                <div className="memory-side bg-white lg:border-gray-100 lg:border-2 rounded ml-auto mr-28 text-center w-full lg:w-96 pb-10 pt-0">

                    <div  className="memory-thumbnail w-40 h-40 rounded-full shadow-inner overflow-hidden mx-auto">
                         
                        <div className="flex items-center justify-center relative">
                            <span className="block rounded-full max-w-xs">
                                <ImagePlaceholder />
                            </span>
                            <img
                                className="absolute top-0 max-w-xs rounded-full shadow submittedImg-sm"
                                src={thumbnail}
                                alt=""
                            />                                                
                        </div>

                    </div>
                    <span className="text-center">
                        <h2 className="mb-5 text-center">
                            {text1}
                        </h2>
                        <a onClick={() => navigate("/app/add-memory/add-who-can-see") }
                            className=" preference-btn flex flex-wrap  mx-auto items-center justify-center px-2 md:px-8 py-3 mt-8 mb-8 text-sm leading-none bg-white text-gray-600 border-2 border-gray-500 rounded-full hover:border-black hover:text-black disabled:opacity-50" >
                                Memory Preferences
                        </a>
                        
                        <hr className='hidden'/>
                        <h5 className="small-title">Memory Submissions</h5>
                        <Link to="/app/notifications">
                        <p className="flex flex-wrap  mx-auto justify-center mb-10">
                            <span className="notification-pending flex justify-center items-center text-white bg-pink-600 rounded-full w-8 h-8 mr-2 ">{text2}</span> Pending memories
                        </p>
                        </Link>
                        <hr className='hidden'/>
                        <a onClick={() => handleDelete(token)}
                                   className="  preference-btn flex flex-wrap  mx-auto justify-center px-2 md:px-8 py-3 mt-8 mb-8 text-sm leading-none bg-white text-red-600 border-2 border-red-500 rounded-full hover:border-black hover:text-black disabled:opacity-50" >
                                    Delete Memory

                        </a>
                    </span>

                </div>
            )}

            
        </div>
    )
}

export default memorySide