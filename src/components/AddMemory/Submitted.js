import React, { useState, useEffect } from "react"

import HeaderNav from "../Header/headerWithNav"

import "antd/dist/antd.css"

import "./styles.css"

import { useForm } from "react-hook-form"
import { useStateMachine } from "little-state-machine"
import updateAction from "../../utils/updateAction"

import { baseImageURL, getCurrentUser, handleAPIFetch } from "../../utils/auth"

import { navigate } from "gatsby"

import { LoadingOutlined } from "@ant-design/icons"

import { Spin, Avatar, Card } from "antd"

import { handleAPIPost } from "../../utils/auth"

import ImagePlaceholder from "../ImagePlaceholder";



const Submitted = props => {
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
        window.localStorage.userData
            ? JSON.parse(window.localStorage.userData)
            : {}

  const [helpfulResources, setHelpfulResources] = useState([])

  const { Meta } = Card

  const [loading, setLoading] = useState(false)
  const loadingIcon = <LoadingOutlined style={{ fontSize: 50 }} spin />

  const [imageUrl, setImageUrl] = useState()
  const [userName, setUserName] = useState("")

  const handleResourceSuccess = data => {
    setLoading(false)
    //console.log(data.helpful_resources);
    setHelpfulResources(data.helpful_resources)
  }

  const handleResourceErrors = data => {
    console.log("error")
    setLoading(false)
  }

  const getListOfSeverPhotos = data => {

    setImageUrl(data.photos[0].image)
    
  }

  const handleGetFilesErrors = () => {
    //console.log('handleGetFilesErrors');
  }

  useEffect(() => {
    setLoading(true)


        let data = [];
        data.auth_token = getUser().token;
        setUserName(state.data.name);
        actions.updateAction(data);

         let values = {
            'access_token': state.data.access_token
        }
    
      handleAPIPost(
        "memory/get/photos",
        values,
        data.auth_token,
        getListOfSeverPhotos,
        handleGetFilesErrors
      )

      handleAPIFetch(
        "helpful-resources",
        handleResourceSuccess,
        handleResourceErrors
      ) 
    

  }, [])

  return (
    <>
      <HeaderNav />
      <Spin spinning={loading} indicator={loadingIcon}>
        <section>
          <div className="px-20 mt-28 pb-28 text-center">
              
            <div className="flex items-center justify-center">
                <span className="block rounded-full max-w-xs">
                <ImagePlaceholder />
              </span>
              <img
                className="absolute max-w-xs rounded-full shadow submittedImg"
                src={imageUrl}
                alt=""
              />
             
              
            </div>

            <h2 className="block text-gray-900 pt-5">
              Your Memory of <span className="capitalize ">{userName}</span> has
              been submitted
            </h2>
            <label className="text-lg block text-gray-900 pb-8">
              Your memory has been sent for approval, we will reach out once it
              is posted.
            </label>

            <label className="text-lg block text-gray-900 pt-5 pb-5">
              Helpful resources to aid in your healing
            </label>

            <div className="helpful-resource-panel flex flex-wrap items-center justify-center gap-4 mx-auto">
              {helpfulResources.map((value, index) => {
                return (
                  <div key={index}>
                    <div className="flex items-center justify-center lg:justify-end text-left">
                      <Card
                        bordered={false}
                        style={{ width: 300 }}
                        cover={<img alt="example" src={value.image} />}
                      >
                        <Meta title={value.name} />
                        <a href={value.url}>Learn more</a>
                      </Card>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </section>
      </Spin>
    </>
  )
}

export default Submitted
