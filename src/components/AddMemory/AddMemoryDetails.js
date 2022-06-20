import React, { useState, useEffect } from "react"

import Header from "../Header/headerMemory"
import SideComponent from "./memory-side"

import { useForm } from "react-hook-form"
import { useStateMachine } from "little-state-machine"
import updateAction from "../../utils/updateAction"
import { handleAPIPost } from "../../utils/auth"
import { navigate } from "gatsby"
import { Spin, AutoComplete } from "antd"
import { LoadingOutlined } from "@ant-design/icons"

import "../AddMemory/memory.css"

import InfoModalComp from "./InfoModalComp"

const AddMemoryDetails = props => {
  const options = [
    { value: "Father" },
    { value: "Mother" },
    { value: "Husband" },
    { value: "Wife" },
    { value: "Partner" },
    { value: "Son" },
    { value: "Daughter" },
    { value: "Friend" },
    { value: "Family Member" },
  ]

  const getUser = () =>
    window.localStorage.userData ? JSON.parse(window.localStorage.userData) : {}

  const { state, actions } = useStateMachine({ updateAction })

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors, isValid },
  } = useForm({
    mode: "onChange",
    defaultValues: state.data,
  })

  const [loading, setLoading] = useState(false)
  const [loving, setLoving] = useState("")
  const [isFilled, setIsFilled] = useState(false)

  const loadingIcon = <LoadingOutlined style={{ fontSize: 50 }} spin />

  const handleSuccess = data => {
    let newData = state.data
    newData.access_token = data.memory_access_token
    actions.updateAction(newData)

    navigate("/app/add-memory/in-memory-of")
  }

  const handleErrors = () => {
    setLoading(false)
  }

  const onSubmit = data => {
    if (loving.length >= 3) {
      setLoading(true)

      let values = {}

      values.name = data.name
      values.loving = loving

      if (state.data.access_token.length > 10) {
        values.memory_access_token = state.data.access_token
      }

      let newData = state.data
      newData.name = data.name
      newData.loving = loving
      actions.updateAction(newData)

      handleAPIPost(
        "memory/add",
        values,
        state.data.auth_token,
        handleSuccess,
        handleErrors
      )
    } else {
      setIsFilled(true)
    }
  }

  const renderButton = () => {
    return (
      /* .memory-fields-footer */
      <div className="memory-fields-footer absolute bg-white w-full bottom-0 left-0 text-center p-2 lg:p-8 border-t-2">
        {" "}
        {/* md:p-8 */}
        <button className="flex flex-wrap items-center mx-auto justify-between mt-2 mb-2 leading-none bg-transparent text-gray-600 border-2 border-gray-600 rounded-full hover:border-blue-600 hover:text-white hover:bg-blue-600 lg:mt-0 disabled:opacity-50">
          <span>
            {state.data.access_token.length > 10 ? (
              <>Edit Memory</>
            ) : (
              <>Start Memory</>
            )}
          </span>
        </button>
      </div>
    )
  }

  const renderDrop = () => {
    return (
      /* .memory-fields-footer */
      <div className="memory-fields-footer absolute bg-white w-full bottom-0 left-0 text-center p-2 lg:p-8 border-t-2">
        {" "}
        {/* md:p-8 */}
        <button className="flex flex-wrap items-center mx-auto justify-between mt-2 mb-2 leading-none bg-transparent text-gray-600 border-2 border-gray-600 rounded-full hover:border-blue-600 hover:text-white hover:bg-blue-600 lg:mt-0 disabled:opacity-50">
          <span>
            {state.data.access_token.length > 10 ? (
              <>Edit Memory</>
            ) : (
              <>Start Memory</>
            )}
          </span>
        </button>
      </div>
    )
  }

  const onChange = data => {
    setLoving(data)
    let newData = state.data
    newData.loving = data
    actions.updateAction(newData)
  }

  useEffect(() => {
    reset(
      {
        name: "",
      },
      {
        loving: "",
      }
    )

    if (window.localStorage.start == "true") {
      let editData = []
      editData.auth_token = getUser().token
      editData.access_token = ""
      editData.name = ""
      editData.loving = ""
      editData.cover_image = null
      editData.photos = []
      editData.reminder = 0
      editData.description = ""
      editData.favorites = []
      editData.special_dates = []
      editData.friends = []
      editData.visible_type = "public"
      editData.theme_color = ""
      editData.thumbnail = ""
      editData.user_id = ""
      editData.status_id = ""
      editData.id = ""

      editData.user = {
        name: "",
        email: "",
        all_memory_reminder: 0,
        receive_afsp_resources: 0,
      }

      window.localStorage.start = "false"

      setLoving("")
      setLoving("")

      actions.updateAction(editData)
    } else {
      setValue("name", state.data.name, { shouldValidate: true })

      let lovingData = state.data.loving
      if (lovingData == "" || lovingData == null) {
        setLoving("")
      } else {
        setLoving(lovingData)
      }
    }
  }, [])

  return (
    <div className="w-full overflow-hidden">
      <Spin spinning={loading} indicator={loadingIcon}>
        <Header
          goBack={false}
          gobackUrl={"/"}
          toLink={"/"}
          title="Add a new memory"
        />

        <section className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div className="order-2 lg:order-1">
            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="px-5 md:px-14 lg:px-20">
                <div className="mt-10 lg:mt-20">
                  <div className="w-full mb-8">
                    <h4
                      className="title-type block text-gray-700 mb-2"
                      htmlFor="name"
                    >
                      In Loving Memory of *
                    </h4>
                    <input
                      className="border-b border-0 appearance-none w-full py-4 text-gray-700 leading-tight outline-none add-memory-text "
                      id="name"
                      name="name"
                      type="text"
                      placeholder="Loved ones name"
                      {...register("name", {
                        required: "Username is required",
                        minLength: 3,
                      })}
                    />

                    {errors.name && (
                      <p className="text-pink-500 text-sm mt-2">
                        * A Loved ones name is Required
                      </p>
                    )}
                  </div>
                  <div className="w-full mb-8">
                    <h4
                      className="title-type block text-gray-700 mb-2"
                      htmlFor="lovedOne"
                    >
                      A loving *
                    </h4>

                    <div className="border-b border-0 appearance-none w-full py-2 text-gray-700 leading-tight outline-none text-2xl">
                      <AutoComplete
                        id="loving"
                        name="loving"
                        className="add-memory-text text-gray-700 leading-tight outline-none text-2xl"
                        value={loving}
                        style={{ width: "100%" }}
                        onChange={onChange}
                        options={options}
                        placeholder="Mother, Brother, Friend etc..."
                        filterOption={(inputValue, option) =>
                          option.value
                            .toUpperCase()
                            .indexOf(inputValue.toUpperCase()) !== -1
                        }
                      />
                    </div>

                    {isFilled == true ? (
                      <p className="text-pink-500 text-sm mt-2">
                        * A relation of your loved one is Required
                      </p>
                    ) : (
                      <span></span>
                    )}
                  </div>
                </div>
              </div>
              {renderButton()}
            </form>
          </div>

          <div className="order-1 lg:order-2 pt-0 md:pt-20 ">
            <SideComponent text1="The Digital Memory Quilt is an online space where you can honor and share stories of your loved ones, Lorem Ipsum is simply dummy text of the printing and typesetting industry." />
          </div>

          <InfoModalComp
            isVisible={false}
            bottom={"mb-20"}
            text1={
              "The Digital Memory Quilt is an online space where you can honor and share stories of your loved ones, Lorem Ipsum is simply dummy text of the printing and typesetting industry."
            }
            text2={""}
          ></InfoModalComp>
        </section>
      </Spin>
    </div>
  )
}

export default AddMemoryDetails
