import React, {useState, useRef, useEffect} from 'react'


import { useForm } from "react-hook-form";
import { useStateMachine } from "little-state-machine";
import updateAction from "../utils/updateAction";

import "antd/dist/antd.css";

import { navigate } from "gatsby";

import { Avatar, Spin, Card } from 'antd';
import { IoIosAdd } from 'react-icons/io';
import { HiOutlinePlus } from 'react-icons/hi';
import { LoadingOutlined } from '@ant-design/icons';
import { handleAPIPostPublic } from "../utils/auth";
import { DeleteOutlined } from '@ant-design/icons'


const AddToMemory = () => {

    const { state, actions } = useStateMachine({ updateAction });

     const { register, handleSubmit, reset, getValues,setValue, formState: {errors, isValid} } = useForm({
        mode:"onChange"
    });

    const [favorites, setFavorites] = useState([
        
    ]);

    const [imageVal, setImageVal] = useState();

    const [loading, setLoading] = useState(false);

    const loadingIcon = <LoadingOutlined style={{ fontSize: 50 }} spin />;

    const [userName, setUserName] = useState("");

    const fileInputRef = useRef();

    const [charCount, setCharCount] = useState(0);

    const [addToToken, setAddToToken] = useState("");

    const [relationshipVal, setRelationshipVal] = useState("");

    

    const addMemoryToList = data => {

        let createNewObj = {
            description:data.name,
            image:imageVal
        }

        setFavorites(prevState => [...prevState, createNewObj] );

         setValue('description', "");

       

        setCharCount(0);
        setImageVal(""); 

    };

    const addToMemory = () => {

        /* API REQUEST HERE */
        setLoading(true);

        const relationshipVal = getValues('relationship');

      //  console.log(relationshipVal);

        let values = {
            'relationship': relationshipVal,
            'favorites':favorites,
            'memory_access_token':addToToken
        }

        handleAPIPostPublic('memory/friend/submit', values, handlePreviewSuccess, handlePreviewErrors);


        /*  let details = {
            'access_token': addToToken,
            'relationship': 
        }

        handleAPIPostPublic('memory/info', details, handlePreviewSuccess, handlePreviewErrors);   */
    }

    const handlePreviewSuccess = data => {
        console.log("success")
    }


    const handlePreviewErrors = data => {
        console.log("error")
    }

    

    const handleChangeInput=e=>{
         
        let file = e.target.files[0];
          const reader = new FileReader();
            reader.onloadend = (result) => {
                setImageVal(result.target.result)
            }
            reader.readAsDataURL(file);
    }

    const wordCount = e => {
         let currentText=e.target.value;
        let count=currentText.length;
        //console.log(count);
        setCharCount(count); 

       
    }

    const renderButton = () => {       
        return(
            <div onClick={addToMemory} className="fixed mt-10 lg:mt-0 bg-white w-full bottom-0 text-center p-8 border-t-2 ">                        
                <button                
                 disabled={(favorites.length < 1)}
                className="flex flex-wrap items-center mx-auto justify-between px-14 py-3 mt-4 text-sm leading-none bg-transparent text-blue-600 border-2 border-blue-600 rounded-full hover:border-blue-600 hover:text-white hover:bg-blue-600 lg:mt-0 disabled:opacity-50" >
                    Add To
                </button> 
            </div>
        )       
    }

    const addMemoryButton = () => {       
        return(
            <div className="text-left mb-10">
                <button 
                 disabled={charCount<3}           
                className=" flex flex-wrap items-start justify-between px-6 py-3 text-xs text-bold leading-none bg-transparent text-blue-600 border-2 border-blue-600 rounded-full hover:border-blue-600 hover:text-white hover:bg-blue-600 lg:mt-0 disabled:opacity-50 " >
                   <HiOutlinePlus size={16} /> <span className="ml-2">Add A Memory</span>
                </button>
            </div>
        )       
    }   

    const removeItem = (index) => {
        setFavorites(favorites.filter((_, i) => i !== index));
    }

     useEffect(() => {

        

        var type = window.location.hash.substr(1);
        
       setAddToToken(type);

    }, []);


    return (
        <Spin className="absolute top-0 left-0" spinning={loading} indicator={loadingIcon}>            
            <section className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <div className="order-2 lg:order-1">
                <form onSubmit={handleSubmit(addMemoryToList)}>
                    <div className="px-10 lg:px-20 mt-10">

                         <label className="text-2xl block text-gray-900 pb-10">
                            Include your favorite memories <span className="capitalize ">{userName}</span>
                        </label>         
                                      
                        <div className="grid grid-cols-1 gap-10">

                            <div className="w-full">
                                   <label className="text-lg block text-gray-900 pb-2" htmlFor="name">
                                    Relationship
                                    </label>                                    
                                    <input 
                                        maxLength={140}
                                        className="border-b-2 border-0 appearance-none w-full py-2 text-gray-900 leading-tight outline-none" 
                                        id="relationship" 
                                        name="relationship"
                                        type="text" 
                                        placeholder="Your Relationship"                                        
                                        {...register('relationship', {required:true})}
                                                            
                                    />
                                    
                                    {errors.relationship && (
                                        <p className="text-red-500 text-sm mt-2">
                                        memory relationship is required
                                        </p>
                                    )}
                                        
                            </div>
                          
                             <div className="w-full">
                                   <label className="text-lg block text-gray-900 pb-2" htmlFor="name">
                                    Description
                                    </label>                                    
                                    <textarea 
                                        maxLength={140}
                                        className="border-b-2 border-0 appearance-none w-full py-2 text-gray-900 leading-tight outline-none" 
                                        id="description" 
                                        name="description"
                                        type="text" 
                                        placeholder="Your Memory"                                        
                                        {...register('description', {required:true})}
                                        onChange={e => wordCount(e)}                            
                                    />
                                     <span className="block w-full text-right">{charCount}/140</span>
                                    {errors.username && (
                                        <p className="text-red-500 text-sm mt-2">
                                        memory meaning is required
                                        </p>
                                    )}
                                        
                            </div>
                              <div className="w-full -mt-5 mb-8">
                                <label className="text-lg block text-gray-900 pb-5" htmlFor="name">
                                    Add a photo memory
                                </label>
                                <div className="flex flex-wrap">
                                    <button className="text-center h-20 mr-2 px-3 py-1 text-xs text-bold leading-none bg-transparent border-2 border-dashed border-gray-300 rounded-none" onClick={(e)=> {
                                    e.preventDefault();
                                    fileInputRef.current.click();
                                }}>
                                    <IoIosAdd className="mx-auto" />
                                    <p className="mt-2">Add Photo Memory</p>
                                </button>
                                 <button className="text-center mx-0" onClick={(e)=> {
                                    e.preventDefault();
                                    fileInputRef.current.click();
                                }}>
                                    <img className="w-auto h-20" src={imageVal} alt="" />
                                </button>
                                </div>
                                <input ref={fileInputRef} onChange={handleChangeInput} style={{display:"none"}} type="file" name="image" id="image" />    
                                      
                            </div>
                        </div>

                          { addMemoryButton() } 

                        <label className="text-lg block text-gray-900 pb-3" htmlFor="name">
                            Memory List
                        </label>

                         {(favorites.length>0) ? (<></>) : (<><p>(Add a Memory to the list to continue)</p></>)} 

                         <div className="mb-40">
                            {favorites.map((value,index) => {                                                              
                            return (
                            <div key={index} className="m-1">
                               
                                 <Card style={{ margin: '20px 0 0 0', padding: '0' }}>
                                     <div className="flex items-center justify-between">
                                         <Avatar shape="square" size="large" src={favorites[index].image} /> <div onClick={() => removeItem(index)} ><DeleteOutlined /></div>
                                     </div>
                                    <div className="pt-5">
                                        <p>{favorites[index].name}</p> 
                                    </div>                   
                                </Card>
                                
                            </div>
                            )
                        })}  
                         </div>

                    </div>
                </form>
                {renderButton()}
            </div>            
            </section>            
        </Spin>
    )
}

export default AddToMemory
