import React, {useState, useEffect} from "react"
import ImgCrop from "antd-img-crop"

import "./memory.css"
import "./styles.css"

import Header from "../Header/headerPlain"
import SideComponent from "../AddMemory/memory-side"
import updateAction from "../../utils/updateAction"

import {message, Spin, Upload, Modal} from "antd"
import {useForm} from "react-hook-form"
import {useStateMachine} from "little-state-machine"
import {navigate} from "gatsby"

import {LoadingOutlined} from "@ant-design/icons"
import {BsImageFill} from "react-icons/bs"

import {handleAPIPost} from "../../utils/auth"

import "antd/dist/antd.css"

import InfoModalComp from "./InfoModalComp"

function getBase64(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader()
        reader.readAsDataURL(file)
        reader.onload = () => resolve(reader.result)
        reader.onerror = error => reject(error)
    })
}

const AddMedia = props => {
    const [loading, setLoading] = useState(false)
    const [previewVisible, setPreviewVisible] = useState(false)
    const [previewIndex, setPreviewIndex] = useState()
    const [previewImage, setPreviewImage] = useState("")
    const [coverImage, setCoverImage] = useState("")
    const {state, actions} = useStateMachine({updateAction})
    const {
        formState: {errors, isValid},
    } = useForm({
        mode: "onChange",
        defaultValues: state.data,
    })

    const auth = "Bearer " + state.data.auth_token.token
    const loadingIcon = <LoadingOutlined style={{fontSize: 50}} spin/>

    const uploadProps = {
        name: "image",
        accept:"image/png, image/gif, image/jpeg,'image/jpg,'image/bmp",
        action: "https://afsp-loving-memories.herokuapp.com/api/memory/add/image",
        headers: {
            Authorization: auth,
        },
        data: {
            memory_access_token: state.data.access_token,
        },
        method: "post",
    }

    const [fileList, setFileList] = useState([])

    const onChange = async info => {
        setLoading(true)

        let image
        setFileList(info.fileList)
        let editData = []
        editData.photos = info.fileList
        actions.updateAction(editData)

        const {status} = info.file

        if (status !== "uploading") {

        }
        if (status === "done") {

            message.success(`${info.file.name} file uploaded successfully.`)

            if (info.fileList.length === 1) {
                let file = info.fileList[0]

                if (!file.url && !file.preview) {
                    file.preview = await getBase64(file.originFileObj)
                    setCoverImage(file.preview)

                    image = file.preview
                } else {
                    setCoverImage(file.url)

                    image = file.url
                }
            }

            let details = {
                access_token: state.data.access_token,
            }

            handleAPIPost(
                "memory/get/photos",
                details,
                state.data.auth_token,
                handleGetFilesSuccess,
                handleGetFilesErrors
            )
        }
        else if (info.file.status === "error") {
            message.error(`${info.file.name} file upload failed.`)
            let details = {
                access_token: state.data.access_token,
            }

            handleAPIPost(
                "memory/get/photos",
                details,
                state.data.auth_token,
                getListOfSeverPhotos,
                handleGetFilesErrors
            )
            setLoading(false)

        }
    }

    const handleGetFilesSuccess = data => {
        setLoading(false)

        let editData = []
        editData.photos = data.photos
        editData.cover_image = coverImage
        actions.updateAction(editData)
        setCoverImage(data.photos[0].image)
        setFileList(data.photos)

        if (data.photos.length === 1) {
            let cover_details = {
                memory_access_token: state.data.access_token,
                image: data.photos[0].image,
            }

            handleAPIPost(
                "memory/add/cover",
                cover_details,
                state.data.auth_token,
                handleAddCoverSuccess,
                handleAddCoverErrors
            )
        }
    }

    const getListOfSeverPhotos = data => {
        setLoading(false)

        let editData = []

        if (data.photos.length) {
            editData.photos = data.photos
            actions.updateAction(editData)
            setCoverImage(data.photos[0].image)
            setFileList(data.photos)
        }
    }

    const handleGetFilesErrors = () => {
        //console.log('handleGetFilesErrors');
        setLoading(false);
    }

    const handleAddCoverSuccess = data => {
        let newData = state.data
        newData.cover_image = data
        newData.photos = fileList
        actions.updateAction(newData)

        setTimeout(function () {
            setLoading(false)
        }, 2000)
    }

    const handleAddCoverErrors = () => {
        //console.log("handleAddCoverErrors")
        console.log('error');
        setLoading(false)
    }

    const decideAction = async (is_remove, index, list, file) => {
        setLoading(true)

        //for set cover
        if (is_remove && index === 0) {
            let newArray = list
            newArray.splice(index, 1)
            setFileList(newArray)

            if (newArray.length === 0) {
                setCoverImage("")
                let editData = []
                editData.coverImage = ""
                actions.updateAction(editData)
                //setCoverImage(state.data.photos[0].image)
                setCoverImage("")
            }

            if (newArray.length > 0) {
                let file = list[index]

                if (!file.url && !file.preview) {
                    file.preview = await getBase64(newArray[index].originFileObj)
                    setCoverImage(file.preview)

                    let details = {
                        memory_access_token: state.data.access_token,
                        image: file.preview,
                    }

                    handleAPIPost(
                        "memory/add/cover",
                        details,
                        state.data.auth_token,
                        handleAddCoverSuccess,
                        handleAddCoverErrors
                    )
                } else {
                    let getImage

                    if (!file.url && !file.preview) {
                        file.preview = await getBase64(file.originFileObj)
                        setCoverImage(file.preview)

                        getImage = file.preview
                    } else {
                        setCoverImage(file.url)
                        getImage = file.url
                    }

                    let details = {
                        memory_access_token: state.data.access_token,
                        image: getImage,
                    }

                    handleAPIPost(
                        "memory/add/cover",
                        details,
                        state.data.auth_token,
                        handleAddCoverSuccess,
                        handleAddCoverErrors
                    )
                }
            } else {
                setCoverImage("")
                let newData = state.data
                newData.cover_image = coverImage
                actions.updateAction(newData)
            }
        }

        let details = {
            memory_access_token: state.data.access_token,
            image: file.image,
        }
        handleAPIPost(
            "memory/delete/image",
            details,
            state.data.auth_token,
            handleRemoveFileSuccess,
            handleRemoveFileError
        )
    }

    const deleteAction = () => {
        setLoading(true)

        setPreviewVisible(false)

        let img = fileList[previewIndex].image
        let details = {
            memory_access_token: state.data.access_token,
            image: img,
        }
        handleAPIPost(
            "memory/delete/image",
            details,
            state.data.auth_token,
            handleRemoveFileSuccess,
            handleRemoveFileError
        )
    }

    const handleRemoveFileSuccess = data => {
        setLoading(false)

        setFileList(data.photos)
        let newData = state.data
        newData.photos = data.photos
        actions.updateAction(newData)
    }

    const handleRemoveFileError = () => {
        //console.log("remove file error");
        setLoading(false)
    }

    const onRemove = file => {
        decideAction(true, fileList.indexOf(file), fileList, file)
    }

    const onPreview = file => {
        let index = fileList.indexOf(file)

        setPreviewImage(file.image)

        setPreviewVisible(true)

        setPreviewIndex(index)
    }

    const addCoverImage = () => {
        setLoading(true)

        let img = fileList[previewIndex].image
        setCoverImage(img)
        let newData = state.data
        newData.cover_image = coverImage
        actions.updateAction(newData)

        setPreviewVisible(false)

        let cover_details = {
            memory_access_token: state.data.access_token,
            image: img,
        }

        handleAPIPost(
            "memory/add/cover",
            cover_details,
            state.data.auth_token,
            handleAddCoverSuccess,
            handleAddCoverErrors
        )
    }

    const closeModel = () => {
        setPreviewVisible(false)
    }

    const Done = () => {
        navigate("/app/add-memory/in-memory-of")
    }

    const renderButton = () => {
        return (
            /* .memory-fields-footer */
            <div
                className="memory-fields-footer fixed bg-white w-full bottom-0 left-0 text-center p-2 lg:p-8 border-t-2">
                {" "}
                {/* md:p-8 */}
                <button
                    onClick={() => Done()}
                    className="flex flex-wrap items-center mx-auto justify-between leading-none mt-2 mb-2 bg-transparent text-gray-600 border-2 border-gray-600 rounded-full hover:border-blue-600 hover:text-white hover:bg-blue-600 lg:mt-0 disabled:opacity-50"
                >
                    <span>Done</span>
                </button>
            </div>
        )
    }

    useEffect(() => {
        setLoading(true)

        let details = {
            access_token: state.data.access_token,
        }

        handleAPIPost(
            "memory/get/photos",
            details,
            state.data.auth_token,
            getListOfSeverPhotos,
            handleGetFilesErrors
        )
    }, [])

    return (
        <>
            <Spin spinning={loading} indicator={loadingIcon}>
                <Header
                    goBack={true}
                    gobackUrl={"/in-memory-of"}
                    title={"Add Photos"}
                />
                <section className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:pb-40">
                    <div className="px-5 md:px-14 lg:px-22 mt-0 md:mt-5 order-2 lg:order-1">
                        <div
                            className="relative mb-4"
                            style={{
                                width: "100%",
                                maxWidth: "552px",
                                height: "auto",
                                minHeight: "300px",
                                background: "#f3f4f6",
                            }}
                        >
                            <div
                                className="pointer-events-none absolute w-full h-full top-0 left-0 flex items-center justify-center">
                                <BsImageFill className="text-gray-300" size={60}></BsImageFill>
                            </div>

                            <img
                                className="relative"
                                style={{
                                    width: "100%",
                                    height: "auto",
                                    minWidth: "300px",
                                    objectFit: "cover",
                                }}
                                src={coverImage}
                                alt=""
                            />

                            <div className="absolute top-0 left-0 m-4 bg-black text-white text-xs px-3 py-2 shadow">
                                cover image
                            </div>
                        </div>

                        <ImgCrop rotate>
                            <Upload
                                {...uploadProps}
                                listType="picture-card"
                                fileList={fileList}
                                onChange={onChange}
                                onPreview={onPreview}
                                onRemove={onRemove}

                            >
                                {fileList.length < 4 && "+ Add More"}
                            </Upload>
                        </ImgCrop>

                        <ImgCrop grid={true}>
                            <Modal
                                destroyOnClose={true}
                                visible={previewVisible}
                                footer={null}
                                closable={false}
                                okText={"Set as Cover"}
                            >
                                <img
                                    alt="example"
                                    style={{width: "100%"}}
                                    src={previewImage}
                                />
                                <div className="flex align-middle justify-center mt-5 gap-2  h-10">
                                    <div>
                                        <button
                                            onClick={() => addCoverImage()}
                                            className="flex items-center justify-center border-1 border-gray-100 rounded-full h-5 text-gray-500 text-sm hover:border-gray-100 hover:bg-blue-500 hover:text-white"
                                        >
                                            Set as Cover
                                        </button>
                                    </div>
                                    <div>
                                        <button
                                            onClick={() => deleteAction()}
                                            className="flex items-center justify-center border-1 border-gray-100 rounded-full h-5 text-gray-500 text-sm hover:border-gray-100 hover:bg-blue-500 hover:text-white"
                                        >
                                            Delete
                                        </button>
                                    </div>
                                    <div>
                                        <button
                                            onClick={() => closeModel()}
                                            className="flex items-center justify-center border-1 border-gray-100 rounded-full h-5 text-gray-500 text-sm hover:border-gray-100 hover:bg-blue-500 hover:text-white"
                                        >
                                            Close
                                        </button>
                                    </div>
                                </div>
                            </Modal>
                        </ImgCrop>
                        <p className="text-gray-500 text-sm mt-2">
                            <b>Note:</b> You’re currently limited to 4 images in total (Incl. Your Cover image) <br/> Preferred Formats: JPG,PNG, BMP & GIF.
                        </p>
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
        </>
    )
}

export default AddMedia
