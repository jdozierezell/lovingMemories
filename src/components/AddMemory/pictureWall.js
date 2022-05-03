import React, { useState, useEffect } from 'react'

import { Upload, Modal, Button } from 'antd';
import ImgCrop from 'antd-img-crop';
import {IoMdAdd} from 'react-icons/io'
import axios from 'axios';

import { useForm } from "react-hook-form";
import { useStateMachine } from "little-state-machine";
import updateAction from "../../utils/updateAction";

import Header from "..//Header/headerPlain"
import SideComponent from "./memory-side"

const PictureWall = props => {

    const { state, actions } = useStateMachine({ updateAction });
    const { watch, setValue, getValues, register, formState: {} } = useForm({
         mode:"onChange"
    });

    const values = getValues();

    const [fileList, setFileList] = useState([]);

    const [mainImage, setMainImage] = useState();

    const onChange = ({ fileList: newFileList }) => {
        setFileList(newFileList);
        //console.log(newFileList);
    };

    const onPreview = async file => {

        let src = file.url;

        if (!src) {
            src = await new Promise(resolve => {
                const reader = new FileReader();
                reader.readAsDataURL(file.originFileObj);
                reader.onload = () => resolve(reader.result);
            });
        }

        const image = new Image();
        image.src = src;
        const imgWindow = window.open(src);
        imgWindow.document.write(image.outerHTML);

    };

/*      const handleUpload = () => {
            let formData = new FormData();
            for(var a = 0; a < fileList.length; a++) {
                formData.append("file[]", fileList[a].originFileObj);
                //console.log(fileList[a].originFileObj);
            }
        }    */
    

    const onSubmit = () => {

        setValue('media', fileList);

        let newData = values;

        newData.media = fileList;

        //console.log(fileList)

        actions.updateAction(newData);

        props.history.push("/app/add-memory/in-memory-of");

    };
 

    const renderButton = () => {
        
        return(
            <div className="memory-fields-footer absolute w-full bottom-0 text-center p-8 border-t-2"> 
                <button onClick={()=>onSubmit()}                               
                className=" flex flex-wrap items-center mx-auto justify-between px-8 py-3 mt-4 text-sm leading-none bg-transparent text-blue-500 border border-blue-500 rounded-full hover:border-blue-600 hover:text-white hover:bg-blue-600 lg:mt-0 disabled:opacity-50" >
                    Done
                </button>
            </div>
        )
        
    }

    const uploadButton = () => {
        return(
            <div>
                <IoMdAdd className="mx-auto text-gray-400 text-lg" />
                <div className="text-gray-400 pt-2">Add More</div>
            </div>
        )
    }

    useEffect(() => {

        let imageData = state.data.media;
    
        if(imageData !== undefined) {
            setFileList(imageData);
        } 
        
    }, []);


    return (
        <>


            <Header title="Add Videos or Photos"/>

            <section className="grid grid-cols-2 gap-4">

                <div className="px-5">                 

                    <div>
                        <ImgCrop rotate>
                            <Upload                        
                            listType="picture-card"
                            fileList={fileList}
                            onChange={onChange}
                            onPreview={onPreview}                
                            >
                                {fileList.length < 3 && uploadButton()}
                        
                            </Upload>
                        </ImgCrop>
                    </div>

                </div>

                <div>
                    <SideComponent />

                    <div className="px-20 mt-20">
                            <pre>
                                {
                                    JSON.stringify(watch(), null, 2)
                                }
                            </pre>
                        </div>
                </div>
                
            </section>

            {renderButton()}

           

           

            
        </>
    )
}

export default PictureWall
