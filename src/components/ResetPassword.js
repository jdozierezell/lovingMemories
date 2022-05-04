import React, { useState, useEffect } from 'react'

import Header from "../components/Header/headerWithNav"

import "antd/dist/antd.css";

import "./AddMemory/styles.css";

import {handleAPIPostPublic} from "../utils/auth";

import { navigate } from "gatsby"

import { LoadingOutlined } from '@ant-design/icons';

import {Spin, message} from 'antd';

import { Input, Space } from 'antd';

import { EyeInvisibleOutlined, EyeTwoTone } from '@ant-design/icons';


const VerifyAccount = props => {

    const [error, setError] = useState("");

    const [password, setPassword] = useState("");

    const [confirmPassword, setConfirmPassword] = useState("");

    const [loading, setLoading] = useState(false);

    const loadingIcon = <LoadingOutlined style={{ fontSize: 50 }} spin />;

    const [verification, setVerification] = useState(false);

    const handleSuccess = data => {
        setLoading(false);

        message.success("Password successfully changed");

        setTimeout(function() {
            navigate('/');
        }, 2000);

    }

    function handleErrors(data) {

        setLoading(false);
        setError("Sorry we ran into some issues, confirm you have an account before requesting");

    }
    const onSubmit = () => {


        setLoading(true);
        let search = window.location.search;
        let params = new URLSearchParams(search);
        let token = params.get('token');
        let email = params.get('email');
        let strongRegex = new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})");


        //console.log(strongRegex.test(password ));


        if (strongRegex.test(password ) === false || strongRegex.test(confirmPassword) === false) {

            setLoading(false);
            setError("Password must contain 8 characters & include 1 uppercase letter, 1 number & 1 special character")

        }
        else if(password !== confirmPassword) {
            setLoading(false);
            setError("Password fields must match");
        }
        else {

            setError("");

            setLoading(true);

            let values = {
                'token':token,
                'email':email,
                'password':password
            }

            handleAPIPostPublic('password/reset', values, handleSuccess, handleErrors);

        }


    };
    const renderButton = () => {
        return(
            <div className="relative flex justify-center gap-4 bg-white w-full bottom-0 xs:bottom-10 left-0 text-center p-8">

                <div className="mx-2 order-2">
                    <button onClick={onSubmit}
                            className=" flex flex-wrap items-center mx-auto justify-between px-8 py-3 mt-4 text-sm leading-none bg-blue-500 text-white border border-blue-500 rounded-full hover:border-blue-600 hover:text-white hover:bg-blue-600 lg:mt-0 disabled:opacity-50" >
                        Reset Password
                    </button>
                </div>

            </div>
        )
    }

    useEffect(() => {



        let search = window.location.search;
        let params = new URLSearchParams(search);
        let token = params.get('token');

        if(token != null ){

            setVerification(true);
            setLoading(false);
        }
        else if(token === null){
            setVerification(false);
            setLoading(false);
        }


    }, []);

    return (
        <>


            <Header />
            <Spin spinning={loading} indicator={loadingIcon}>
                <section className="h-full">

                    <div className="px-20 text-center flex flex-col items-center justify-center h-full">
                        {(verification === true) ? (


                            <div className="login-box block mx-auto w-full text-center max-w-lg mb-10 md:shadow rounded px-6 md:p-14">
                                <div className="flex flex-col items-center justify-center h-full">
                                    <h2 className="my-0 text-3xl">
                                        Reset your password
                                    </h2>
                                    {/* Info block for form */}
                                    {(error.length > 2) ? (
                                        <p className='text-black p-5 bg-red-200 my-6'>{error}</p>
                                    ) : (
                                        <></>
                                    )}

                                    <div className="flex w-full items-center ">
                                        <div className="mt-10 w-full">



                                            <div className="w-full mb-8">


                                                <div className="flex items-center border-b border-0 ">
                                                    <Input.Password bordered={false}
                                                                    className="appearance-none w-full py-2 text-gray-700 leading-tight outline-none"
                                                                    id="password"
                                                                    name="password"
                                                                    type="password"
                                                                    min="6"
                                                                    placeholder="New password"
                                                                    onChange={e => setPassword(e.target.value)}

                                                    />
                                                </div>


                                            </div>

                                            <div className="w-full mb-8">



                                                <Input.Password bordered={false}
                                                                className='border-b border-0 appearance-none w-full py-2 text-gray-700 leading-tight outline-none'
                                                                id="confirmPassword"
                                                                name="confirmPassword"
                                                                type="password"
                                                                min="6"
                                                                placeholder="Please confirm new password"
                                                                onChange={e => setConfirmPassword(e.target.value)}

                                                />




                                            </div>



                                        </div>
                                    </div>
                                    {renderButton()}

                                </div>
                            </div>


                        ) : (
                            <div className="flex flex-col items-center justify-center h-full">
                                <h1 className="block text-gray-900 pt-5">
                                    Help is on the way
                                </h1>
                                <p className="text-lg max-w-xl block mx-auto text-gray-900 pb-8">
                                    We've sent you an email with a password reset link, proceed to your emails to reset password.
                                </p>
                                <button onClick={() => navigate("/") } className="btn-solid mx-auto flex flex-wrap items-center justify-between px-8 py-3 mt-4 text-sm leading-none bg-blue-500 text-white border border-blue-500 rounded-full hover:border-blue-900 hover:bg-blue-900 hover:text-white hover:bg-afsp-blue-dark lg:mt-0">
                                    Home
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
