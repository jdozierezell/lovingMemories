import {Link, navigate} from "gatsby"
import PropTypes from "prop-types"
import React, { useState, useEffect } from "react"
import { isLoggedIn, getCurrentUser, logout } from "../../utils/auth"

import { useStateMachine } from "little-state-machine";
import updateAction from "../../utils/updateAction";

function Main({ siteTitle, isMemoryEdit }) {  

  const [isExpanded, toggleExpansion] = useState(false)
  const [ isUserLoggedIn, setIsUserLoggedIn ] = useState(isLoggedIn)
  const { state, actions } = useStateMachine({ updateAction });

  const handleSignOut = () => {
    logout(callback)
    navigate("/");
    
    let data = [];
    data.access_token="";
    data.name="";
    data.loving=""; 
    data.cover_image=null;            
    data.photos=[];
    data.description="";
    data.favorites=[];
    data.special_dates=[];
    data.reminder=0;
    data.friends=[];
    data.id=null; 
    data.user_id=null;
    data.status_id=null;
    data.active=null;
    data.visible_type="public";
    data.user={
      name:'',
      email:'',
      all_memory_reminder:0,
      receive_afsp_resources:0
    };
    data.theme_color="";
    data.thumbnail=""; 
      data.prevFrom = 0;    

    actions.updateAction(data);

    window.location.reload();
    
  }

  const handleCancel = () => {
      navigate("/");
  }
  
  const callback = () => {
    
  }

  useEffect(() => {        

      let getUserDetails = getCurrentUser();
      if(getUserDetails.user === undefined) {
        logout(callback);
      }

        
    }, []);

  return (
    <nav className="relative w-full flex md:flex-wrap items-center justify-between px-5 md:px-20 py-6 bg-transparent z-10">
      <div className="flex items-center">
        <h5>
          Add a new memory
        </h5>
      </div>
      <div className="block lg:hidden">
        <button
          onClick={() => toggleExpansion(!isExpanded)}
          className="flex items-center px-3 py-2 text-white border border-white rounded hover:text-white hover:border-white"
        >
          <svg
            className="w-3 h-3 fill-current"
            viewBox="0 0 20 20"
            xmlns="http://www.w3.org/2000/svg"
          >
            <title>Menu</title>
            <path d="M0 3h20v2H0V3zm0 6h20v2H0V9zm0 6h20v2H0v-2z" />
          </svg>
        </button>
      </div>
      <div
        className="flex items-center justify-items-center w-auto"
      >
        
        <div>

          {(isUserLoggedIn) ? (

          <button
            onClick={() => handleCancel()}
            className="inline-block px-8 py-2 w-20 md:w-auto menu-cancel md:text-lg leading-none bg-white text-blue-500 border border-transparent rounded-full hover:border-transparent hover:text-black hover:bg-transparent lg:mt-0"
          >
            Cancel
          </button>          

          ) : (

  <Link to="/app/profile">
          <button
            className="btn-signin inline-block px-0 md:px-4 py-2 w-20 md:w-auto text-xs md:text-lg leading-none bg-white text-blue-500 border border-blue-500 rounded-full  hover:text-white hover:bg-blue-500 lg:mt-0"
          >
            Sign In
          </button>
          </Link>
          )}

          


        </div>
      </div>
    </nav>
  )
}

Main.propTypes = {
  siteTitle: PropTypes.string,
}

Main.defaultProps = {
  siteTitle: ``,
}

export default Main
