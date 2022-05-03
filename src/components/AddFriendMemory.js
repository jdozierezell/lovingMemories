import React, {useState, useRef, useEffect} from 'react'

import Header from "../components/Header/headerFriendMemory"
import SideComponent from "./friend-memory-side"

import {useForm} from "react-hook-form";
import {useStateMachine} from "little-state-machine";
import updateAction from "../utils/updateAction";

import "antd/dist/antd.css";

import {navigate} from "gatsby";

import {Avatar, Spin, Card} from 'antd';
import {IoIosAdd} from 'react-icons/io';
import {HiOutlinePlus} from 'react-icons/hi';
import {LoadingOutlined} from '@ant-design/icons';
import {handleAPIPost, handleAPIPostPublic, setCurrentUser, setCurrentUserName} from "../utils/auth";
import {DeleteOutlined} from '@ant-design/icons'


const AddUserMemories = props => {

    const {state, actions} = useStateMachine({updateAction});

    const {register, handleSubmit, reset, formState: {errors, isValid}} = useForm({
        mode: "onChange",
        defaultValues: state.data
    });


    const [favorites, setFavorites] = useState([]);

    const [imageVal, setImageVal] = useState();

    const [loading, setLoading] = useState(true);

    const loadingIcon = <LoadingOutlined style={{fontSize: 50}} spin/>;

    const [userName, setUserName] = useState("");
    const [imageUrl, setImageUrl] = useState("");
    const [friendData, setFriendData] = useState({});

    const fileInputRef = useRef();

    const [charCount, setCharCount] = useState(0);

    const handleSuccess = data => {
        setLoading(false);
        //console.log(data)
        let search = window.location.search;
        let params = new URLSearchParams(search);
        let friendToken = params.get('token');
        navigate("/submitted-friend-memory?token=" + friendToken);
    }

    const handleErrors = data => {
        //console.log("error")
        setLoading(false);
    }

    const handleTokenSuccess = data => {
        setLoading(false);

        let newData = {
            name: data.memory.name,
            firstname: data.memory.name.split(" ")[0],
            thumbnail: data.memory.cover_image
        }
        actions.updateAction(newData);
        setFriendData(newData)
    }

    const handleTokenErrors = data => {
        //console.log("error")
        setLoading(false);
    }

    const handleChangeInput = e => {

        let file = e.target.files[0];
        const reader = new FileReader();
        reader.onloadend = (result) => {
            setImageVal(result.target.result)
        }
        reader.readAsDataURL(file);
    }

    const wordCount = e => {
        let currentText = e.target.value;
        let count = currentText.length;
        setCharCount(count);
    }

    const renderButton = () => {
        return (
            <div onClick={addFriendItem}
                 className="memory-fields-footer fixed mt-10 lg:mt-0 bg-white w-full bottom-0 text-center p-8 border-t-2 ">
                <button
                    //disabled={(favorites.length < 1)}
                    className="flex flex-wrap items-center mx-auto justify-between px-14 py-3 mt-4 text-sm leading-none bg-transparent text-blue-600 border-2 border-blue-600 rounded-full hover:border-blue-600 hover:text-white hover:bg-blue-600 lg:mt-0 disabled:opacity-50">
                    Submit Memory
                </button>
            </div>
        )
    }
    let details = {}
    const addFriendData = (data) => {
        //console.log('fired');
        let search = window.location.search;
        let params = new URLSearchParams(search);
        let friendToken = params.get('token');
        details = {
            'relationship': data.relationship,
            'description': data.name,
            'image': imageVal,
            'access_token': friendToken
        }
        handleAPIPostPublic('memory/friend/submit', details, handleSuccess, handleErrors);

    }
    const addFriendItem = () => {
        //console.log(details);
        /* API REQUEST HERE */
        setLoading(true);
        /* post to API */

    }

    useEffect(() => {
        //getUser();
        let search = window.location.search;
        let params = new URLSearchParams(search);
        let friendToken = params.get('token');
        let details = {
            "access_token": friendToken
        }
        //setUserToken(friendToken)
        handleAPIPostPublic('friend/memory/info', details, handleTokenSuccess, handleTokenErrors);

        // let getFavoritesData = state.data.favorites;
        // setFavorites(getFavoritesData);

    }, []);


    return (
        <Spin className="absolute top-0 left-0" spinning={loading} indicator={loadingIcon}>
            <Header goBack={true} title={`Add a memory for ${friendData.name}`} gobackUrl={'/in-memory-of'}/>
            <section className={'grid grid-cols-1 lg:grid-cols-2 gap-4'}>
                <div className="order-2 lg:order-1">
                    <form onSubmit={handleSubmit(addFriendData)}>
                        <div className="px-10 mt-10 h-screen lg:h-full">

                            <div className="grid grid-cols-1 gap-10">
                                <div className="w-full">
                                    <h4 className="text-2xl block text-gray-900 pb-5">
                                        What’s your relationship to <span
                                        className="capitalize ">{friendData.firstname}</span>
                                    </h4>
                                    <input
                                        maxLength={140}
                                        className="border-b-2 border-0 text-lg appearance-none w-full py-2 text-gray-900 leading-tight outline-none"
                                        id="relationship"
                                        name="relationship"
                                        type="text"
                                        placeholder="Your Relationship"
                                        {...register('relationship', {required: true})}
                                    />
                                    {errors.username && (
                                        <p className="text-red-500 text-sm mt-2">
                                            memory relationship is required
                                        </p>
                                    )}

                                </div>
                                <div className="w-full">
                                    <h4 className="text-2xl block text-gray-900 pb-5">
                                        Whats the greatest thing you remember about <span
                                        className="capitalize ">{friendData.firstname}</span>
                                    </h4>
                                    <textarea
                                        maxLength={140}
                                        className="border-b-2 border-0 text-lg appearance-none w-full py-2 text-gray-900 leading-tight outline-none"
                                        id="name"
                                        name="name"
                                        type="text"
                                        placeholder="Your Memory"
                                        {...register('name', {required: true})}
                                        onChange={e => wordCount(e)}
                                    />
                                    <span className="block w-full text-right">{charCount}/140</span>
                                    {errors.username && (
                                        <p className="text-red-500 text-sm mt-2">
                                            memory description is required
                                        </p>
                                    )}

                                </div>
                                <div className="w-full -mt-5 mb-8">
                                    <div className="flex flex-wrap">
                                        <button
                                            className="memory-fields-image-btn text-center mr-2 px-6 py-6 text-xs text-bold leading-none bg-transparent border-2 border-dashed border-gray-300 rounded-none"
                                            onClick={(e) => {
                                                e.preventDefault();
                                                fileInputRef.current.click();
                                            }}>
                                            <IoIosAdd className="mx-auto" size={30}/>
                                            <p className="mt-2">Add Photo Memory</p>
                                        </button>
                                        <button className="text-center mx-0" onClick={(e) => {
                                            e.preventDefault();
                                            fileInputRef.current.click();
                                        }}>
                                            <img className="w-auto h-40" src={imageVal} alt=""/>
                                        </button>
                                    </div>
                                    <input ref={fileInputRef} onChange={handleChangeInput} style={{display: "none"}}
                                           type="file" name="image" id="image"/>

                                </div>
                            </div>
                            {renderButton()}
                        </div>
                    </form>

                </div>
                <div className="order-1 lg:order-2">
                    <SideComponent
                        image={friendData.thumbnail}
                        text1={friendData.name}
                        text2={`You’ve been invited to submit a memory of ${friendData.firstname}. Add a memory that reminds you of the good times you had with your loved one.`}/>
                </div>
            </section>
        </Spin>
    )
}

export default AddUserMemories
