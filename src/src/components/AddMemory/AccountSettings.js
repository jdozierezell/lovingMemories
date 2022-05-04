import React, {useState, useEffect} from 'react'

import HeaderNav from "../Header/headerWithNav"
import SideComponent from "./memory-side"

import { useForm } from "react-hook-form";
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';

import { useStateMachine } from "little-state-machine";
import updateAction from "../../utils/updateAction";
import {handleAPIPost, getCurrentUser, logout} from "../../utils/auth";
import { navigate } from "gatsby";
import { Spin, Input, message, AutoComplete  } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';


const AccountSettings = props => {

    const getUser = () =>
    window.localStorage.userData
        ? JSON.parse(window.localStorage.userData)
        : {}

    const validationSchema = Yup.object().shape({
        password: Yup.string()
            .required('Password is required')
            .min(6, 'Password must be at least 6 characters'),
        confirmPassword: Yup.string()
            .required('Confirm Password is required')
            .oneOf([Yup.ref('password')], 'Passwords must match')
            
    });

   
        
    const { state, actions } = useStateMachine({ updateAction });

     const formOptions = {     
         mode:"onChange"
        };

    const {register, handleSubmit, reset, getValues, setValue, formState: {errors, isValid} } = useForm(formOptions);

    const [loading, setLoading] = useState(false);
    const [currentUserName, setCurrentUserName] = useState([]);
    const [updatePassword, setUpdatePassword] = useState(false);

    const loadingIcon = <LoadingOutlined style={{ fontSize: 50 }} spin />;

    const handleSuccess = (data) => {
        
        let newData=state.data;
        newData.access_token=data.memory_access_token;        
        actions.updateAction(newData);

        message.success("Settings updated successfully");
        setLoading(false);
    }

    const handleErrors = () => {
       
        setLoading(false);
        message.error("Settings update failed");
    }
    
    const onSubmit = data => {

        setLoading(true);

        let emailVar = getValues("email");
        let passwordVar = getValues("password");
        
        let access_token = state.access_token;       

        let values = {
                'access_token':access_token,
                'email':emailVar,
                'password':passwordVar
        }

        handleAPIPost('user/update', values, state.data.auth_token, handleSuccess, handleErrors); 

    
        return false;
    };

    const updateCurrPassword = () =>{
        setUpdatePassword(true);
        setValue("password", "");
    }

    const renderButton = () => {            
        return(
            <div className="relative flex justify-center gap-4 bg-white w-full bottom-0 xs:bottom-10 left-0 text-center p-8">
               
                <div className="mx-2 order-2">
                    <button                   
                    disabled={!isValid}                    
                        className=" flex flex-wrap items-center mx-auto justify-between px-8 py-3 mt-4 text-sm leading-none bg-blue-500 text-white border border-blue-500 rounded-full hover:border-blue-600 hover:text-white hover:bg-blue-600 lg:mt-0 disabled:opacity-50" >
                        Update Settings
                    </button>
                </div>
                
            </div>
        )
    }
 

    useEffect(() => {

        let data = [];
        data.auth_token=getUser().token;
        actions.updateAction(data);
        //console.log(state.data)
        let getUserDetails = getCurrentUser();
        if (getUserDetails.user === undefined) {


        } else {
            setCurrentUserName(getUserDetails.user);
            setValue("email", getUserDetails.user);
        }


    }, []);

    return (
 

        <div className="w-full overflow-hidden">
            <Spin spinning={loading} indicator={loadingIcon}>
               <HeaderNav />

                    <section className="grid grid-cols-1 gap-4 max-w-screen-lg mx-auto">

                            <div>
                               
                                <form onSubmit={handleSubmit(onSubmit)}>   
                                       <div className="px-5 mt-20 mb-0 md:px-20 md:mt-40 md:mb-10">

                                         <h3 className="text-center block text-gray-900 pt-10 pb-5">
                                                Settings
                                        </h3>

                                        <div className="mt-10 lg:mt-20">

                                            <div className="w-full mb-8">
                                                <label className="text-lg block text-gray-700 font-bold mb-5" htmlFor="your_email">
                                                    Email
                                                </label>
                                                <input 
                                                    
                                                    className="border-b border-0 appearance-none w-full py-2 text-gray-700 leading-tight outline-none" 
                                                    id="email" 
                                                    name="email"
                                                    type="email"
                                                    value={currentUserName}
                                                    placeholder={currentUserName}
                                                    {...register("email")}                                     
                                                
                                                />
                                                
                                                {errors.your_email && (
                                                    <p className="text-red-500 text-sm mt-2">
                                                    Your email is Required
                                                    </p>
                                                )}                                
                                            </div>    

                                            <div className="w-full mb-8">
                                                <label className="text-lg block text-gray-700 font-bold mb-5" htmlFor="password">
                                                    {(updatePassword) ? (<>New</>) : (<></>)} Password
                                                </label>

                                                {(updatePassword)? (
                                                    <div className="flex items-center border-b border-0 ">
                                                    <input 
                                                        
                                                        className="appearance-none w-full py-2 text-gray-700 leading-tight outline-none"
                                                        id="password" 
                                                        name="password"
                                                        type="password" 
                                                        placeholder="Your Password"
                                                        {...register("password")}  
                                                    />
                                                </div>
                                                ) : (
                                                    <div className="flex items-center border-b border-0">
                                                    <input 
                                                        
                                                        className=" appearance-none w-full py-2 text-gray-700 leading-tight outline-none"
                                                        id="demo" 
                                                        name="demo"
                                                        type="password" 
                                                        placeholder="***********"
                                                      
                                                    />

                                                    
                                                    <div className="mx-2 order-2">
                                                        <button                   
                                                        onClick={()=>updateCurrPassword()}           
                                                            className=" flex flex-wrap items-center mx-auto justify-between px-2 py-3 mt-4 text-sm leading-none bg-transparent text-blue-500 rounded-full hover:text-blue-600 lg:mt-0 disabled:opacity-50" >
                                                            Update
                                                        </button>
                                                    </div>
                                                    
                                                    
                                                </div>
                                                )}


                                                
                                               
                                                <p className="text-red-500 text-sm mt-2">{errors.password?.message}</p>                         
                                            </div> 

                                            {(updatePassword) ? (

                                            <div className="w-full mb-8">
                                                <label className="text-lg block text-gray-700 font-bold mb-5" htmlFor="password_confirm">
                                                    Confirm New Password 
                                                </label>
                                                <input 
                                                    
                                                    className={` ${errors.password ? 'is-invalid' : ''} border-b border-0 appearance-none w-full py-2 text-gray-700 leading-tight outline-none`} 
                                                    id="confirmPassword" 
                                                    name="confirmPassword"
                                                    type="password" 
                                                    placeholder="Please confirm your password"           
                                                    {...register("confirmPassword")}                
                                                
                                                />
                                                
                                               <p className="text-red-500 text-sm mt-2">{errors.confirmPassword?.message}</p>                            
                                            </div>  

                                            ): (<></>)}

                                                                                  
                                        
                                        </div>

                                    </div>
                                    {renderButton()}
                                </form>
                                </div>
                          
                            
                    </section>

              

            </Spin>
        </div>
    )
}

export default AccountSettings
