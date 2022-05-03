import React, { useState, useEffect } from 'react'

import Header from "./Header/headerFriendMemory"

import "antd/dist/antd.css";

import "./AddMemory/styles.css";

import { useForm } from "react-hook-form";
import { useStateMachine } from "little-state-machine";
import updateAction from "../utils/updateAction";

import {baseImageURL, handleAPIFetch, handleAPIPostPublic} from "../utils/auth";

import { navigate } from "gatsby"
import ImagePlaceholder from "./ImagePlaceholder";
import { LoadingOutlined } from '@ant-design/icons';

import { Spin, Avatar, Card  } from 'antd';


const FriendSubmitted = props => {

    const { state, actions } = useStateMachine({ updateAction });
    const { formState: {errors, isValid} } = useForm({
        mode:"onChange",
        defaultValues: state.data
    });

    const [helpfulResources, setHelpfulResources] = useState([]);

    const { Meta } = Card;

    const [loading, setLoading] = useState(false);
    const loadingIcon = <LoadingOutlined style={{ fontSize: 50 }} spin />;

    const [friendData, setFriendData] = useState({});

    const handleResourceSuccess = data => {
        
        setLoading(false);
        setHelpfulResources(data.helpful_resources);
    }

    const handleResourceErrors = data => {
        console.log("error");
        setLoading(false);
    }

    const handleTokenSuccess = data => {
        setLoading(false);

        let newData = {
            name: data.memory.name,
            thumbnail: data.memory.cover_image
        }
        //actions.updateAction(newData);
        setFriendData(newData)
    }

    const handleTokenErrors = data => {
        console.log("error")
        setLoading(false);
    }

     useEffect(() => {
    
        setLoading(true);
         let search = window.location.search;
         let params = new URLSearchParams(search);
         let friendToken = params.get('token');
         let details = {
             "access_token": friendToken
         }
        handleAPIPostPublic('friend/memory/info', details, handleTokenSuccess, handleTokenErrors);
        handleAPIFetch('helpful-resources', handleResourceSuccess, handleResourceErrors);
        

    }, []);

    return (
        <>


            <Header goBack={true}  title={`Memory submitted for ${friendData.name}`} gobackUrl={'/'}/>
            <Spin spinning={loading} indicator={loadingIcon}>
            <section>
                
                <div className="px-20 mt-10 text-center">
                        
                        <div className="flex items-center justify-center mb-2">
                            <img className="absolute max-w-xs rounded-full shadow" src={friendData.thumbnail} alt="" />
                            <ImagePlaceholder />
                        </div>

                        <h2 className="text-4xl block text-gray-900 pt-5">
                            Your Memory of <span className="capitalize ">{friendData.name}</span> has been submitted
                        </h2>
                        <label className="text-lg block text-gray-900 pb-8">
                            Your memory has been sent for approval, we will reach out once it is posted.
                        </label>

                        <label className="text-lg block text-gray-900 pt-5 pb-5">
                            Helpful resources to aid in your healing
                        </label>
                    
                        <div className="helpful-resource-panel flex flex-wrap items-center justify-center gap-4 mx-auto">

                            {helpfulResources.map((value,index) => {                                                              
                            return (
                                <div key={index}>
                                        
                                    <div className="flex items-center justify-center lg:justify-end text-left">
                                        <Card
                                            bordered={false}
                                            style={{ width: 300 }}
                                            cover={<img alt="example"  src={value.image} />}
                                        >
                                            <Meta title={value.name} />
                                            <a href={value.url}>Learn more</a>
                                        </Card>
                                    </div>

                                </div>
                                )
                            })}  

                        </div>
  
                    </div>             
                
            </section>
        </Spin>  
            
                      
        </>
    )
}

export default FriendSubmitted
