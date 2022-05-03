import React, {useEffect, useState} from "react"

import Header from "../Header/headerPlain"
import SideComponent from "./memory-edit-side"

import {useForm} from "react-hook-form"
import {useStateMachine} from "little-state-machine"
import updateAction from "../../utils/updateAction"

import {navigate} from "gatsby"

import {handleAPIPost} from "../../utils/auth"

import {Spin, Modal, message} from "antd"
import {LoadingOutlined} from "@ant-design/icons"

import InfoModalComp from "./InfoModalComp"

import logo from '../../images/gatsby-icon.svg'

const UpdateMemoryOf = props => {
    const {state, actions} = useStateMachine({updateAction})

    const {
        register,
        getValues,
        handleSubmit,
        formState: {errors, isValid},
    } = useForm({
        mode: "onChange",
        defaultValues: state.data,
    })

    const getUser = () =>
        window.localStorage.userData
            ? JSON.parse(window.localStorage.userData)
            : {}

    const onSubmit = data => {
        actions.updateAction(data)
    }

    const [loading, setLoading] = useState(false)
    const loadingIcon = <LoadingOutlined style={{fontSize: 50}} spin/>

    const values = getValues()

    const [hasChangedData, setHasChangedData] = useState(false)

    const [themeColor, setThemeColor] = useState("")

    const [headerName, setHeaderName] = useState("")

    const [isModalVisible, setIsModalVisible] = useState(false)

    const [imageUrl, setImageUrl] = useState()

    const handleColorSuccess = data => {
        setLoading(false)
    }

    const handleColorErrors = data => {
        setLoading(false)
        console.log("error")
    }

    const themeColorChange = color => {
        //console.log("color: " + color);
        setThemeColor(color)

        let data = values
        data.theme_color = color
        actions.updateAction(data)

        let details = {
            memory_access_token: state.data.access_token,
            theme_color: color,
        }

        handleAPIPost(
            "memory/add/theme",
            details,
            state.data.auth_token,
            handleColorSuccess,
            handleColorErrors
        )

        setLoading(true)
    }

    const previewMemory = () => {
        //console.log("preview memory");
    }

    const showModal = () => {
        setIsModalVisible(true)
    }

    const hideModal = () => {
        setIsModalVisible(false)
    }

    const completeMemory = () => {
        //console.log("complete memory");
        navigate("/app/add-memory/add-who-can-see")
    }

    const completeEdit = () => {
        setIsModalVisible(false)
        setLoading(true)
        let details = {
            memory_access_token: state.data.access_token,
        }
        handleAPIPost(
            "memory/add/submit",
            details,
            state.data.auth_token,
            handleMemorySubmitSuccess,
            handleMemorySubmitErrors
        )
    }

    const handleMemorySubmitSuccess = data => {
        setLoading(false)
        navigate("/app/add-memory/submitted")
    }

    const handleMemorySubmitErrors = () => {
        setLoading(false)
        console.log("handleMemSubmitErrors")
    }

    const renderButton = () => {
        return (
            <div className="memory-fields-footer md:fixed md:bottom-0 w-full">
                {state.data.access_token.length > 10 && state.data.status_id >= 1 ? (
                    <div
                        className="relative mt-10 md:mt-20 lg:mt-0 lg:fixed bg-white md:flex items-center justify-center w-full bottom-0 text-center p-2 lg:p-8 border-t-2"> {/* md:p-8 */}
                        <div className="mx-2 order-1">
                            <button
                                onClick={() => getPreviewData()}
                                disabled={!isValid}
                                className="flex flex-wrap items-center mx-auto justify-between px-8 py-3 my-2 text-sm leading-none bg-transparent text-blue-600 border-2 border-blue-600 rounded-full hover:border-blue-600 hover:text-white hover:bg-blue-600 lg:mt-0 disabled:opacity-50"
                            >
                                Preview Memory
                            </button>
                        </div>
                        <div className="mx-2 order-2">
                            <button
                                onClick={() => showModal()}
                                disabled={!isValid}
                                className=" flex flex-wrap items-center mx-auto justify-between px-8 py-3 my-2 text-sm leading-none bg-blue-500 text-white border border-blue-500 rounded-full hover:border-blue-600 hover:text-white hover:bg-blue-600 lg:mt-0 disabled:opacity-50"
                            >
                                Submit Changes
                            </button>
                        </div>
                    </div>
                ) : (
                    <div
                        className="relative mt-20 lg:mt-0 lg:fixed bg-white md:flex items-center justify-center w-full bottom-0 text-center p-8 md:border-t-2">
                        <div className="mx-2 order-1">
                            <button
                                onClick={() => getPreviewData()}
                                disabled={!isValid}
                                className="flex flex-wrap items-center mx-auto justify-between px-8 py-3 mt-4 text-sm leading-none bg-transparent text-blue-600 border-2 border-blue-600 rounded-full hover:border-blue-600 hover:text-white hover:bg-blue-600 lg:mt-0 disabled:opacity-50"
                            >
                                Preview Memory
                            </button>
                        </div>
                        <div className="mx-2 order-2">
                            <button
                                onClick={() => completeMemory()}
                                disabled={!isValid}
                                className=" flex flex-wrap items-center mx-auto justify-between px-8 py-3 mt-4 text-sm leading-none bg-blue-500 text-white border border-blue-500 rounded-full hover:border-blue-600 hover:text-white hover:bg-blue-600 lg:mt-0 disabled:opacity-50"
                            >
                                Complete Memory
                            </button>
                        </div>
                    </div>
                )}
            </div>
        )
    }

    const pushToPage = url => {
        setHasChangedData(true)
        navigate(url)
    }

    const handleDelete = token => {
        setLoading(true)
        let details = {
            access_token: token,
        }

        handleAPIPost(
            "memory/delete",
            details,
            state.data.auth_token,
            handleMemSuccess,
            handleMemErrors
        )
    }

    const handleMemSuccess = data => {
        setLoading(false)
        navigate("/")
    }

    const handleMemErrors = () => {
        setLoading(false)
        message.error("Memory error");
    }

    const handlePreviewSuccess = data => {
        setLoading(false)

        let newData = state.data
        newData.prevFrom = 0
        actions.updateAction(newData)

        navigate("/app/add-memory/preview")
    }

    const handlePreviewErrors = data => {
        console.log("error")
    }

    const getPreviewData = () => {
        setLoading(true)

        // console.log(state.data.access_token);
        let details = {
            access_token: state.data.access_token,
        }

        handleAPIPost(
            "memory/preview",
            details,
            state.data.auth_token,
            handlePreviewSuccess,
            handlePreviewErrors
        )
    }

    const isEnum = x => {
        for (var i in x) return !0
        return !1
    }

    const getListOfSeverPhotos = data => {
        //console.log(data);
        if (data.photos.length > 0) {
            setImageUrl(data.photos[0].image)
        }
    }

    const handleGetFilesErrors = () => {
        //console.log('handleGetFilesErrors');
    }



    useEffect(() => {

        if (state.data.theme_color == "") {
            setThemeColor("blue")
        } else {
            setThemeColor(state.data.theme_color)
        }

        let Title = "In Memory of " + state.data.name
        setHeaderName(Title)

        let data = [];
        data.auth_token = getUser().token;
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

    }, [])

    return (
        <>
            <Spin spinning={loading} indicator={loadingIcon}>
                <Header goBack={true} title={headerName} gobackUrl={"/"}/>
                <section className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:pb-40">
                    <div className="order-2 lg:order-1">
                        <form onSubmit={handleSubmit(onSubmit)}>
                            <div className="memory-fields px-5 md:px-10 lg:px-10 mt-0">
                                <div className="relative w-full">
                                    {isEnum(values.cover_image) !== true ? (
                                        <input
                                            readOnly
                                            className="text-xl border-b py-8 border-0 appearance-none w-full text-gray-700 leading-tight outline-none"
                                            id="cover_image"
                                            name="cover_image"
                                            type="text"
                                            placeholder="Add photos*"
                                            {...register("cover_image", {required: true})}
                                        />
                                    ) : (
                                        <input
                                            readOnly
                                            className="text-xl py-8 border-b border-0 appearance-none w-full text-gray-700 leading-tight outline-none"
                                            id="media_alt"
                                            name="media_alt"
                                            type="text"
                                            placeholder="Add photos*"
                                            value="Add Photos*"
                                        />
                                    )}

                                    <button
                                        onClick={() => pushToPage("/app/add-memory/add-media")}
                                        className={
                                            isEnum(values.cover_image) !== true
                                                ? "absolute top-8 right-0 flex flex-wrap items-center mx-auto justify-between px-6 py-2 text-sm leading-none bg-transparent text-blue-500 border-2 border-blue-500 rounded-full hover:border-blue-600 hover:text-white hover:bg-blue-600 lg:mt-0 disabled:opacity-50"
                                                : "absolute top-8 text-bold right-0 flex flex-wrap items-center mx-auto justify-between px-3 py-2 text-sm leading-none bg-transparent text-blue-500 border border-transparent rounded-full hover:text-afsp-blue-dark  lg:mt-0 disabled:opacity-50"
                                        }
                                    >
                                        {isEnum(values.photos) !== true ? (
                                            <span>Get Started</span>
                                        ) : (
                                            <span>Edit</span>
                                        )}
                                    </button>
                                </div>
                                {/* START Description of memory */}
                                <div className="relative w-full">
                                    {isEnum(values.description) !== true ? (
                                        <input
                                            readOnly
                                            className="text-xl py-8 border-b border-0 appearance-none w-full text-gray-700 leading-tight outline-none"
                                            id="description"
                                            name="description"
                                            type="text"
                                            aria-invalid={errors.description ? "true" : "false"}
                                            placeholder="Write a description"
                                            {...register("description", {required: false})}
                                        />
                                    ) : (
                                        <input
                                            readOnly
                                            className="text-xl py-8 border-b border-0 appearance-none w-full text-gray-700 leading-tight outline-none"
                                            id="description_alt"
                                            name="description_alt"
                                            type="text"
                                            value="Write a description"
                                        />
                                    )}

                                    {isEnum(values.cover_image) === true ? (
                                        <button
                                            onClick={() =>
                                                pushToPage("/app/add-memory/add-description")
                                            }
                                            className={
                                                isEnum(values.description) !== true
                                                    ? "absolute top-8 right-0 flex flex-wrap items-center mx-auto justify-between px-6 py-2 text-sm leading-none bg-transparent text-blue-500 border-2 border-blue-500 rounded-full hover:border-blue-600 hover:text-white hover:bg-blue-600 lg:mt-0 disabled:opacity-50"
                                                    : "absolute top-8 text-bold right-0 flex flex-wrap items-center mx-auto justify-between px-3 py-2 text-sm leading-none bg-transparent text-blue-500 border border-transparent rounded-full hover:text-afsp-blue-dark  lg:mt-0 disabled:opacity-50"
                                            }
                                        >
                                            {isEnum(values.description) !== true ? (
                                                <span>Add</span>
                                            ) : (
                                                <span>Edit</span>
                                            )}
                                        </button>
                                    ) : (
                                        <></>
                                    )}
                                </div>

                                {/* Description of memory END*/}
                                <div className="relative w-full">
                                    {isEnum(values.favorites) !== true ? (
                                        <input
                                            readOnly
                                            className="text-xl py-8 border-b border-0 appearance-none w-full text-gray-700 leading-tight outline-none"
                                            id="memories"
                                            name="memories"
                                            type="text"
                                            placeholder="Add memories"
                                            {...register("memories", {required: false})}
                                        />
                                    ) : (
                                        <input
                                            readOnly
                                            className="text-xl py-8 border-b border-0 appearance-none w-full text-gray-700 leading-tight outline-none"
                                            id="description_alt"
                                            name="description_alt"
                                            type="text"
                                            value="Add memories"
                                        />
                                    )}

                                    {isEnum(values.cover_image) === true ? (
                                        <button
                                            onClick={() => pushToPage("/app/add-memory/add-memories")}
                                            className={
                                                isEnum(values.favorites) !== true
                                                    ? "absolute top-8 right-0 flex flex-wrap items-center mx-auto justify-between px-6 py-2 text-sm leading-none bg-transparent text-blue-500 border-2 border-blue-500 rounded-full hover:border-blue-600 hover:text-white hover:bg-blue-600 lg:mt-0 disabled:opacity-50"
                                                    : "absolute top-8 text-bold right-0 flex flex-wrap items-center mx-auto justify-between px-3 py-2 text-sm leading-none bg-transparent text-blue-500 border border-transparent rounded-full hover:text-afsp-blue-dark  lg:mt-0 disabled:opacity-50"
                                            }
                                        >
                                            {isEnum(values.favorites) !== true ? (
                                                <span>Add</span>
                                            ) : (
                                                <span>Edit</span>
                                            )}
                                        </button>
                                    ) : (
                                        <></>
                                    )}
                                </div>

                                <div className="relative w-full">
                                    {isEnum(values.special_dates) !== true ? (
                                        <input
                                            readOnly
                                            className="text-xl py-8 border-b border-0 appearance-none w-full text-gray-700 leading-tight outline-none"
                                            id="special_dates"
                                            name="special_dates"
                                            type="text"
                                            placeholder="Special dates to remember"
                                            {...register("special_dates", {required: false})}
                                        />
                                    ) : (
                                        <input
                                            readOnly
                                            className="text-xl py-8 border-b border-0 appearance-none w-full text-gray-700 leading-tight outline-none"
                                            id="special_dates"
                                            name="special_dates"
                                            type="text"
                                            value="Special dates to remember"
                                        />
                                    )}

                                    {isEnum(values.cover_image) === true ? (
                                        <button
                                            onClick={() => pushToPage("/app/add-memory/add-dates")}
                                            className={
                                                isEnum(values.special_dates) !== true
                                                    ? "absolute top-8 right-0 flex flex-wrap items-center mx-auto justify-between px-6 py-2 text-sm leading-none bg-transparent text-blue-500 border-2 border-blue-500 rounded-full hover:border-blue-600 hover:text-white hover:bg-blue-600 lg:mt-0 disabled:opacity-50"
                                                    : "absolute top-8 text-bold right-0 flex flex-wrap items-center mx-auto justify-between px-3 py-2 text-sm leading-none bg-transparent text-blue-500 border border-transparent rounded-full hover:text-afsp-blue-dark  lg:mt-0 disabled:opacity-50"
                                            }
                                        >
                                            {isEnum(values.special_dates) !== true ? (
                                                <span>Add</span>
                                            ) : (
                                                <span>Edit</span>
                                            )}
                                        </button>
                                    ) : (
                                        <></>
                                    )}
                                </div>

                                {/* START include family and friends */}
                                <div className="relative w-full">
                                    {values.friends.length < 1 ? (
                                        <input
                                            readOnly
                                            className="text-xl py-8 border-b border-0 appearance-none w-full text-gray-700 leading-tight outline-none"
                                            id="friends"
                                            name="friends"
                                            type="text"
                                            placeholder="Include Friends and Family"
                                            {...register("friends", {required: false})}
                                        />
                                    ) : (
                                        <input
                                            readOnly
                                            className="text-xl py-8 border-b border-0 appearance-none w-full text-gray-700 leading-tight outline-none"
                                            id="friends_alt"
                                            name="friends_alt"
                                            type="text"
                                            value="Include Friends and Family"
                                        />
                                    )}

                                    {isEnum(values.cover_image) === true ? (
                                        <button
                                            onClick={() => pushToPage("/app/add-memory/add-friends")}
                                            className={
                                                values.friends.length < 1
                                                    ? "absolute top-8 right-0 flex flex-wrap items-center mx-auto justify-between px-6 py-2 text-sm leading-none bg-transparent text-blue-500 border-2 border-blue-500 rounded-full hover:border-blue-600 hover:text-white hover:bg-blue-600 lg:mt-0 disabled:opacity-50"
                                                    : "absolute top-8 text-bold right-0 flex flex-wrap items-center mx-auto justify-between px-3 py-2 text-sm leading-none bg-transparent text-blue-500 border border-transparent rounded-full hover:text-afsp-blue-dark  lg:mt-0 disabled:opacity-50"
                                            }
                                        >
                                            {values.friends.length < 1 ? (
                                                <span>Add</span>
                                            ) : (
                                                <span>Edit</span>
                                            )}
                                        </button>
                                    ) : (
                                        <></>
                                    )}
                                </div>
                                {/* include family and friends END */}

                                {/* START Theme color */}
                                <div className="relative w-full mt-8">
                                    <div className="md:flex items-center justify-center">
                                        <div
                                            className="text-xl pt-0 appearance-none w-full text-gray-700 leading-tight outline-none">
                                            Memory theme color
                                        </div>

                                        <div className="flex items-start  justify-start pt-5 md:pt-0 lg:justify-end">
                                            <div
                                                onClick={() => themeColorChange("blue")}
                                                className={
                                                    themeColor === "blue"
                                                        ? " border-2 border-black rounded-full cursor-pointer bg-blue-500 h-7 w-7 flex ml-2"
                                                        : "rounded-full cursor-pointer bg-blue-500 h-7 w-7 flex ml-2 md:mr-0 md:ml-2"
                                                }
                                            >
                                                {" "}
                                            </div>
                                            <div
                                                onClick={() => themeColorChange("green")}
                                                className={
                                                    themeColor === "green"
                                                        ? " border-2 border-black rounded-full cursor-pointer bg-green-300 h-7 w-7 flex ml-2"
                                                        : "rounded-full cursor-pointer bg-green-300 h-7 w-7 flex ml-2 md:mr-0 md:ml-2"
                                                }
                                            >
                                                {" "}
                                            </div>
                                            <div
                                                onClick={() => themeColorChange("yellow")}
                                                className={
                                                    themeColor === "yellow"
                                                        ? " border-2 border-black rounded-full cursor-pointer bg-yellow-300 h-7 w-7 flex ml-2"
                                                        : "rounded-full cursor-pointer bg-yellow-300 h-7 w-7 flex ml-2 md:mr-0 md:ml-2"
                                                }
                                            >
                                                {" "}
                                            </div>
                                            <div
                                                onClick={() => themeColorChange("red")}
                                                className={
                                                    themeColor === "red"
                                                        ? " border-2 border-black rounded-full cursor-pointer bg-red-400 h-7 w-7 flex ml-2"
                                                        : "rounded-full cursor-pointer bg-red-400 h-7 w-7 flex ml-2 md:mr-0 md:ml-2"
                                                }
                                            >
                                                {" "}
                                            </div>
                                            <div
                                                onClick={() => themeColorChange("pink")}
                                                className={
                                                    themeColor === "pink"
                                                        ? " border-2 border-black rounded-full cursor-pointer bg-pink-300 h-7 w-7 flex ml-2"
                                                        : "rounded-full cursor-pointer bg-pink-300 h-7 w-7 flex ml-2 md:mr-0 md:ml-2"
                                                }
                                            >
                                                {" "}
                                            </div>
                                            <div
                                                onClick={() => themeColorChange("white")}
                                                className={
                                                    themeColor === "white"
                                                        ? " border-2 border-black rounded-full cursor-pointer bg-white h-7 w-7 flex ml-2"
                                                        : "border-1 rounded-full cursor-pointer bg-white h-7 w-7 flex ml-2 md:mr-0 md:ml-2"
                                                }
                                            >
                                                {" "}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                {/* Theme color END */}
                            </div>
                        </form>
                    </div>
                    <div className="order-1 lg:order-2 pt-20 md:pt-32 lg:pt-5">
                        {state.data.access_token.length > 10 &&
                        state.data.status_id >= 1 ? (
                            <div className="edit-memory-active px-5 md:px-0">
                                <SideComponent
                                    handleDelete={handleDelete}
                                    text1={`In memory of ${values.name}`}
                                    text2={state.data.pending_memories_count}
                                    thumbnail={imageUrl}
                                    token={state.data.access_token}
                                />
                            </div>
                        ) : (
                            <div className="edit-memory-inactive">
                                <SideComponent
                                    text1="The healing process is different for everyone, and we’re here to help ease that process if only a little bit. "
                                    text2="The first step in creating your digital memory is by uploading a photo or video.  Then add as much or as little as you want beyond that . You can even invite others to share memories as well. "
                                    thumbnail=""
                                />
                            </div>
                        )}
                    </div>

                    <InfoModalComp
                        isVisible={false}
                        text1={
                            "The healing process is different for everyone, and we’re here to help ease that process if only a little bit. "
                        }
                        text2={
                            "The first step in creating your digital memory is by uploading a photo or video.  Then add as much or as little as you want beyond that . You can even invite others to share memories as well. "
                        }
                    ></InfoModalComp>
                </section>
                <Modal
                    title="Alert"
                    visible={isModalVisible}
                    onOk={completeEdit}
                    onCancel={hideModal}
                    okText={"Agree And Submit"}
                    cancelText={"Cancel"}
                    okButtonProps={{type: "primary"}}
                    cancelButtonProps={{type: "default "}}
                    footer={[
                        <button
                            key="submit"
                            className="primary"
                            type="primary"
                            loading={loading}
                            onClick={completeEdit}
                        >
                            Agree And Submit
                        </button>,
                        <button className="secondary" key="back" onClick={hideModal}>
                            Cancel
                        </button>,
                    ]}
                    className="submit-modal"
                >
                    <h2>Submitting these sections requires approval</h2>
                    <p>
                        Updating <b>photos</b>, <b>descriptions</b>, and <b>memories</b>{" "}
                        requires AFSP to approve before being posted. There will be a{" "}
                        <b>15 min grace period</b> before submission for any last minute
                        edits. You will be notified once approved.
                    </p>
                </Modal>
                {renderButton()}
            </Spin>
        </>
    )
}

export default UpdateMemoryOf
