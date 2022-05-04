import React, { useState } from 'react'

import Header from "./Header/headerPlain"
import SideComponent from "./AddMemory/memory-side"

import { useForm } from "react-hook-form";
import { useStateMachine } from "little-state-machine";
import updateAction from "../utils/updateAction";

import { navigate } from "gatsby"

import { Spin, Card  } from 'antd';
import { BsLifePreserver } from 'react-icons/bs';
import ImagePlaceholder from "./ImagePlaceholder";



const memorySide = ({image, text1, text2}) => {
    return (
        <div>
                <div className="bg-white border-gray-100 border-2 rounded mx-auto mr-28 mt-20 text-center w-full lg:w-96 px-10 py-10">
                    <span className="flex items-center justify-center mb-5 w-40 h-40 -mt-24 mt-10 text-center mx-auto rounded-full overflow-hidden relative">
                        <span className="block rounded-full max-w-xs">
                                <ImagePlaceholder />
                            </span>
                        <img src={image} alt="" className="absolute top-0 z-10 w-40 h-40 max-w-xs" />
                    </span>
                    <h2 className="mb-5 text-center">
                        In memory of<br/> {text1}
                    </h2>
                    <span className="text-left">
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