import React, { useState, useRef, useEffect } from "react"

import Header from "../Header/headerPlain"
import SideComponent from "../AddMemory/memory-side"

import { useForm } from "react-hook-form"
import { useStateMachine } from "little-state-machine"
import updateAction from "../../utils/updateAction"

import "antd/dist/antd.css"

import { navigate } from "gatsby"

import {message, Avatar, Spin, Card } from "antd"
import { IoIosAdd } from "react-icons/io"
import { HiOutlinePlus } from "react-icons/hi"
import { LoadingOutlined } from "@ant-design/icons"
import { handleAPIPost } from "../../utils/auth"
import { DeleteOutlined, EditOutlined } from "@ant-design/icons"

import InfoModalComp from "./InfoModalComp"

const { Meta } = Card

const AddMemories = props => {
  const { state, actions } = useStateMachine({ updateAction })

  const {
    register,
    handleSubmit,
    reset,
    setError,
    setValue,
    getValues,
    formState: { errors, isValid },
  } = useForm({
    mode: "onChange",
  })

  const [favorites, setFavorites] = useState([])

  const [imageVal, setImageVal] = useState('')

  const [loading, setLoading] = useState(false)

  const loadingIcon = <LoadingOutlined style={{ fontSize: 50 }} spin />

  const [userName, setUserName] = useState("")

  const [isFirstLoadMemory, setIsFirstLoadMemory] = useState(false)
  const [isFirstLoadImage, setIsFirstLoadImage] = useState(false)

  const fileInputRef = useRef()

  const [charCount, setCharCount] = useState(0)

  const messagesEndRef = useRef(null)

  const messagesStartRef = useRef(null)

  const addMemoryToList = data => {

    //alert(1);

    let createNewObj = {
      name: data.name,
      image: imageVal,
    }

    setFavorites(prevState => [...prevState, createNewObj])

    reset({
      name: "",
    })

    setCharCount(0)
    setImageVal("")

    scrollToBottom()
  }

  const handleSuccess = data => {
    setLoading(false)

    let newData = state.data

    newData.favorites = favorites
    actions.updateAction(newData)

    navigate("/app/add-memory/in-memory-of")
  }

  const handleErrors = data => {
    console.log("error")
    setLoading(false)
  }

  const goBack = data => {
    /* API REQUEST HERE */
    setLoading(true)

    let values = {
      favorites: favorites,
      memory_access_token: state.data.access_token,
    }

    /* post to API */
    handleAPIPost(
      "memory/add/favorite-memory",
      values,
      state.data.auth_token,
      handleSuccess,
      handleErrors
    )
  }

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  const scrollToTop = () => {
    messagesStartRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  const handleChangeInput = e => {
    let file = e.target.files[0]
    const reader = new FileReader()
    reader.onloadend = result => {
      setImageVal(result.target.result)
    }
    reader.readAsDataURL(file)
  }

  const wordCount = e => {
    let currentText = e.target.value
    let count = currentText.length
    
    if(count<3) {
      setIsFirstLoadMemory(true);
    }
    else {
      setIsFirstLoadMemory(false);
    }

    setCharCount(count)
  }

  const renderButton = () => {
    return (
      <div
        onClick={goBack}
        className="mt-10 md:mt-20 lg:mt-0 fixed bg-white md:flex items-center justify-center w-full bottom-0 text-center p-2 md:p-8 border-t-2 blur-sm bg-opacity-90"
      >
        <button
          disabled={favorites.length < 1}
          className="flex flex-wrap items-center mx-auto justify-between px-14 py-3 mt-2 mb-2 text-sm leading-none bg-transparent text-blue-600 border-2 border-blue-600 rounded-full hover:border-blue-600 hover:text-white hover:bg-blue-600 lg:mt-0 disabled:opacity-50"
        >
          Done
        </button>
      </div>
    )
  }

  const addMemoryButtonDisabled = () => {
    return (
      <div className="text-left mb-10">

        <button
          className=" flex flex-wrap items-start justify-between px-6 py-3 text-xs text-bold leading-none bg-transparent text-base text-afsp-blue hover:text-afsp-blue-dark lg:mt-0 opacity-40"
          disabled>
          <HiOutlinePlus size={24} />{" "}
          <span className="ml-2">Add Memory to list </span>
        </button>
      </div>
    )
  }


  const addMemoryButton = () => {
    return (
      <div className="text-left mb-10">

        <button
          className=" flex flex-wrap items-start justify-between px-6 py-3 text-xs text-bold leading-none bg-transparent text-base text-afsp-blue hover:text-afsp-blue-dark lg:mt-0 "
        >
          <HiOutlinePlus size={24} />{" "}
          <span className="ml-2">Add your Memory to the list  </span>
        </button>
      </div>
    )
  }

  const removeItem = index => {
    setFavorites(favorites.filter((_, i) => i !== index))
  }

  const editItem = index => {
    setValue("name", favorites[index].name, { shouldValidate: true })

    setImageVal(favorites[index].image)

    setCharCount(favorites[index].name.length)

    setFavorites(favorites.filter((_, i) => i !== index))

    scrollToTop()
  }

  const getFormValidation = () => {

    if(imageVal.length < 3 || charCount<1)
    {
      return "false";
    }
    else {
      return "true";
    }

    
  }

  useEffect(() => {
    let getFavoritesData = state.data.favorites
    setFavorites(getFavoritesData)
    setUserName(state.data.name.split(" ")[0])
  }, [])

  return (
    <Spin
      className="absolute top-0 left-0"
      spinning={loading}
      indicator={loadingIcon}
    >
      <Header
        goBack={true}
        gobackUrl={"/in-memory-of"}
        title={`Add memories`}
      />
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="order-2 lg:order-1">
          <form onSubmit={handleSubmit(addMemoryToList)}>
            <div className="px-5 md:px-14 lg:px-20 mt-0 md:mt-10">
              <div ref={messagesStartRef} />

              <h4 className="block text-gray-900 pb-10">
                Include your favorite memories of{" "}
                <span className="capitalize ">{userName}</span>
              </h4>

              <div className="grid grid-cols-1 gap-10">
                <div ref={messagesStartRef} />

                <div className="w-full">
                  <textarea                  
                    maxLength={140}
                    className="border-b-2 border-0 appearance-none w-full py-2 text-gray-900 leading-tight outline-none"
                    id="name"
                    name="name"
                    type="text"
                    placeholder="Your Memory"
                    {...register("name")}                    
                    onChange={e => wordCount(e)}
                  />
                  <span className="block w-full text-right">
                    {charCount}/140
                  </span>                  

                  {/* {charCount >= 2 ? ( */}

                   {isFirstLoadMemory === false ? (
                      <>
                    
                      </>
                    ) : (
                      <>
                        <p className="text-pink-500 text-xs -mt-4">Memory meaning is required to add to list</p>
                      </>
                    )}
                 
                  
                </div>
                <div className="w-full -mt-5 mb-8">
                  <div className="flex flex-wrap">
                    <button
                      className="memory-fields-image-btn text-center mr-2 px-6 py-6 text-xs text-bold leading-none bg-transparent border-2 border-dashed border-gray-300 rounded-none"
                      onClick={e => {
                        e.preventDefault()
                        fileInputRef.current.click()
                      }}
                    >
                      <IoIosAdd className="mx-auto" size={30} />
                      <p className="mt-2">
                        Update <br /> Memory Photo
                      </p>
                    </button>
                    <button
                      className="text-center mx-0"
                      onClick={e => {
                        e.preventDefault()
                        fileInputRef.current.click()
                      }}
                    >
                      <img className="w-auto h-40" src={imageVal} alt="" />
                    </button>
                  </div>
                  <input
                    ref={fileInputRef}
                    onChange={handleChangeInput}
                    style={{ display: "none" }}
                    type="file"
                    name="image"
                    id="image"
                  />
                </div>
              </div>       

              
              
              {/* {imageVal.length >= 2 ? ( */}

              {isFirstLoadImage === false ? (
                <>
              
                </>
              ) : (
                <>
                  <p className="text-pink-500 text-xs -mt-4">Memory image is required to add to list</p>
                </>
              )}
              
              { getFormValidation() == "false" ? (
                <>
                {addMemoryButtonDisabled()}
                </>
              ) : (
                <>
                  {addMemoryButton()}
                </>
              )}


              <hr className="mb-10" />

              <h5 className="block text-gray-900 pb-3" htmlFor="name">
                Memory List
              </h5>

              {favorites.length > 0 ? (
                <></>
              ) : (
                <>
                  <p className="text-pink-500">(Add a Memory to the list to continue)</p>
                </>
              )}

              <div className="memory-list mb-40">
                {favorites.map((value, index) => {
                  return (
                    <div key={index} className="m-1">
                      <Card style={{ margin: "20px 0 0 0", padding: "0" }}>
                        <div className="flex items-center justify-between">
                          <Avatar
                            shape="square"
                            size={100}
                            src={favorites[index].image}
                          />
                          <div>
                            <div
                              className="cursor-pointer p-4"
                              onClick={() => removeItem(index)}
                            >
                              <DeleteOutlined />
                            </div>
                            <div
                              className="cursor-pointer p-4"
                              onClick={() => editItem(index)}
                            >
                              <EditOutlined />
                            </div>
                          </div>
                        </div>
                        <div className="pt-5">
                          <p>{favorites[index].name}</p>
                        </div>
                      </Card>
                    </div>
                  )
                })}
              </div>

              <div ref={messagesEndRef} />
            </div>
          </form>
          {renderButton()}
        </div>
        <div className="order-1 lg:order-2">
          <SideComponent
            text1="What was so special about your loved one. When writing be sure to consider things like; their personality, their favorite hobbies, etc. Please use discretion and avoid specifics like the method of death, any medications they were taking. "
            text2=""
          />
        </div>

        <InfoModalComp
          isVisible={false}
          bottom={"mb-20"}
          text1={
            "What was so special about your loved one. When writing be sure to consider things like; their personality, their favorite hobbies, etc. Please use discretion and avoid specifics like the method of death, any medications they were taking. "
          }
          text2={""}
        ></InfoModalComp>
      </section>
    </Spin>
  )
}

export default AddMemories
