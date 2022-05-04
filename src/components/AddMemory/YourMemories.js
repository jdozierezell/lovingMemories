import React, { useState, useEffect } from 'react'
import HeaderNav from "../Header/headerWithNav"

import "antd/dist/antd.css";
import "./styles.css";

import { useForm } from "react-hook-form";
import { useStateMachine } from "little-state-machine";
import updateAction from "../../utils/updateAction";

import { baseImageURL, handleAPIPost, handleAPIFetch, isLoggedIn, logout } from "../../utils/auth";
import { navigate } from "gatsby"
import { LoadingOutlined } from '@ant-design/icons';

import {AiOutlinePlus, AiFillEye, AiFillEdit, AiOutlineClockCircle} from 'react-icons/ai';

import {ImBin2} from 'react-icons/im';

import { Spin, message, Modal  } from 'antd';

import MemoryPlaceholder from '../MemoryPlaceholder';


const YourMemories = props => {

    const { state, actions } = useStateMachine({ updateAction });
    const { watch, register, handleSubmit, formState: {errors, isValid} } = useForm({
        mode:"onChange",
        defaultValues: state.data
    });

        const getUser = () =>
    window.localStorage.userData
        ? JSON.parse(window.localStorage.userData)
        : {}

    const [loading, setLoading] = useState(false);
    const loadingIcon = <LoadingOutlined style={{ fontSize: 50 }} spin />;

    const [yourMemories, setYourMemories] = useState([]);

    const [isModalVisible, setIsModalVisible] = useState(false);

    const [deleteIndex, setDeleteIndex] = useState();
    const [deleteToken, setDeleteToken] = useState();
    const [deleteImage, setDeleteImage] = useState();

    const showModal = () => {
      setIsModalVisible(true);
    };

    const handleOk = () => {

        setLoading(true); 

        setIsModalVisible(false);   
        setYourMemories(yourMemories.filter((_, i) => i !== deleteIndex));

        let details = {
            access_token: deleteToken
        }
        
        handleAPIPost('memory/delete', details, state.data.auth_token, handleMemSuccess, handleMemErrors);

    };

    const getEditData = (token) => {
        setLoading(true); 
        let details = {
            'access_token': token
        }

        handleAPIPost('memory/preview', details, state.data.auth_token, handleEditSuccess, handleMemErrors);
    }

    const handlePreviewSuccess = data => {
        setLoading(false); 
        
        let newData=state.data;
        newData.prevFrom = 1;
        actions.updateAction(newData)

        navigate("/app/add-memory/preview") 
    }

    const handlePreviewErrors = data => {
        
        message.error('error');
    }

    const getPreviewData = (token) => {
        setLoading(true); 
        let details = {
            'access_token': token
        }

        handleAPIPost('memory/preview', details, state.data.auth_token, handlePreviewSuccess, handlePreviewErrors);
    }

    const handleEditSuccess = data => {
         setLoading(false); 
        //console.log(data.memory[0])

         let memoryData = data.memory[0];

          let editData = [];          
            editData.access_token=memoryData.access_token;
            editData.name=memoryData.name;
            editData.loving=memoryData.loving;
            editData.cover_image=memoryData.cover_image;         
            editData.photos=memoryData.photos;
            editData.reminder=memoryData.reminder;
            editData.description=memoryData.description;
            editData.favorites=memoryData.favorites;
            editData.special_dates=memoryData.special_dates;
            editData.friends=memoryData.friends;   
            editData.visible_type=memoryData.visible_type;
            editData.theme_color=memoryData.theme_color;
            editData.thumbnail=memoryData.thumbnail;
            editData.user_id=memoryData.user_id;
            editData.status_id=memoryData.status_id;
            editData.id=memoryData.id;
            editData.user=memoryData.user;
            editData.pending_memories_count=memoryData.pending_memories_count;

                                          
            actions.updateAction(editData);

            navigate("/app/add-memory") 

    }

    const handleCancel = () => {
        setIsModalVisible(false);
    };

    const handleResourceSuccess = data => {
        
        setLoading(false); 
        //console.log(data.memories);
        setYourMemories(data.memories);
        //handleAPIPost('memory/notifications', data.memories[0].status_id, state.data.auth_token, handleNotificationSuccess, handleNotificationErrors);

    }

    const handleResourceErrors = data => {
        
        message.error('error fetching memory');
        setLoading(false);
    }

    const handleMemSuccess = data => {
        setLoading(false); 
         message.success('Memory Deleted');
        //console.log("handleMemSuccess");
        //console.log(data);
    }

    const handleMemErrors = () => {
        setLoading(false); 
        
        message.error('error deleting memory');
    }

    const AddMemory = () => {
        //alert("Add a New Memory");
         

          let editData = [];          
            editData.access_token="";
            editData.name="";
            editData.loving="";
            editData.cover_image=null;         
            editData.photos=[];
            editData.reminder=0;
            editData.description="";
            editData.favorites=[];
            editData.special_dates=[];
            editData.friends=[];   
            editData.visible_type="public";
            editData.theme_color="";
            editData.thumbnail="";
            editData.user_id="";
            editData.status_id="";
            editData.id="";
            
            editData.user={
                name:'',
                email:'',
                all_memory_reminder:0,
                receive_afsp_resources:0
            };
                                          
            actions.updateAction(editData);
            navigate('/app/add-memory');
    }

    const removeItem = (index, token, image) => {
        
        setDeleteToken(token)
        setDeleteIndex(index);
        setDeleteImage(image);
        //call to backend

        showModal();
    }

    useEffect(() => {
        setLoading(true);


        let data = [];
        data.auth_token=getUser().token;                                          
        actions.updateAction(data);

        let details = {
                
        }

        if(data.auth_token.token) {
            handleAPIPost('user/memories', details, data.auth_token, handleResourceSuccess, handleResourceErrors);
        }
        else {
            message.error('memory error');
        }

    }, []);

    return (
        <>

            <HeaderNav />
            <Spin spinning={loading} indicator={loadingIcon}>                  
                <section>
                    <div className="px-20 mt-20 mb-0 text-center md:mt-40 md:mb-10">
                        <h3 className=" block text-gray-900 pt-10 pb-5">
                            Your Memories
                        </h3>
                    </div>
                    <div className="flex justify-center items-center mt-0 md:mt-20 lg:mt-0">
                        <div className="px-0 pb-20 md:px-20 mt-0 md:mt-10 text-center flex flex-wrap items-center justify-center md:justify-items-start md:items-start">

                            <div className="inline-block my-5 w-40 h-40 md:w-48 md:h-48 my-5 md:my-10 mx-3 md:mx-5 rounded-full overflow-hidden border-2 border-dashed border-gray-400 cursor-pointer">

                                <div onClick={()=>AddMemory()} className="flex flex-wrap w-40 h-40 md:w-48 md:h-48 items-center justify-center">
                                    <div className="flex flex-col justify-center items-center text-gray-400"><AiOutlinePlus className="mb-2 w-5 h-5" /> Add a Memory</div>
                                </div>

                            </div>

                            {yourMemories.map((value,index) => {                                                              
                                return (    
                                    
                                    <div key={index} className="your-memory relative inline-block mx-3 md:mx-5 my-10 md:my-10 w-40 h-40 md:w-48 md:h-48">
                                        {(value.unread_notifications_count >= 1 && value.status_id > 2) ? (
                                            <span className="your-memory-notifications bg-pink-500">{value.unread_notifications_count}</span>
                                        ) : (
                                            <></>
                                        )}
                                        {(value.status_id < 3) ? (
                                            <span className="your-memory-notifications pending bg-gray-200 text-gray-900"><AiOutlineClockCircle size={20} className="text-gray-900" /></span>
                                        ) : (
                                            <></>
                                        )}
                                    <div  className="w-40 h-40 md:w-48 md:h-48 rounded-full shadow-inner overflow-hidden cursor-pointer">

                                        <div className="relative flex bg-gray-100 w-40 h-40 md:w-48 md:h-48 items-center justify-center overflow-hidden shadow-md cursor-pointer">
                                            <span className="absolute">
                                                <img src={value.thumbnail} alt="" />
                                            </span>                                                                                    
                                            <span className="block rounded-full shadow">
                                                <MemoryPlaceholder />
                                            </span>
                                            <div className="opacity-0 hover:opacity-100 absolute w-full h-full flex items-center justify-center top-0 bg-black bg-opacity-40 text-white gap-4 duration-200">
                                                <div>
                                                    <ImBin2 size={20} onClick={() => removeItem(index, value.access_token, value.thumbnail)} />
                                                </div>
                                                <div>
                                                    <AiFillEdit size={20} onClick={() => getEditData(value.access_token)} />
                                                </div>
                                            </div>
                                        </div>

                                    </div>

                                    <p className="mt-3 absolute w-full text-center"> {value.name} </p>

                                    </div>
                                                                
                                                        
                                )
                            })}


                        </div>
                    </div>
                </section>
                <Modal title="Alert" visible={isModalVisible} onOk={handleOk} onCancel={handleCancel} okText={'Delete Memory'} cancelText={'Cancel'} okButtonProps={{type:'primary'}} cancelButtonProps={{type:'default '}} footer={[
                    <button key="submit" className="primary" type="primary" loading={loading} onClick={handleOk}>
                        Delete Memory
                    </button>,
                    <button className="secondary" key="back" onClick={handleCancel}>
                        Cancel
                    </button>
                ]} className="delete-modal">
                    <div  className="memory-thumbnail w-40 h-40 rounded-full shadow-inner overflow-hidden cursor-pointer mx-auto">
                        <img src={deleteImage} alt=""/>
                    </div>
                    <h2>Are you sure you want to delete this Memory?</h2>
                    <p>This action cannot be undone. Once deleted all data associated with this memory will be deleted as well.</p>
                </Modal>
            </Spin>
            
        </>
    )
}
export default YourMemories
