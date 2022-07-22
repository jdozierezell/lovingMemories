import React, { useState, useEffect } from "react"

import HeaderNav from "../Header/headerWithNav"

import "antd/dist/antd.css"
import "./memory.css"

import { useForm } from "react-hook-form"
import { useStateMachine } from "little-state-machine"
import updateAction from "../../utils/updateAction"
import { handleAPIPost } from "../../utils/auth"

import { LoadingOutlined } from "@ant-design/icons"

import { Layout, Spin, List, Avatar } from "antd"
import { navigate } from "gatsby"

import NotificationPlaceholder from "../NotificationPlaceholder"

const Notifications = props => {
  const { state, actions } = useStateMachine({ updateAction })
  const {
    watch,
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm({
    mode: "onChange",
    defaultValues: state.data,
  })

  const getUser = () =>
    window.localStorage.userData ? JSON.parse(window.localStorage.userData) : {}

  const [loading, setLoading] = useState(false)
  const loadingIcon = <LoadingOutlined style={{ fontSize: 50 }} spin />

  const [notificationData, setNotificationData] = useState([])

  const data = [
    {
      avatar: "https://joeschmoe.io/api/v1/random",
      title: "Frank Samuals Has a new submitted memory",
      description: "2 days ago",
    },
    {
      avatar: "https://joeschmoe.io/api/v1/random",
      title: "Frank Samuals Has a new submitted memory",
      description: "2 days ago",
    },
    {
      avatar: "https://joeschmoe.io/api/v1/random",
      title: "Frank Samuals Has a new submitted memory",
      description: "2 days ago",
    },
    {
      avatar: "https://joeschmoe.io/api/v1/random",
      title: "Frank Samuals Has a new submitted memory",
      description: "2 days ago",
    },
  ]

  const handleSuccess = data => {
    setLoading(false)
    setNotificationData(data.notifications)
    //console.log(notificationData);
    let details = {}
    handleAPIPost(
      "user/notifications/all/read",
      details,
      state.data.auth_token,
      handleNotiAllReadSuccess,
      handleNotiAllReadErrors
    )
  }

  const handleErrors = () => {
    console.log("error")
    setLoading(false)
  }

  const handleNotiAllReadSuccess = data => {
    //console.log(data)
  }

  const handleNotiAllReadErrors = () => {
    console.log("error")
  }

  const handleReadSuccess = data => {
    //console.log(data)
    setLoading(false)
  }

  const handleReadErrors = () => {
    console.log("error")
  }

  const checkItem = (token, id) => {
    console.log(token)
    let itemToken
    if (token.includes("/view-memory")) {
      itemToken = token.replace("view-memory/#", "")
      let itemID = {
        access_token: itemToken,
      }
      handleAPIPost(
        "memory/notifications/all/read",
        itemID,
        state.data.auth_token,
        handleReadSuccess,
        handleReadErrors
      )
      navigate(token)
    } else if (token.includes("/review-friend-memory")) {
      itemToken = token.replace("/review-friend-memory?token=", "")
      navigate(token)
    }
  }

  useEffect(() => {
    setLoading(true)

    let data = []
    data.auth_token = getUser().token
    actions.updateAction(data)

    let values = {
      access_token: state.data.access_token,
    }

    handleAPIPost(
      "memory/notifications",
      values,
      data.auth_token,
      handleSuccess,
      handleErrors
    )
  }, [])

  return (
    <div>
      <HeaderNav />
      <Spin className="pb-28" spinning={loading} indicator={loadingIcon}>
        <section>
          <div className="px-20 mt-20 mb-0 text-center md:mt-40 md:mb-10">
            <h3 className="block text-gray-900 pt-10 pb-5">Notifications</h3>
          </div>
          <div className="max-w-3xl px-2 mx-auto">
            <List
              itemLayout="horizontal"
              dataSource={notificationData}
              split={notificationData}
              renderItem={item => (
                <List.Item className="relative">
                  <List.Item.Meta
                    className="memory-notification py-4 px-3 md:px-0"
                    avatar={
                      <>
                        <span className="absolute">
                          <Avatar
                            size={{
                              xs: 100,
                              sm: 100,
                              md: 100,
                              lg: 100,
                              xl: 100,
                              xxl: 100,
                            }}
                            src={item.thumbnail}
                          />
                        </span>

                        <span className="block rounded-full shadow">
                          <NotificationPlaceholder />
                        </span>
                      </>
                    }
                    title={
                      <p dangerouslySetInnerHTML={{ __html: item.text }} />
                    }
                    description={item.ago}
                  />
                  {item.read === 0 ? (
                    <span className="your-memory-notifications block bg-pink-500 w-4 h-4 md:w-4 md:h-4 absolute left-24 md:left-20 top-10 rounded-full"></span>
                  ) : (
                    <></>
                  )}
                  {item.disable_button === false ? (
                    <div className="pr-2 md:pr-0">
                      <button
                        onClick={() => checkItem(item.url, item.id)}
                        className="flex flex-wrap items-center mx-auto justify-between px-8 py-3 md:mt-4 text-sm leading-none bg-transparent text-blue-600 border-2 border-blue-600 rounded-full hover:border-blue-600 hover:text-white hover:bg-blue-600 lg:mt-0 disabled:opacity-50"
                      >
                        {item.btn_text}
                      </button>
                    </div>
                  ) : (
                    <></>
                  )}
                </List.Item>
              )}
            />
          </div>
        </section>
      </Spin>
    </div>
  )
}

export default Notifications
