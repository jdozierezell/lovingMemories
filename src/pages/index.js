import React, { useEffect, useState } from "react"
import { Link } from "gatsby"
import Header from "../components/Header/headerWithNav"
import Seo from "../components/seo"

import { FaSearch } from "react-icons/fa"
import { FaPlus } from "react-icons/fa"
import { navigate } from "gatsby"

import Balloon from "../components/Balloon/Balloon"
import TextLoop from "react-text-loop"
import { StateMachineProvider, useStateMachine } from "little-state-machine"
import { DevTool } from "little-state-machine-devtools"

import "./landing.css"

const IndexPage = () => {
  const beginAgain = () => {
    window.localStorage.start = "true"

    navigate("/app/add-memory")
  }

  useEffect(() => {
    let search = window.location.search
    let params = new URLSearchParams(search)
    let directLink = params.get("add")

    if (directLink === 1 || directLink === "1") {
      beginAgain()
    }
  }, [])

  return (
    <div className="h-screen  overflow-hidden">
      <StateMachineProvider>
        {/*  <DevTool/>          */}
        <Header />

        <Seo
          title="Home"
          image="https://lovingmemories.afsp.org/svg/afsp-memories-social.jpg"
        />

        <div id="grid" className="h-screen gap-0 w-screen">
          <div id="areaA" className="flex items-center justify-center">
            <div className="p-6 pt-10">
              <h1 className="font-bold text-center text-4xl md:text-5xl lg:text-6xl lg:text-left">
                In memory of <br />
                my{" "}
                <span>
                  {" "}
                  <TextLoop
                    springConfig={{ stiffness: 180, damping: 8 }}
                    mask={true}
                    interval={6000}
                    children={[
                      "friend",
                      "mother",
                      "brother",
                      "son",
                      "sister",
                      "cousin",
                      "father",
                      "aunt",
                      "husband",
                      "teacher",
                      "uncle",
                      "daughter",
                      "colleague",
                      "wife",
                      "student",
                    ]}
                  />
                </span>
              </h1>

              <p className="my-5 md:my-10 text-center lg:text-left max-w-lg">
                The digital quilt is where suicide loss survivors can honor and
                share stories about their loved ones.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-1">
                <div className="mx-auto">
                  <button
                    onClick={() => beginAgain()}
                    className="btn-solid flex flex-wrap items-center justify-between px-8 py-3 mt-0 md:mt-4 text-xs md:text-sm leading-none bg-blue-500 text-white border border-blue-500 rounded-full hover:border-blue-900 hover:bg-blue-900 hover:text-white lg:mt-0"
                  >
                    <FaPlus className="mr-2" /> Add a Memory
                  </button>
                </div>
                <div className="mx-auto">
                  <Link to="/search">
                    <button className="flex flex-wrap items-center justify-between px-8 py-3 mt-4 text-xs md:text-sm leading-none text-blue-500 border-2 border-blue-500 rounded-full hover:border-transparent hover:text-white hover:bg-blue-900 lg:mt-0">
                      <FaSearch className="mr-2" /> Find a Memory
                    </button>
                  </Link>
                </div>
              </div>
            </div>
          </div>

          <div id="areaB">
            <div id="balloonWrap" className="-mt-6 md:-mt-20 lg:mt-0 w-full">
              <Balloon />
            </div>
          </div>
        </div>
      </StateMachineProvider>
    </div>
  )
}

export default IndexPage
