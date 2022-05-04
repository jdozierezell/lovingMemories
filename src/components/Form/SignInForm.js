import React from 'react'
import  { useState, useEffect } from "react";

import { CgSpinner } from 'react-icons/cg';

import './form.css'; // Import css modules stylesheet as styles



const SignInForm = ( { handleSignIn, childFunc }) => {

  const [details, setDetails] = useState({email:"", password:""});

  const [isLoaded, setIsLoading] = useState(false);

  const submitHandler = e => {
    e.preventDefault();  
    setIsLoading(true);
    handleSignIn(details);
  }

  const alertUser = () => {
     setIsLoading(false);
  } 

  useEffect(() => {
    childFunc.current = alertUser
  }, [])


  return (
        
      <form onSubmit={submitHandler} className="form-area bg-white">
        
        <div className="form-group flex items-center border-b border-blue-200 py-2">
          <input className="appearance-none bg-white border-none w-full text-gray-700 mr-0 py-4 px-3 leading-tight focus:outline-none" id="email" type="email" placeholder="email" onChange={ e => setDetails({...details, email: e.target.value}) } value={details.email} />
        </div>
       
        <div className="form-group flex items-center border-b border-blue-200 py-2">
          <input className="appearance-none bg-white border-none w-full text-gray-700 mr-0 py-4 px-3 leading-tight focus:outline-none" id="password" type="password" placeholder="password" onChange={ e => setDetails({...details, password: e.target.value}) } value={details.password} />
        </div>

        <div className="flex items-center justify-between mt-6">
          {(!isLoaded) ? (
            <input type="submit" value="Sign In" className="btn-solid cursor-pointer w-full bg-blue-500 hover:bg-blue-700 text-white text-sm md:text-lg font-bold px-8 py-3 rounded-full focus:outline-none focus:shadow-outline" />
          ) : (
            <div className=" w-full bg-blue-500 hover:bg-blue-700 text-white text-sm md:text-lg font-bold px-8 py-3 rounded-full focus:outline-none focus:shadow-outline">
              <CgSpinner icon="spinner" className="spinner mx-auto" color="white" size={30} />
            </div>          
          )}
          
        </div>
       
      </form>
  )
}

export default SignInForm
