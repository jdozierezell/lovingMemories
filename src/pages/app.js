import React from "react"
import { Router } from "@reach/router"

import Layout from "../components/Layout"
import Login from "../components/Login"
import PreviewMemory from "../components/PreviewMemory"
import AddToMemory from "../components/AddToMemory"

import AddDates from "../components/AddMemory/AddDates"
import AddDescription from "../components/AddMemory/AddDescription"
import AddMedia from "../components/AddMemory/AddMedia"
import AddMemories from "../components/AddMemory/AddMemories"
import AddFriends from "../components/AddMemory/AddFriends"
import ReviewFriendMemory from "../components/AddMemory/ReviewFriendMemory"

import AddFriendMemory from "../components/AddFriendMemory"
import FriendSubmitted from "../components/FriendSubmitted"

import VerifyAccount from "../components/VerifyAccount"
import ResetPassword from "../components/ResetPassword"

import AddWhoCanSee from "../components/AddMemory/AddWhoCanSee"
import Preview from "../components/AddMemory/Preview"

import Submitted from "../components/AddMemory/Submitted"
import Notifications from "../components/AddMemory/Notifications"
import Memories from "../components/AddMemory/YourMemories"

import AddMemoryDetails from "../components/AddMemory/AddMemoryDetails"
import UpdateMemoryOf from "../components/AddMemory/UpdateMemoryOf"
import AddMoreMedia from "../components/AddMemory/pictureWall"

import AccountSettings from "../components/AddMemory/AccountSettings"

import PrivateRoute from "../components/PrivateRoute"

import { StateMachineProvider, createStore } from "little-state-machine";
import { DevTool } from 'little-state-machine-devtools';

import "../components/AddMemory/memory.css";
import YourMemories from "../components/AddMemory/YourMemories"



createStore({
  data: {        
        auth_token:"",
        access_token:"",
        name:"",
        loving:"", 
        cover_image:null,            
        photos:[],
        description:"",
        favorites:[],
        friend_favorites:[],
        special_dates:[],
        reminder:0,
        friends:[],
        id:null, 
        user_id:null,
        status_id:null,
        active:null,
        visible_type:"public",
        user:{
          name:'',
          email:'',
          all_memory_reminder:0,
          receive_afsp_resources:0
        },
        theme_color:"",
        thumbnail:"",     
        prevFrom:0
  }
})

const App = () => (

  <StateMachineProvider>
    {/* <DevTool /> */}

      <Layout>    
        <Router>

          <PrivateRoute path="/app/add-memory" component={AddMemoryDetails} />
          <PrivateRoute path="/app/add-memory/in-memory-of" component={UpdateMemoryOf} />
          <PrivateRoute path="/app/add-memory/add-media" component={AddMedia} />
          <PrivateRoute path="/app/add-memory/add-more-media" component={AddMoreMedia} />
          <PrivateRoute path="/app/add-memory/add-description" component={AddDescription} />
          <PrivateRoute path="/app/add-memory/add-memories" component={AddMemories} />
          <PrivateRoute path="/app/add-memory/add-dates" component={AddDates} />
          <PrivateRoute path="/app/add-memory/add-friends" component={AddFriends} />
          <PrivateRoute path="/app/add-memory/add-who-can-see" component={AddWhoCanSee} />
          <PrivateRoute path="/app/add-memory/preview" component={Preview} />
          <PrivateRoute path="/app/add-memory/submitted" component={Submitted} />
          <PrivateRoute path="/app/your-memories" component={Memories} />
          <PrivateRoute path="/app/review-friend-memory" component={ReviewFriendMemory} />
          <PrivateRoute path="/app/notifications" component={Notifications} />
          <PrivateRoute path="/app/account-settings" component={AccountSettings} />
          
          <Login path="/app/login" /> 
          <PreviewMemory path="/view-memory" />
          <AddToMemory path="/app/add-to-memory" />
          <AddFriendMemory path="/add-friend-memory" />
          <FriendSubmitted path="/submitted-friend-memory" />
          <VerifyAccount path="/verify" />
          <ResetPassword path="/reset-password" />

        </Router>
      </Layout>

  </StateMachineProvider>
)

export default App
