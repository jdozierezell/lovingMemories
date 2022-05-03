import React, { useState, useEffect } from "react"

import Header from "../Header/headerPlain"
import SideComponent from "../AddMemory/memory-side"

import "antd/dist/antd.css"

import { useForm } from "react-hook-form"
import { useStateMachine } from "little-state-machine"
import updateAction from "../../utils/updateAction"

import { handleAPIPost } from "../../utils/auth"

import { navigate } from "gatsby"

import { Spin } from "antd"
import { LoadingOutlined } from "@ant-design/icons"

import { Input } from "antd"

import InfoModalComp from "./InfoModalComp"

const AddDescription = props => {
  const { state, actions } = useStateMachine({ updateAction })
  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm({
    mode: "onChange",
    defaultValues: state.data,
  })

  const { TextArea } = Input

  const [loading, setLoading] = useState(false)
  const loadingIcon = <LoadingOutlined style={{ fontSize: 50 }} spin />

  const [userName, setUserName] = useState("")

  const [charCount, setCharCount] = useState(0)

  const handleSuccess = data => {
    setLoading(false)
    navigate("/app/add-memory/in-memory-of")
  }

  const handleErrors = data => {
    console.log("error")
    //console.log(data);
    setLoading(false)
  }

  const wordCount = e => {
    let currentText = e.target.value
    let count = currentText.length
    //console.log(count);
    setCharCount(count)
  }

  // auto adjust textarea height while typing description
  const tx = document.getElementsByTagName("textarea")
  for (let i = 0; i < tx.length; i++) {
    tx[i].setAttribute(
      "style",
      "height:" + tx[i].scrollHeight + "px;overflow-y:hidden;"
    )
    tx[i].addEventListener("input", OnInput, false)
  }

  function OnInput() {
    this.style.height = "auto"
    this.style.height = this.scrollHeight + "px"
  }

  const onSubmit = data => {
    /* toggle page load */
    setLoading(true)

    /* API REQUEST HERE */
    let values = {
      memory_access_token: state.data.access_token,
      description: data.description,
    }

    /* update state */
    actions.updateAction(data)

    /* post to API */
    handleAPIPost(
      "memory/add/description",
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
          disabled={charCount < 3}
          className="flex flex-wrap items-center mx-auto justify-between px-14 py-3 mt-2 mb-2 text-sm leading-none bg-transparent text-blue-600 border-2 border-blue-600 rounded-full hover:border-blue-600 hover:text-white hover:bg-blue-600 lg:mt-0 disabled:opacity-50"
        >
          Done
        </button>
      </div>
    )
  }

  useEffect(() => {
    ////console.log(state.data.description);
    if (state.data.description != null) {
      setCharCount(state.data.description.length)
    }
    setUserName(state.data.name.split(" ")[0])
  }, [])

  return (
    <div>
      <Spin spinning={loading} indicator={loadingIcon}>
        <Header
          goBack={true}
          title={"Write a Description"}
          gobackUrl={"/in-memory-of"}
        />
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div className="order-2 lg:order-1">
            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="px-5 md:px-14 lg:px-20 mt-0 md:mt-10">
                <h4 className="block text-gray-900 pb-10">
                  Write something about{" "}
                  <span className="capitalize ">{userName}</span>
                </h4>
                <div className="relative w-full mb-8 grow-wrap">
                  <textarea
                    maxLength={2000}
                    className="text-lg border-b-2 border-0 appearance-none w-full py-2 text-gray-700 leading-tight outline-none"
                    id="description"
                    name="description"
                    type="text"
                    placeholder="Your description"
                    {...register("description", {
                      required: "Description is required",
                      minLength: 3,
                    })}
                    onChange={e => wordCount(e)}
                  />
                  <span className="block w-full text-right">
                    {charCount}/2000
                  </span>
                </div>
              </div>
              {renderButton()}
            </form>
          </div>
          <div className="order-1 lg:order-2 pt-0 md:pt-10 ">
            <SideComponent
              text1="What was so special about your loved one. When writing be sure to consider things like; their personality, their favorite hobbies, etc. Please use discretion and avoid specifics like the method of death, any medications they were taking. "
              text2=""
            />
          </div>

          <InfoModalComp
            isVisible={false}
            bottom={"mb-20"}
            text1={
              "What was so special about your loved one. When writing be sure to consider things like; their personality, their favorite hobbies, etc. Please use discretion and avoid specifics like the method of death, any medications they were taking."
            }
            text2={""}
          ></InfoModalComp>
        </section>
      </Spin>
    </div>
  )
}

export default AddDescription
