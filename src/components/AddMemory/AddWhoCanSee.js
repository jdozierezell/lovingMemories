import React, { useState, useEffect } from "react"

import { ReactMultiEmail } from "react-multi-email"

import Header from "../Header/headerPlain"
import SideComponent from "../AddMemory/memory-side"

import { useForm } from "react-hook-form"
import { useStateMachine } from "little-state-machine"
import updateAction from "../../utils/updateAction"

import { handleAPIPost } from "../../utils/auth"

import "antd/dist/antd.css"

import { navigate } from "gatsby"
import {Checkbox, Dropdown, Select, Spin} from "antd"
import { LoadingOutlined } from "@ant-design/icons"

import InfoModalComp from "./InfoModalComp"

const AddWhoCanSee = props => {
  const { state, actions } = useStateMachine({ updateAction })
  const {
    handleSubmit,
    formState: { errors, isValid },
  } = useForm({
    mode: "onChange",
  })

  const { Option } = Select

  const [recieveASFPReminders, setRecieveASFPReminder] = useState(0)
  const [recieveMemoryReminder, setRecieveMemoryReminder] = useState(0)
  const [whoCanView, setWhoCanView] = useState(state.data.visible_type)
  const [loading, setLoading] = useState(false);

  const [friends, setFriends] = useState([])
  const [canAddInvites, setCanAddInvites] = useState(false)

  const loadingIcon = <LoadingOutlined style={{ fontSize: 50 }} spin />

  const onRecieveASFPRemindersChange = e => {
    setRecieveASFPReminder(e.target.checked)
  }

  const onRecieveMemoryRemindersChange = e => {
    setRecieveMemoryReminder(e.target.checked)
  }

  const handleViewChange = value => {
    setWhoCanView(value);

    setTimeout(function () {
      if (value === "private") {
        setCanAddInvites(true)
      } else {
        setCanAddInvites(false)
      }
    }, 200);

  }

  const handleSuccess = data => {
    setLoading(false)

    let newData = state.data
    newData.visible_type = whoCanView;
    newData.user.all_memory_reminder = recieveMemoryReminder;
    newData.user.receive_afsp_resources = recieveASFPReminders;
    newData.friends = friends;
    actions.updateAction(newData)

    navigate("/app/add-memory/submitted")
  }

  const handleErrors = data => {
    console.log("error")
    setLoading(false)
  }

  const onSubmit = () => {
    setLoading(true)

    let invitesBe = [];
    let whoCan;

    if (whoCanView === "public") {
      whoCan = "public"
    } else if (whoCanView === "draft") {
      whoCan = "public"
    } else {
      whoCan = "private"
      invitesBe = friends
    }

    let values = {
      memory_access_token: state.data.access_token,
      visibility: whoCan,
      memory_reminder: recieveMemoryReminder,
      receive_afsp_resources: recieveASFPReminders,
      invites: invitesBe,
    }

    if (invitesBe.length > 0 || whoCan === "public") {
      /* post to API */
      handleAPIPost(
        "memory/add/visibility",
        values,
        state.data.auth_token,
        handleSuccess,
        handleErrors
      )
    }
  }

  const handleChange = _emails => {
    setFriends(_emails)
  }

  const renderButton = () => {
    return (
      <div
        onClick={() => onSubmit()}
        className="memory-fields-footer fixed bg-white w-full bottom-0 left-0 text-center p-2 lg:p-8 border-t-2"
      > {/* md:p-8 */}
        <button
          /* disabled={(addedDates.length < 1)} not needed as this is not required as a field */
          className="flex flex-wrap items-center mx-auto justify-between px-14 py-3 mt-2 mb-2 text-sm leading-none bg-transparent text-blue-600 border-2 border-blue-600 rounded-full hover:border-blue-600 hover:text-white hover:bg-blue-600 lg:mt-0 disabled:opacity-50"
        >
          Submit
        </button>
      </div>
    )
  }

  const friendsArrayStr = data => data.email

  useEffect(() => {
    setRecieveASFPReminder(state.data.user.receive_afsp_resources);
    setRecieveMemoryReminder(state.data.user.all_memory_reminder);
    setWhoCanView(state.data.visible_type);

    setTimeout(function () {

      //console.log(state.data.visible_type);
      if (state.data.visible_type === "private") {
        setWhoCanView("private");
        //console.log(whoCanView);
        if (whoCanView === "private") {
          setCanAddInvites(true)
        } else {
          setCanAddInvites(false)
        }
      }

    }, 1500);


    let getFriends = state.data.friends

    if (getFriends.length > 0 && getFriends[0].email) {
      const objArray = getFriends.map(friendsArrayStr)
      setFriends(objArray)
      //console.log("set friends 1")
      //console.log(objArray);
    } else {
      setFriends(state.data.friends)
      //console.log("set friends 2")
    }

    //console.log(state.data.friends);
  }, [])

  return (
    <Spin
      className="absolute top-0 left-0"
      spinning={loading}
      indicator={loadingIcon}
    >
      <Header
        goBack={true}
        title={"Memory Visibility"}
        gobackUrl={"/in-memory-of"}
      />
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-0 md:gap-4">
        <div className="order-2 lg:order-1">
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="px-5 md:px-24 mt-0 md:mt-10">
              <h4 className="title-type block text-gray-900 pb-2">
                Memory Visibility
              </h4>
              <label className="text-sm block text-gray-900 pb-2">
                You can control who has access to your memory
              </label>
              {(state.data.visible_type === 'public' || state.data.visible_type === 'draft') ? (
                  <Select
                      defaultValue="Anyone can view"
                      onChange={handleViewChange}
                      className="w-full add-memory-text border-b-2 py-2 border-0  "
                  >

                    <Option value="public">Anyone can view</Option>
                    <Option value="private">
                      Only I and people I invite can view
                    </Option>
                  </Select>
              ) : (
                  <Select
                      defaultValue="Only I and people I invite can view"
                      onChange={handleViewChange}
                      className="w-full add-memory-text border-b-2 py-2 border-0  "
                  >
                    <Option value="private">
                      Only I and people I invite can view
                    </Option>
                    <Option value="public">Anyone can view</Option>

                  </Select>
              )}

              {(canAddInvites === true) ? (

                <>
                  <h4 className="title-type block text-gray-900 pt-8 py-5">
                    Add Emails to invite
                  </h4>
                  <div className="">
                    <ReactMultiEmail
                      className="border-0"
                      placeholder="Add emails of Friends or Family"
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
                    {friends.length <= 0 && (
                      <p className="text-xs my-2 text-pink-500">
                        Field must contain at least 1 email address
                      </p>
                    )}
                  </div>
                </>
              ) : (
                <></>
              )}

              <h4 className="title-type block text-gray-900 py-5 mt-5">
                Confirm Email Notifications
              </h4>
              <div className="pb-2">
                <Checkbox
                  checked={recieveASFPReminders}
                  className="rounded-none"
                  onChange={onRecieveASFPRemindersChange}
                >
                  {" "}
                  I would like to receive memory reminders{" "}
                </Checkbox>
              </div>
              <div className="pb-10">
                <Checkbox
                  checked={recieveMemoryReminder}
                  className="rounded-none"
                  onChange={onRecieveMemoryRemindersChange}
                >
                  {" "}
                  I would like to receive AFSP resources{" "}
                </Checkbox>
              </div>
            </div>
          </form>
          {renderButton()}
        </div>
        <div className="order-1 lg:order-2 pt-0 md:pt-10">
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
            text2={
              ""
            }
          ></InfoModalComp>

      </section>
    </Spin>
  )
}

export default AddWhoCanSee
