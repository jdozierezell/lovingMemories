import React, {useState, useRef, useEffect} from 'react'

import Header from "../Header/headerFriendMemory"


import { useForm } from "react-hook-form";
import { useStateMachine } from "little-state-machine";
import updateAction from "../../utils/updateAction";

import "antd/dist/antd.css";

import { navigate } from "gatsby";

import { Avatar, Spin, Card } from 'antd';
import { IoIosAdd } from 'react-icons/io';
import { HiOutlinePlus } from 'react-icons/hi';
import { LoadingOutlined } from '@ant-design/icons';
import {
    getCurrentUser,
    handleAPIPost,
    handleAPIPostPublic,
    logout,
    setCurrentUser,
    setCurrentUserName
} from "../../utils/auth";
import { DeleteOutlined } from '@ant-design/icons';
import ImagePlaceholder from "../ImagePlaceholder";


const AddUserMemories = props => {

    const { state, actions } = useStateMachine({ updateAction });

    const { register, handleSubmit, reset, formState: {errors, isValid} } = useForm({
        mode:"onChange",
        defaultValues: state.data
    });


    const [favorites, setFavorites] = useState([]);

    const [imageVal, setImageVal] = useState();

    const [loading, setLoading] = useState(true);

    const loadingIcon = <LoadingOutlined style={{ fontSize: 50 }} spin />;

    const [userName, setUserName] = useState("");
    const [friendData, setFriendData] = useState({});
    const [friendReviewData, setFriendReviewData] = useState({});



    const handleSuccess = data => {
        setLoading(false);
        //console.log(data)
        let search = window.location.search;
        let params = new URLSearchParams(search);
        let friendToken = params.get('token');
        navigate("/submitted-friend-memory?token=" + friendToken);
    }

    const handleErrors = data => {
        setLoading(false);
    }

    const handleTokenSuccess = data => {
        setLoading(false);

        let newData = {
            name: data.memory.name,
            thumbnail: data.memory.cover_image
        }
        actions.updateAction(newData);
        setFriendData(newData)
    }

    const handleTokenErrors = data => {
        setLoading(false);
    }

    const handleReviewSuccess = data => {
        setLoading(false);
        //console.log(data)
        let newData = {
            memory_access: data.data.memory_access_token,
            name: data.data.name,
            description: data.data.description,
            submitted_by: data.data.submitted_by,
            thumbnail: data.data.thumbnail,
            cover: data.data.image
        }
        actions.updateAction(newData);
        setFriendReviewData(newData)
    }

    const handleReviewErrors = data => {
        setLoading(false);
    }

    const handleDeleteSuccess = data => {
        setLoading(false);
        navigate("/app/notifications");
    }

    const handleDeleteErrors = data => {
        console.log("error")
        setLoading(false);
    }

    const handleApproveSuccess = data => {
        setLoading(false);
        navigate("/app/notifications");
    }

    const handleApproveErrors = data => {
        setLoading(false);
    }

    const renderButton = () => {
        return(
            <div className="memory-fields-footer flex relative mt-20 lg:mt-0 lg:fixed bg-white md:flex items-center justify-center w-full bottom-0 text-center p-8 md:border-t-2 ">
                <div className="mx-2 order-1">
                    <button onClick={removeFriendItem}
                        //disabled={(favorites.length < 1)}
                            className="flex flex-wrap items-center mx-auto justify-between px-8 py-3 mt-4 text-sm leading-none bg-transparent text-blue-600 border-2 border-blue-600 rounded-full hover:border-blue-600 hover:text-white hover:bg-blue-600 lg:mt-0 disabled:opacity-50" >
                        Delete Memory
                    </button>
                </div>
                <div className="mx-2 order-2">
                    <button onClick={addFriendItem}
                        //disabled={(favorites.length < 1)}
                            className=" flex flex-wrap items-center mx-auto justify-between px-8 py-3 mt-4 text-sm leading-none bg-blue-500 text-white border border-blue-500 rounded-full hover:border-blue-600 hover:text-white hover:bg-blue-600 lg:mt-0 disabled:opacity-50" >
                        Approve Memory
                    </button>
                </div>
            </div>
        )
    }
    let details = {}

    const addFriendItem = () => {
        let search = window.location.search;
        let params = new URLSearchParams(search);
        let friendToken = params.get('token');
        details = {
            'access_token':friendToken
        };
        /* API REQUEST HERE */
        setLoading(true);
        /* post to API */
        let getUserDetails = getCurrentUser();

        if (getUserDetails.user === undefined) {
            navigate("/");
        } else {
            handleAPIPost('memory/friend/approve', details, getUserDetails.token, handleApproveSuccess, handleApproveErrors);
        }

    }
    const removeFriendItem = () => {
        let search = window.location.search;
        let params = new URLSearchParams(search);
        let friendToken = params.get('token');
        //console.log(state.data)
        details = {
            'access_token':friendToken,
            'memory_access_token':friendReviewData.memory_access
        };
        /* API REQUEST HERE */
        setLoading(true);
        /* post to API */
        let getUserDetails = getCurrentUser();

        if (getUserDetails.user === undefined) {
            navigate("/");
        } else {
            handleAPIPost('memory/friend/delete', details, getUserDetails.token, handleDeleteSuccess, handleDeleteErrors);
        }


    }

    useEffect(() => {
        //getUser();
        let search = window.location.search;
        let params = new URLSearchParams(search);
        let friendToken = params.get('token');
        let details = {
            "access_token": friendToken
        };

        let getUserDetails = getCurrentUser();

        if (getUserDetails.user === undefined) {
            navigate("/");
        } else {
            handleAPIPostPublic('friend/memory/info', details, handleTokenSuccess, handleTokenErrors);
            handleAPIPost('memory/friend/review', details, getUserDetails.token, handleReviewSuccess, handleReviewErrors);
        }

    }, []);

    return (
        <Spin className="absolute top-0 left-0" spinning={loading} indicator={loadingIcon}>
            <Header goBack={true} title={`Review memory for ${friendReviewData.name}`} gobackUrl={'/in-memory-of'}/>
            <section className={''} >
                <div className="px-14 block mx-auto w-full text-center max-w-3xl">

                    <span className="flex items-center justify-center mb-5 w-32 h-32 text-center mx-auto rounded-full overflow-hidden">
                        <span className="block rounded-full max-w-xs">
                                <ImagePlaceholder />
                            </span>
                        <img src={friendData.thumbnail} alt="" className="absolute top-0  z-10 w-32 h-32 max-w-xs" />
                    </span>
                    <h4 className="block pb-10 mt-5 text-center">A memory of <span className="capitalize ">{friendReviewData.name}</span></h4>

                    <p>Submitted By: <b>{friendReviewData.submitted_by}</b></p>
                    <p>{friendReviewData.description}</p>
                    <img src={friendReviewData.cover} alt="" className="z-10 w-full max-w-3xl" />

                </div>
                {renderButton()}
            </section>
        </Spin>
    )
}

export default AddUserMemories
