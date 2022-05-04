import React, {useState, useEffect, useRef} from "react"
import {Form, DatePicker, Checkbox, Spin, Input} from "antd"
import {
    MinusCircleOutlined,
    PlusOutlined,
    LoadingOutlined,
} from "@ant-design/icons"

import moment from "moment"

import "./date.css"

import Header from "../Header/headerPlain"
import SideComponent from "../AddMemory/memory-side"

import {useForm} from "react-hook-form"
import {useStateMachine} from "little-state-machine"
import updateAction from "../../utils/updateAction"

import {Divider} from "antd"

import {handleAPIPost} from "../../utils/auth"
import {navigate} from "gatsby"

import InfoModalComp from "./InfoModalComp"

const config = {
    rules: [
        {
            type: "object",
            initialValues:'select',
            whitespace: true,
            required: true,
            message: "* Please select a Date",
        },
    ],    
}

const AddDates = () => {
    const {state, actions} = useStateMachine({updateAction})
    const {
        formState: {errors, isValid},
    } = useForm()

    const [loading, setLoading] = useState(false)
    const loadingIcon = <LoadingOutlined style={{fontSize: 50}} spin/>

    const dateFormat = "YYYY/MM/DD"

    const [fieldsArray, setFieldsArray] = useState([1])
    const [isChecked, setIsChecked] = useState(false)
    const [userName, setUserName] = useState("")

    const myRef = useRef(null);

    const onChange = e => {
        //console.log('Change:', e.target.value);
    }

    const handleSuccess = data => {
        setLoading(false)
        navigate("/app/add-memory/in-memory-of")
    }

    const handleErrors = data => {
        console.log("error")
        setLoading(false)
    }

    const onFinish = restField => {

        console.log(fieldsArray);

        setLoading(true)

        /* ittirating through form list data */
        let newArray = []
        Array.prototype.forEach.call(restField.dates, (element, index) => {
            const values = {
                ...restField.dates[index],
                date: element["date"].format("YYYY-MM-DD"),
            }
            newArray.push(values)
        })


        navigate("/app/add-memory/in-memory-of")

        /* setting global state */
        let newData = state.data
        newData.special_dates = newArray
        newData.memory_reminder = isChecked
        actions.updateAction(newData)

        /* data for posting */
        let values = {
            special_dates: newArray,
            memory_reminder: isChecked,
            memory_access_token: state.data.access_token,
        }

        /* post to API */
        handleAPIPost(
            "memory/add/special-dates",
            values,
            state.data.auth_token,
            handleSuccess,
            handleErrors
        )

    }

    const onChangeCheck = e => {
        if (e.target.checked) {
            setIsChecked(1)
        } else {
            setIsChecked(0)
        }
    }

    const form = useRef(null)

    useEffect(() => {
        setUserName(state.data.name.split(" ")[0])
        let newData = state.data.special_dates
        let newArray = []

        console.log(newData);

        try {

        /* get data from global and mutate date for display */
        newData.map((items, index) => {
            const values = {
                date: moment(newData[index].date),
                name: newData[index].name,
            }
            newArray.push(values)
        })

      } catch (e) {
console.log('Error')
}

        setIsChecked(0)

        /* set form data values */
        //form.current.setFieldsValue({dates: newArray});

        //alert(newArray.length)

        /* if (newArray.length === 0) {
            myRef.current.dispatchEvent(
                new MouseEvent('click', {
                    view: window,
                    bubbles: true,
                    cancelable: true,
                    buttons: 1,
                }),
            );
        } */

        if (newArray.length > 0) {
            form.current.setFieldsValue({dates: newArray});
        }


    }, [])

    return (
        <>
            <Spin spinning={loading} indicator={loadingIcon}>
                <Header
                    goBack={true}
                    gobackUrl={"/in-memory-of"}
                    title={"Add special dates"}
                />
                <section className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    <div className="order-2 lg:order-1">
                        <div className="px-5 md:px-14 lg:px-20 mt-0 md:mt-10">
                            <Form
                                ref={form}
                                name="time_related_controls"
                                initialValues={{dates: fieldsArray}}
                                onFinish={onFinish}
                            >
                                <div className="">
                                    <h4 className="block text-gray-900 pb-10 max-w-2xl">
                                        Are there any meaningful dates that you associate with{" "}
                                        <span className="capitalize ">{userName}</span>?
                                    </h4>
                                    <div className="pb-10">
                                        <Checkbox checked={isChecked} onChange={onChangeCheck}>
                                            I would like to receive memory reminders based on dates I
                                            choose
                                        </Checkbox>
                                    </div>
                                    <Form.List name="dates">

                                        {(fields, {add, remove}) => (
                                            <>
                                                {fields.map(({key, name, fieldKey, ...restField}) => (
                                                    <>
                                                        <div
                                                            key={key}
                                                            className="flex flex-col md:flex-row items-center justify-start gap-4 md:gap-8 mb-10 md:mb-0 h-auto mt-8 md:h-20 text-xl"
                                                        >
                                                            <Form.Item
                                                                className="date-input h-full w-full md:w-1/2 flex items-center"
                                                                {...restField}
                                                                name={[name, "date"]}
                                                                fieldKey={[fieldKey, "date"]}
                                                                {...config}
                                                            >
                                                                <DatePicker
                                                                    autoFocus
                                                                    format={dateFormat}
                                                                    size={"large"}
                                                                    bordered={false}
                                                                    className="w-full h-full text-xl"
                                                                />
                                                            </Form.Item>
                                                            <Form.Item
                                                                className="date-input h-10 md:h-20 w-full md:w-1/2 flex items-center"
                                                                {...restField}
                                                                name={[name, "name"]}
                                                                fieldKey={[fieldKey, "name"]}
                                                                rules={[
                                                                    {
                                                                        required: true,
                                                                        message: "* Please add a meaning",
                                                                    },
                                                                ]}
                                                            >
                                                                <Input
                                                                    bordered={false}
                                                                    showCount
                                                                    maxLength={20}
                                                                    onChange={onChange}
                                                                    placeholder="Please add a meaning"
                                                                    className="text-lg h-full border-0 appearance-none w-full py-2 text-gray-700 leading-tight outline-none"
                                                                />
                                                            </Form.Item>
                                                            <MinusCircleOutlined
                                                                className="self-end md:self-center"
                                                                onClick={() => remove(name)}
                                                            />
                                                        </div>
                                                        <Divider/>
                                                    </>
                                                ))}

                                                <div className="mt-10">
                                                    <Form.Item>
                                                        <button ref={myRef}
                                                                className="flex flex-wrap items-start justify-between px-6 py-3 text-bold leading-none bg-transparent text-base text-afsp-blue hover:text-afsp-blue-dark lg:mt-0"
                                                                onClick={() => add()}
                                                        >
                                                            <PlusOutlined size={24} className="mr-2"/> Add A
                                                            Date
                                                        </button>
                                                    </Form.Item>
                                                </div>
                                            </>

                                        )}
                                    </Form.List>
                                </div>

                                <div
                                    className="memory-fields-footer fixed bg-white w-full bottom-0 left-0 text-center p-2 lg:p-8 border-t-2"> {/* md:p-8 */}
                                    <button
                                        type="submit"
                                        className="flex flex-wrap items-center mx-auto justify-between px-14 py-3 mt-2 mb-2 text-sm leading-none bg-transparent text-blue-600 border-2 border-blue-600 rounded-full hover:border-blue-600 hover:text-white hover:bg-blue-600 lg:mt-0 disabled:opacity-50"
                                    >
                                        Done
                                    </button>
                                </div>
                            </Form>
                        </div>
                    </div>
                    <div className="order-1 lg:order-2">
                        <SideComponent
                            text1="Anniversaries and important dates can be tough but they also help us heal. Add some dates you associate with your loved one. This could be a birthday, wedding anniversary, date of death, their favorite holiday."
                            text2=""
                        />
                    </div>

                    <InfoModalComp
                        isVisible={false}
                        bottom={"mb-20"}
                        text1={
                            "Anniversaries and important dates can be tough but they also help us heal. Add some dates you associate with your loved one. This could be a birthday, wedding anniversary, date of death, their favorite holiday."
                        }
                        text2={""}
                    ></InfoModalComp>
                </section>
            </Spin>
        </>
    )
}

export default AddDates
