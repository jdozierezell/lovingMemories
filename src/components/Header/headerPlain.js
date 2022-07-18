import { Link } from "gatsby"
import PropTypes from "prop-types"
import React, { useState, useEffect } from "react"
import { StaticImage } from "gatsby-plugin-image"
import {
  handleAPIPost,
  isLoggedIn,
  getCurrentUser,
  logout,
} from "../../utils/auth"

import { Menu, Dropdown } from "antd"
import { InfoOutlined } from "@ant-design/icons"
import { AiFillMinusCircle } from "react-icons/ai"
import { navigate } from "gatsby"

import { useForm } from "react-hook-form"
import { useStateMachine } from "little-state-machine"
import updateAction from "../../utils/updateAction"

import { VscArrowSmallLeft } from "react-icons/vsc"

const HeaderPlain = ({ title, goBack, gobackUrl }) => {
  const [isUserLoggedIn, setIsUserLoggedIn] = useState(isLoggedIn())
  const [memoryNotification, setMemoryNotification] = useState([])
  const [currentUserName, setCurrentUserName] = useState([])
  const { state, actions } = useStateMachine({ updateAction })
  const [canGoBack, setCanGoBack] = useState(false)

  const [userLetter, setUserLetter] = useState("I")

  const newLink = "/app/add-memory" + gobackUrl

  const {
    getValues,
    formState: { errors, isValid },
  } = useForm({
    mode: "onChange",
    defaultValues: state.data,
  })

  const menu = (
    <Menu>
      <Menu.Item style={{ padding: "10px 30px 0 30px" }} key="0">
        <span className="pointer-events-none text-xs text-gray-400">
          Loggin in as:
        </span>
        <p className="pointer-events-none text-sm text-gray-700">
          {currentUserName}
        </p>
      </Menu.Item>
      <Menu.Divider />
      <Menu.Item style={{ padding: "10px 30px" }} key="1">
        <Link to="/app/your-memories">Your memories</Link>
      </Menu.Item>
      <Menu.Item style={{ padding: "10px 30px", position: "relative" }} key="2">
        <Link to="/app/notifications">
          Notifications
          {memoryNotification == true ? (
            <span className="has-notification dropdown-nav"></span>
          ) : (
            <></>
          )}
        </Link>
      </Menu.Item>
      <Menu.Item style={{ padding: "10px 30px" }} key="3">
        <Link to="/app/account-settings">Settings</Link>
      </Menu.Item>
      <Menu.Divider />
      <Menu.Item
        onClick={() => handleSignOut(callback)}
        style={{ padding: "10px 30px" }}
        key="4"
      >
        Log out
      </Menu.Item>
      <Menu.Divider />
      <Menu.Item style={{ padding: "10px 30px 0 30px" }} key="5">
        <Link to="https://988lifeline.org/" target="_blank">
          <p className="pointer-events-none text-sm text-gray-700">
            If you are experiencing a crisis <br />
            <span className="pointer-events-none text-sm text-blue-700">
              Please get immediate help
            </span>
          </p>
        </Link>
      </Menu.Item>
    </Menu>
  )

  const handleSignOut = () => {
    logout(callback)
    navigate("/")

    let data = []
    data.access_token = ""
    data.name = ""
    data.loving = ""
    data.cover_image = null
    data.photos = []
    data.description = ""
    data.favorites = []
    data.special_dates = []
    data.reminder = 0
    data.friends = []
    data.id = null
    data.user_id = null
    data.status_id = null
    data.active = null
    data.visible_type = "public"
    data.user = {
      name: "",
      email: "",
      all_memory_reminder: 0,
      receive_afsp_resources: 0,
    }
    data.theme_color = ""
    data.thumbnail = ""
    data.prevFrom = 0
    actions.updateAction(data)
  }

  const handleNotificationReadSuccess = data => {
    //console.log(data);
    let unread = 0

    setMemoryNotification(data.show_notification)
  }

  const handleNotificationReadErrors = data => {
    console.log("error")
  }

  const callback = () => {
    setIsUserLoggedIn(isLoggedIn())
  }

  useEffect(() => {
    setCanGoBack(goBack)
    let getUserDetails = getCurrentUser()
    if (getUserDetails.user === undefined) {
      logout(callback)
    } else {
      setCurrentUserName(getUserDetails.user)
      setUserLetter(getUserDetails.user.charAt(0).toUpperCase())
    }
  }, [])

  return (
    <div className="lg:mb-10">
      <div
        className={`flex items-center justify-between p-4 ${
          isUserLoggedIn ? "bg-white " : ""
        }`}
      >
        <div className="flex items-center">
          {canGoBack ? (
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

          <h5>{title}</h5>
        </div>

        <div className="flex items-center justify-end">
          {isUserLoggedIn ? (
            <Dropdown overlay={menu} trigger={["click"]}>
              <a
                className="ant-dropdown-link menu-btn "
                onClick={e => e.preventDefault()}
              >
                <span className="pt-1 transform -rotate-90 bg-blue-500 text-white w-10 h-10 rounded-full flex items-center justify-center text-lg font-bold">
                  {userLetter}
                </span>
              </a>
            </Dropdown>
          ) : (
            <Link to="/app/login">
              <button className="btn-signin inline-block px-4 py-1 w-20 md:w-auto text-xs md:text-lg leading-none bg-white text-blue-500 border border-blue-500 rounded-full hover:border-transparent hover:text-white hover:bg-blue-500 lg:mt-0">
                Sign In
              </button>
            </Link>
          )}
        </div>
      </div>
    </div>
  )
}

export default HeaderPlain
