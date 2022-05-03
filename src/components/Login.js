import React, {  useState, useRef, useEffect  } from 'react'

import { navigate } from "gatsby"

import View from "./View"

import Header from "../components/Header/modal"
import SignInForm from "./Form/SignInForm"
import ForgotPasswordForm from "./Form/ForgotPassword"

import { FcGoogle } from 'react-icons/fc';
import { ImFacebook } from 'react-icons/im';

import {logout, setCurrentUser, setCurrentUserName, getCurrentUser, handleAPIPost, userCheck } from "../utils/auth"

import { LoadingOutlined } from '@ant-design/icons';

import FacebookLogin from 'react-facebook-login/dist/facebook-login-render-props'
import GoogleLogin from 'react-google-login';

import { useForm, Controller  } from "react-hook-form";
import { useStateMachine } from "little-state-machine";
import updateAction from "../utils/updateAction";

import { Spin } from 'antd';


const Login = () => {

  const { state, actions } = useStateMachine({ updateAction });
     const { getValues } = useForm({
         mode:"onChange",
        defaultValues: state.data
  });

  let userDetails = {};

  let socialValues = {};


  const values = getValues();

  const [error, setError] = useState("");
  const [imported, setImported] = useState(0);

  const [loading, setLoading] = useState(false);

  const loadingIcon = <LoadingOutlined style={{ fontSize: 50 }} spin />;

  const [formType, setFormType] = useState("signIn");

  const childFunc = useRef(null)

  let currentUserInfo = '';

  const setUserToken = (token, data, userID) => {

     setCurrentUser({
      user :userID,
      token:token
    });

  }
  const handleSignIn = details => {

    setLoading(true);
    socialValues = details;
    setImported(0);
    setError("");
    handleAPIPost('login', details, '', handleSuccess, handleErrors);  
  }

  const handleSuccess = (data) => {

    setLoading(false);
    setUserToken(data, socialValues, socialValues.email);
    navigate('/');
  }

  const handleForgotPass = details => {

    setLoading(true);
    setImported(0);
    setError("");
    handleAPIPost('password/email', details, '', handleForgotSuccess, handleForgotFail);  

  }

  const handleForgotSuccess = (msg) => {

    setLoading(false);

    ////console.log(msg);
    //setError(msg.message);
    childFunc.current();
  }

  const handleForgotFail = (msg) => {

    setLoading(false);

    ////console.log(msg);    
    childFunc.current();
  }

  const handleErrors = (val) => {

    setLoading(false);

    let errorTxt = "";
    if(val.is_imported === 1) {
      setImported(val.is_imported);
      setError('We have upgraded our system with added privacy and customization options. If you would like an account to take advantage of these new features, click Forgot Password to set a password for your email address.');
    }
    else {
      if(val.error !== undefined) {
        errorTxt = val.error[0];
        setError(errorTxt);
      }
      else {
        errorTxt = val.message;
        setError(errorTxt);
      }
    }


    childFunc.current()

  }

  const responseFacebook = (response) => {

    setLoading(true);

    ////console.log(response);
    socialValues = response;
    
    let details = {
      provider : 'facebook',
      access_token : response.accessToken
    }

    handleAPIPost('social/login/facebook', details, '', handleFaceBookSuccess, handleFaceBookFail);  
    
  }

  const handleFaceBookSuccess = (response) => {  

    setLoading(false);
    setUserToken(response, socialValues, socialValues.name);
    navigate('/');
  }

  const handleFaceBookFail = (response) => {

    setLoading(false);
  }

  const responseGoogle = (response) => {

    setLoading(true);
    socialValues = response;

    let details = {
      provider : 'google',
      access_token : response.accessToken
    }
    

    handleAPIPost('social/login/google', details, '', handleGoogleSuccess, handleGoogleFail);

  }

    const handleGoogleSuccess = (response) => {  

      setLoading(false);
      setUserToken(response, socialValues, socialValues.profileObj.email);
      navigate('/');

    }

    const handleGoogleFail = (response) => {

      setLoading(false);
    }

    useEffect(() => {        

     // //console.log(userCheck(userDetails));
        
    }, []);


  return (
    <View>

      <Header />

      {(loading) ? (
         
          <div className="absolute flex justify-center items-center top-0 left-0 w-screen h-screen bg-white bg-opacity-50 z-20"> 
            <Spin spinning={loading} indicator={loadingIcon}></Spin>
          </div>
       
      ) : (
        <></>
      )}


      <div className="md:flex md:items-center md:justify-items-center md:h-screen px-2 md:px-10">

          <div className="login-box block mx-auto w-full text-center max-w-lg mb-10 md:shadow rounded px-6 md:p-14">

            {/* Header block for form */}
            {(formType === "signIn") ? (
              <div className="mb-4 md:mb-10 flex items-center justify-center ">
                <h2 className='my-0 text-3xl'>Sign In</h2> <h2 className="mx-2 my-2 text-3xl">or</h2> <h2 className='my-0 text-3xl'>Sign Up</h2>
              </div>
              
            ) : (
              <h2 className=" mb-4 md:mb-10"> Forgot Password</h2>
            )}
            
            {/* Info block for form */}
            {(error.length > 2 && imported !== 1) ? (
              <p className={`text-black p-5  ${(formType !== "signIn") ? 'bg-green-200' : 'bg-red-200'} `}>{error}</p>
            ) : (
              <></>
            )}
            {/* Info block for imported form */}
            {(imported > 0) ? (
              <p className={`text-black p-5  ${(formType !== "signIn") ? 'bg-green-200' : 'bg-blue-200'} `}>{error}</p>
            ) : (
              <></>
            )}

            

            {/* Form selection block for form */}
            {(formType === "signIn") ? (
                <>                  
                  <SignInForm handleSignIn={handleSignIn} childFunc={childFunc} />
                  <button onClick={() => { setFormType("forgotpassword"); setError("");setImported(0); }} className="cursor-pointer w-full text-center md:text-right text-blue-500" >Forgot Password?</button>
               </>
            ) : (
              <>                
                <ForgotPasswordForm handleForgotPass={handleForgotPass} childFunc={childFunc} />
                <button onClick={() => { setFormType("signIn"); setError("");setImported(0); }} className="cursor-pointer w-full text-center md:text-right mt-2 text-blue-500" >Sign In?</button>
              </>
            )}

          {/* Social Login Block */}
          
          <p className="mb-0 md:mb-6">or</p>

          <p className='block text-md sm:hidden'>Continue With</p>

          <div className='w-full'>

            <FacebookLogin
            
              appId="524145762003495"              
              callback={responseFacebook}
              render={renderProps => (                
                <button onClick={renderProps.onClick.bind(this)} className='mb-6 flex items-center justify-center w-full bg-white rounded-full border-2 border-black hover:bg-blue-500 hover:text-white hover:border-blue-500' type="button">
                  <ImFacebook size={20} className="" /> <span className='hidden sm:block mx-8 md:mx-20 md:w-3/6'>Continue With Facebook</span>
                </button>
              )}
            />

            <GoogleLogin
              clientId="957292308099-rrp4tqorllt47gd5gad2nn9ivcu1hdf6.apps.googleusercontent.com"
              autoLoad={false}
              render={renderProps => (
               
                  <button onClick={renderProps.onClick.bind(this)} disabled={renderProps.disabled} className='mb-6 flex items-center justify-center w-full bg-white rounded-full border-2 border-black hover:bg-blue-500 hover:text-white hover:border-blue-500' type="button">
                    <FcGoogle size={20}  /> <span className='hidden sm:block mx-8 md:mx-20 md:w-3/6' >Continue With Google</span> 
                  </button>
               
              )}              
              onSuccess={responseGoogle}
              onFailure={responseGoogle}
              cookiePolicy={'single_host_origin'}
            />

            </div>
    
        </div>

      </div>

     
    </View>
  )
}

export default Login
