import React, { useState } from 'react'

import Header from "../Header/headerPlain"
import SideComponent from "../AddMemory/memory-side"

import { useForm } from "react-hook-form";
import { useStateMachine } from "little-state-machine";
import updateAction from "../../utils/updateAction";

import { navigate } from "gatsby"

import { Spin, Card  } from 'antd';
import { BsLifePreserver } from 'react-icons/bs';

import logo from '../../images/gatsby-icon.svg'



const memorySide = ({text1, text2}) => {
    return (
        <div>
            
            
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
            
        </div>
    )
}

export default memorySide