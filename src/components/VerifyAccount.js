import React, { useState, useEffect } from 'react'

import Header from "../components/Header/headerWithNav"

import "antd/dist/antd.css";

// import "./AddMemory/styles.css";


import { handleAPIGet} from "../utils/auth";

import { navigate } from "gatsby"

import { LoadingOutlined } from '@ant-design/icons';

import { Spin  } from 'antd';


const VerifyAccount = props => {

    const [loading, setLoading] = useState(false);
    const loadingIcon = <LoadingOutlined style={{ fontSize: 50 }} spin />;

    const [expired, setExpired] = useState(false);
    const [verification, setVerification] = useState(false);
    const [verificationStatus, setVerificationStatus] = useState("");

    const handleVerifySuccess = data => {
        setLoading(false);
        setVerification(true);
    }

    function handleVerifyErrors(data,response) {

        setLoading(false);
        ////console.log(data);
        if(response.status === 401){
            setExpired(true);
            setVerificationStatus('the expire time has exceeded its limit and you will be sent a new verification email shortly');
        }
        if(response.status === 404){
            setVerificationStatus('the hash value is not detected and you will be sent a new verification email shortly');
        }
    }


     useEffect(() => {

         setLoading(true);
         let search = window.location.search;
         if (!search) {
             let params = new URLSearchParams(search);
             let expires = params.get('expires');
             let hash = params.get('hash');
             let id = params.get('id');
             let signature = params.get('signature');

             handleAPIGet('email/verify?expires='+expires+'&hash='+hash+'&signature='+signature+'&id='+id, handleVerifySuccess, handleVerifyErrors);
         }

        

    }, []);

    return (
        <>


            <Header />
            <Spin spinning={loading} indicator={loadingIcon}>
                <section className="h-full">

                    <div className="px-20 text-center flex flex-col items-center justify-center h-full">
                        {(verification === true) ? (
                            <div className="flex flex-col items-center justify-center h-full">
                                <h1 className="block text-gray-900 pt-5">
                                    Thank-you!
                                </h1>
                                <p className="text-lg max-w-xl block mx-auto text-gray-900 pb-8">
                                    Your email has been successfully verified
                                </p>
                                <button onClick={() => navigate("/") } className="btn-solid mx-auto flex flex-wrap items-center justify-between px-8 py-3 mt-4 text-sm leading-none bg-blue-500 text-white border border-blue-500 rounded-full hover:border-blue-900 hover:bg-blue-900 hover:text-white hover:bg-afsp-blue-dark lg:mt-0">
                                    Continue
                                </button>
                            </div>
                        ) : (
                            <div className="flex flex-col items-center justify-center h-full">
                                <h1 className="block text-gray-900 pt-5">
                                    Sorry
                                </h1>
                                <p className="text-lg max-w-xl block mx-auto text-gray-900 pb-8">
                                    There was an issue with verification, {((expired === true) ? (<>{verificationStatus}</>):(<>{verificationStatus}</>))}.
                                </p>
                                <button onClick={() => navigate("/") } className="btn-solid mx-auto flex flex-wrap items-center justify-between px-8 py-3 mt-4 text-sm leading-none bg-blue-500 text-white border border-blue-500 rounded-full hover:border-blue-900 hover:bg-blue-900 hover:text-white hover:bg-afsp-blue-dark lg:mt-0">
                                    Continue
                                </button>
                            </div>
                        )}


                        </div>

                </section>
            </Spin>
            
                      
        </>
    )
}

export default VerifyAccount
