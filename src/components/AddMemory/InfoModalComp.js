import React, { useState } from "react"
import { Modal, Button } from "antd"
import { BsLifePreserver } from "react-icons/bs"

import PropTypes from "prop-types"
import "./info_modal.css"

import { AiOutlineCloseCircle } from "react-icons/ai"
import { VscClose } from 'react-icons/vsc';

import logo from '../../images/gatsby-icon.svg'

function InfoModalComp({ text1, text2, bottom }) {
  const [isModalVisible, setIsModalVisible] = useState(false)

  const showModal = () => {
    setIsModalVisible(true)
  }

  const handleOk = () => {
    setIsModalVisible(false)
  }

  const handleCancel = () => {
    setIsModalVisible(false)
  }

  return (
    <div className="fixed top-0 left-0 h-full w-screen z-20 pointer-events-none">
      <div
        onClick={showModal}
        className={`absolute bottom-0 right-0 p-4 block lg:hidden z-20 pointer-events-auto ${bottom}`}
      >
        <img src={logo} className="logo w-10" placeholder="white" alt="logo"/>
      </div>

      <Modal
        visible={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
        closable={false}
        footer={null}
        className="new-modal"
      >
        <button
          onClick={handleCancel}
          type="button"
          aria-label="Close"
          className="ant-modal-close left-0 m-1"
        >
          <span className="ant-modal-close-x">
            <span
              role="img"
              aria-label="close"
              className="anticon anticon-close ant-modal-close-icon"
            >                              
                <div className="bg-transparent rounded-full w-10 h-10 flex items-center justify-center p-0 cursor-pointer border-2 border-black z-10 text-black">
                    <VscClose size={20} />
                </div>

                
             
            </span>
          </span>
        </button>

        <p>
          <span className="flex items-center justify-center w-full text-center mx-auto">
             <img src={logo} className="logo w-16" placeholder="white" alt="logo"/>
          </span>
        </p>
        <p> {text1} </p>
        <p> {text2} </p>
        <p>
          If you are experiences a crisis <br />
          <a className="underline" href="#">
            Please get immediate help
          </a>
        </p>
      </Modal>
    </div>
  )
}

export default InfoModalComp
