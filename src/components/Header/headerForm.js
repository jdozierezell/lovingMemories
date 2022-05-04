import { Link } from "gatsby"
import PropTypes from "prop-types"
import React, { useState, useEffect } from "react"

import { isLoggedIn, getCurrentUser, logout } from "../../utils/auth"

import { useStateMachine } from "little-state-machine";
import updateAction from "../../utils/updateAction";

function HeaderAuth({ siteTitle }) {
  const [isExpanded, toggleExpansion] = useState(false)

  let userDetails = {};

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

  const callback = () => {
    
  }

  useEffect(() => {        

      
  }, []);

  return (
    <nav className="flex flex-wrap items-center justify-between p-4 mb-6 bg-gradient-to-r from-purple-400 via-pink-500 to-red-500">
      <div className="flex items-center flex-shrink-0 mr-6 text-white">
        <span className="text-xl font-semibold tracking-tight">
          {siteTitle}
        </span>
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
        className={`${
          isExpanded ? `block` : `hidden`
        } w-full block flex-grow lg:flex lg:items-center lg:w-auto`}
      >
        <div className="text-sm lg:flex-grow">
          <Link
            to={`/`}
            href="#responsive-HeaderAuth"
            className="block mt-4 mr-4 text-white lg:inline-block lg:mt-0 hover:text-white"
          >
            Home
          </Link>
        
        </div>
      </div>
    </nav>
  )
}

HeaderAuth.propTypes = {
  siteTitle: PropTypes.string,
}

HeaderAuth.defaultProps = {
  siteTitle: ``,
}

export default HeaderAuth
