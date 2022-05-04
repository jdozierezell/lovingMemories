import React, { useState, useEffect } from "react"
import { Link } from "gatsby"

import { isLoggedIn, getCurrentUser, logout } from "../../utils/auth"

import { VscArrowSmallLeft } from 'react-icons/vsc';
import { VscClose } from 'react-icons/vsc';
import { AiOutlineClose } from 'react-icons/ai';

import { useStateMachine } from "little-state-machine"
import updateAction from "../../utils/updateAction"

import { navigate } from "gatsby"

const HeaderClose = ({toLink, goBack, gobackUrl}) => {

   let userDetails = {};

    const [canGoBack, setCanGoBack] = useState(false);

    const { state, actions } = useStateMachine({ updateAction });

    const newLink = "/app/add-memory" + gobackUrl

    const callback = () => {
    
    }

    const handleSignOut = () => {
    logout(callback)
    navigate("/")

    let data = []
    data.access_token = "";
    data.name = "";
    data.loving = "";
    data.cover_image = null;
    data.photos = [];
    data.description = "";
    data.favorites = [];
    data.special_dates = [];
    data.reminder = 0;
    data.friends = [];
    data.id = null;
    data.user_id = null;
    data.status_id = null;
    data.active = null;
    data.visible_type = "public";
    data.user = {
      name: "",
      email: "",
      all_memory_reminder: 0,
      receive_afsp_resources: 0,
    };
    data.theme_color = "";
    data.thumbnail = "";
    data.prevFrom = 0;
    actions.updateAction(data);
  }

    useEffect(() => {
      
      setCanGoBack(goBack);
      let getUserDetails = getCurrentUser();
      if(getUserDetails.user === undefined) {
        logout(callback);
      } else {
        
      }

  }, [])


    return (
        <div>
      <nav className="absolute w-full flex md:flex-wrap items-center justify-between p-3 bg-transparent z-10">
      <div className="flex items-center">
        {(canGoBack) ? (
          <span>
            <Link to={newLink}>
              <div className="border-2 border-black rounded-full cursor-pointer bg-white p-1 text-black flex item-center justify-center mr-5"> 
                <VscArrowSmallLeft size={30} />
              </div>
            </Link>
          </span>
        ) : (
          <></>
        )}

       
        <span>
            
            <Link to={toLink}>
                <div className="close-btn bg-transparent rounded-full p-4 cursor-pointer border-2 border-black z-10 text-black">
                    <VscClose size={30} />
                </div>
             </Link>
         
        </span>
      </div>
      <div className="block lg:hidden">
       
      </div>
      <div
        className="flex items-center justify-items-center w-auto"
      >
        
        
      </div>
    </nav>
        </div>
    )
}

export default HeaderClose
