import React, { useState } from "react"
import { useStateMachine } from "little-state-machine"

import { useEffect } from "react"
import "antd/dist/antd.css"
import "./balloon.css" // Import css modules stylesheet as styles
import { handleAPIPost } from "../../utils/auth"
import { Spin } from "antd"
import { LoadingOutlined } from "@ant-design/icons"
import { navigate } from "gatsby"

const Balloon = () => {
  const getUser = () =>
    window.localStorage.userData ? JSON.parse(window.localStorage.userData) : {}

  const random = num => {
    return Math.floor(Math.random() * (num - num / 5 + 1) + num / 5)
  }
  const loadingIcon = <LoadingOutlined style={{ fontSize: 50 }} spin />
  const [memoriesItems, setMemoriesItems] = useState([])
  const [memoriesExtraItems, setMemoriesExtraItems] = useState([])
  const [memoriesLength, setMemoriesLength] = useState({})
  const [scrolledEnd, setScrolledEnd] = useState(false)
  const [scrolledFetch, setScrolledFetch] = useState(false)

  let top = 0
  let details = {}
  let memorySet
  let memoryLength
  let fetchCount = 0

  const getRandomStyles = img => {
    top++

    var r = random(255)
    var g = random(255)
    var b = random(255)
    var mt = top
    /*   var ml = 0;
          var dur = 60; */

    if (top === 2 || top === 0) {
      top = 0
      mt = 50
    } else {
      mt = 30
    }

    return `
              background-color: rgba(${r},${g},${b},0.7);
              background-image: url('${img}');
              background-size:cover;
              background-position:top center;
              color: rgba(${r},${g},${b},0.7); 
              margin: ${mt}px ${mt}px 0 15px;
              cursor:pointer;
             
              `
  }

  const createBalloons = memObj => {
    let balloonContainer = document.getElementById("balloon-container")

    for (let i = 0; i < memObj.length; i++) {
      let balloon = document.createElement("div")
      balloon.setAttribute("token", memObj[i].access_token)

      if (memObj[i].name.length > 18) {
        balloon.setAttribute(
          "name",
          memObj[i].name.substring(0, 15).toLowerCase() + "..."
        )
      } else {
        balloon.setAttribute("name", memObj[i].name.toLowerCase())
      }

      balloon.className = "balloon"
      balloon.style.cssText = getRandomStyles(memObj[i].thumbnail)
      balloon.onclick = e => getPreviewData(e)
      balloonContainer.append(balloon)
    }
  }

  const handleSuccess = mem => {
    setScrolledEnd(false)
    memorySet = mem.memories
    memoryLength = memorySet.length
    setMemoriesItems(memorySet)
    setMemoriesLength(memoryLength)

    if (memorySet !== null) {
      createBalloons(memorySet)
    }
  }

  const handleNextSuccess = mem => {
    //setScrolledEnd(false);
    if (mem.memories.length > 0) {
      if (memorySet.length > 0) {
        //memorySet.concat(memorySet, mem.memories);
        //setMemoriesLength(memoriesItems.length);
        memoryLength = mem.memories.length
        setMemoriesItems(mem.memories)
        createBalloons(mem.memories)
        setScrolledEnd(false)
        setTimeout(function () {
          fetchCount = 0
          scrolled = false
        }, 3000)
      }
    }
  }

  const fetchMoreData = () => {
    if (fetchCount <= 1) {
      //console.log('fetch');
      details = {
        offset: document.querySelectorAll("#balloon-container .balloon").length,
        limit: 50,
      }
      handleAPIPost(
        "memory/latest",
        details,
        "",
        handleNextSuccess,
        handleNextErrors
      )
    }
  }

  const handleErrors = msg => {
    //console.log(msg);
  }
  const handleNextErrors = msg => {
    //console.log(msg);
  }

  const handlePreviewSuccess = data => {
    //console.log(data);
  }

  const handlePreviewErrors = data => {
    console.log("error")
  }

  const getPreviewData = e => {
    let data_token = e.target.getAttribute("token")

    //       let details = {
    //          'access_token': data_token
    //      }

    //console.log(data_token)

    const prevURL = "/view-memory/#" + data_token
    navigate(prevURL)

    //handleAPIPost('memory/info', details, getUser().token, handlePreviewSuccess, handlePreviewErrors);
  }

  // scroll functions
  let scrolled = false
  let element
  function onScroll(event) {
    let element = event.target
    /*
                //console.log("element.scrollHeight - element.scrollTop: " + (element.scrollHeight - element.scrollTop));
                //console.log("element.clientHeight: " + Math.round(element.clientHeight + element.clientHeight/3)); */

    //console.log(element.scrollHeight - element.scrollTop);
    if (window.innerWidth < 900) {
      if (
        element.scrollWidth - element.scrollLeft <=
        element.clientWidth + element.clientWidth / 3
      ) {
        if (fetchCount <= 1) {
          fetchCount++
          scrolled = true
          setScrolledEnd(true)
          fetchMoreData()
        }
      }
    } else {
      if (
        element.scrollHeight - element.scrollTop <=
        Math.round(element.clientHeight + element.clientHeight / 5)
      ) {
        if (fetchCount <= 1) {
          fetchCount++
          scrolled = true
          setScrolledEnd(true)
          fetchMoreData()
        }
      }
    }
  }

  useEffect(() => {
    details = {
      offset: document.querySelectorAll("#balloon-container .balloon").length,
      limit: 8,
    }
    handleAPIPost("memory/latest", details, "", handleSuccess, handleErrors)

    element = document.getElementById("balloonHolder")
    if (element !== null) {
      let timer = null
      timer = setInterval(() => {
        if (window.innerWidth < 900) {
          element.scrollLeft += 1
        } else {
          element.scrollTop += 1
        }
      }, 80)
      element.addEventListener("mouseenter", () => {
        clearTimeout(timer)
      })
      element.addEventListener("mouseleave", () => {
        timer = setInterval(() => {
          if (window.innerWidth < 900) {
            element.scrollLeft += 1
          } else {
            element.scrollTop += 1
          }
        }, 80)
      })
      element.addEventListener("mousewheel", () => {
        clearTimeout(timer)
      })

      if (scrolledEnd == false) {
        element.addEventListener("scroll", onScroll, { passive: true })
      } else {
        element.removeEventListener("scroll", onScroll, { passive: true })
      }
    }
    return () => {
      window.removeEventListener("scroll", onScroll)
    }
  }, [])

  return (
    <div className="relative lg:px-10">
      <div id="balloonHolder" className="balloon-holder">
        <div id="balloon-container">
          {scrolledEnd && (
            <div className="absolute bottom-0 left-0 flex items-center justify-end pr-10 w-full z-20 h-20 bg-opacity-0">
              <LoadingOutlined
                style={{ fontSize: 40, color: "#3369ff" }}
                spin
              />
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Balloon
