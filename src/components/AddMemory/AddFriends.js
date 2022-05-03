import React, { useState, useEffect } from "react"

import { ReactMultiEmail } from "react-multi-email"

import "react-multi-email/style.css"
import "./memory.css"

import "antd/dist/antd.css"

import "./memory.css"

import Header from "../Header/headerPlain"
import SideComponent from "./memory-side"

import { useForm, Controller } from "react-hook-form"
import { useStateMachine } from "little-state-machine"
import updateAction from "../../utils/updateAction"

import { handleAPIPost } from "../../utils/auth"
import { navigate } from "gatsby"

import { Spin } from "antd"
import { LoadingOutlined } from "@ant-design/icons"

import InfoModalComp from "./InfoModalComp"

const Addfriends = props => {
  const myStyle = {
    fontFamily: "sans-serif",
    width: "500px",
    background: "#f3f3f3",
    padding: "25px",
    margin: "20px",
  }

  const { state, actions } = useStateMachine({ updateAction })
  const {
    watch,
    setValue,
    getValues,
    register,
    unregister,
    handleSubmit,
    control,
    formState: { errors, isValid },
  } = useForm({
    mode: "onChange",
    defaultValues: state.data,
  })

  const [loading, setLoading] = useState(false)
  const loadingIcon = <LoadingOutlined style={{ fontSize: 50 }} spin />

  const values = getValues()

  const [userName, setUserName] = useState("")
  const [friends, setFriends] = useState([])

  const handleSuccess = data => {
    //console.log("success");
    setLoading(false)

    navigate("/app/add-memory/in-memory-of")
  }

  const handleErrors = data => {
    //console.log(data);
    setLoading(false)
  }

  const handleChange = _emails => {
    let newData = _emails
    actions.updateAction(newData)
    //console.log(newData)
    setFriends(newData)
  }

  const onSubmit = data => {
    setLoading(true)

    let newData = state.data

    //console.log(friends)
    if (friends.length <= 0) {
      newData.friends = []
    } else {
      if (friends[0].email) {
        newData.friends = friends
      } else {
        newData.friends = friends.map(email => ({ email }))
      }
    }
    actions.updateAction(newData)

    //console.log(newData.friends);

    let values = {
      friends: newData.friends,
      memory_access_token: state.data.access_token,
    }

    handleAPIPost(
      "memory/add/invite/friends",
      values,
      state.data.auth_token,
      handleSuccess,
      handleErrors
    )
  }

  const renderButton = () => {
    return (
      <div className="memory-fields-footer fixed bg-white w-full bottom-0 left-0 text-center p-2 lg:p-8 border-t-2"> {/* md:p-8 */}
        <button
          disabled={!isValid}
          className="flex flex-wrap items-center mx-auto justify-between px-14 py-3 mt-2 mb-2 text-sm leading-none bg-transparent text-blue-600 border-2 border-blue-600 rounded-full hover:border-blue-600 hover:text-white hover:bg-blue-600 lg:mt-0 disabled:opacity-50"
        >
          Done
        </button>
      </div>
    )
  }

  const friendsArrayStr = data => data.email

  useEffect(() => {
    setUserName(state.data.name.split(" ")[0])

    let getFriends = state.data.friends

    if (getFriends.length > 0 && getFriends[0].email) {
      const objArray = getFriends.map(friendsArrayStr)
      setFriends(objArray)
    } else {
      setFriends(state.data.friends)
    }
  }, [])

  return (
    <>
      <Spin spinning={loading} indicator={loadingIcon}>
        <Header
          goBack={true}
          title={"Include Friends and Family"}
          gobackUrl={"/in-memory-of"}
        />
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div className="order-2 lg:order-1 px-5 md:px-20">
            <div className="mt-0 md:mt-10">
              <h4 className="block text-gray-900 pb-10 max-w-2xl">
                Ask your friends and family what they remember most about{" "}
                <span className="capitalize ">{userName}</span>
              </h4>
              <p className="my-5">
                Include friends and family to submit a memory they had with
                same. All submitted memories will be approved by you before
                being added.
              </p>
            </div>
            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="relative mt-10 text-xl">
                <ReactMultiEmail
                  className="border-0"
                  placeholder="Add emails of Friends and Family"
                  emails={friends}
                  onChange={_emails => handleChange(_emails)}
                  getLabel={(email, index, removeEmail) => {
                    return (
                      <div className="bg-blue-600" data-tag key={index}>
                        <div data-tag-item>{email}</div>
                        <span
                          data-tag-handle
                          onClick={() => removeEmail(index)}
                        >
                          ×
                        </span>
                      </div>
                    )
                  }}
                />
              </div>
              {renderButton()}
            </form>
          </div>

          <div className="order-1 lg:order-2">
            <SideComponent
              text1="Only a few steps left. Fill out this form to complete your memory."
              text2=""
            />
          </div>

          <InfoModalComp
            isVisible={false}
            bottom={"mb-20"}
            text1={
              "Only a few steps left. Fill out this form to complete your memory."
            }
            text2={""}
          ></InfoModalComp>
        </section>
      </Spin>
    </>
  )
}

export default Addfriends
