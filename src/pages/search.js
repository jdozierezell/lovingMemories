import React, { useState, useEffect, useRef, useCallback } from "react"

import debounce from "lodash.debounce"

import Layout from "../components/Layout"
import View from "../components/View"
import Header from "../components/Header/modal"
import Seo from "../components/seo"

import "../components/Layout/search.css" // Import css modules stylesheet as styles
import { StateMachineProvider } from "little-state-machine"
import { handleAPIPost } from "../utils/auth"

import { LoadingOutlined } from "@ant-design/icons"

import { FaSearch } from "react-icons/fa"
import { IoMdClose } from "react-icons/io"
import { CgSpinner } from "react-icons/cg"

import { Spin } from "antd"

import "../pages/grid.css"

import _ from "lodash"

const Search = () => {
  const loadingIcon = <LoadingOutlined style={{ fontSize: 50 }} spin />

  const [loading, setLoading] = useState(false)

  const [isStart, setIsStart] = useState(true)

  const [search, setSearch] = useState("")

  const [allData, setAllData] = useState([])

  const [filteredData, setFilteredData] = useState(allData)

  const handleSearch = e => {
    let value = e.target.value.toLowerCase()
    setSearch(value)
    debounce(value)
  }

  const debounce = useCallback(
    _.debounce(_searchVal => {
      setSearch(_searchVal)
      setLoading(true)
      setIsStart(false)
      setAllData([])
      handleAPIPost(
        "memory/search",
        { s: _searchVal },
        "",
        handleSuccess,
        handleErrors
      )
    }, 1000),
    []
  )

  const handleSuccess = msg => {
    setAllData(msg.memories)

    setTimeout(() => {
      setLoading(false)
    }, 2000)
  }

  const handleErrors = error => {}

  const clearSearch = () => {
    setSearch("")
  }

  useEffect(() => {
    setSearch("")
  }, [])

  return (
    <>
      <StateMachineProvider>
        <Layout>
          <div className="top-0 fixed w-full z-10">
            <Header />
          </div>

          <Seo title="Home" />

          <div
            id="search-comp"
            className="lg:flex overflow-hidden z-20 pl-0 md:pl-5"
          >
            <div
              id="search-comp-search"
              className="w-full lg:max-w-sm flex items-center justify-center"
            >
              <div className="w-full text-center lg:text-left items-center justify-items-center p-4 md:-mt-20">
                <div>
                  <h1 className="font-bold text-center text-3xl md:text-5xl lg:text-left pt-10">
                    In memory of
                  </h1>
                  <div className="flex items-center justify-between border-b-2 mt-10">
                    <input
                      className="w-full h-16 focus:outline-none"
                      value={search}
                      placeholder="Search"
                      type="text"
                      onChange={event => handleSearch(event)}
                    />{" "}
                    {search == 0 ? (
                      <FaSearch />
                    ) : (
                      <IoMdClose
                        className="cursor-pointer"
                        onClick={clearSearch}
                      />
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div
              id="search-comp-content"
              className="overflow-y-auto relative flex justify-center w-full"
            >
              {isStart ? (
                <div className="flex lg:flex-wrap items-center justify-start md:justify-center overflow-x-auto h-full">
                  <p className="text-gray-400">Search for a ...</p>
                </div>
              ) : (
                <></>
              )}

              {allData.length === 0 && isStart === false ? (
                <div className="flex lg:flex-wrap items-center justify-start md:justify-center overflow-x-auto h-full">
                  <p>No Data Found</p>
                </div>
              ) : (
                <></>
              )}

              {allData.length > 0 && (
                <div className="flex lg:flex-wrap items-center justify-start md:justify-center overflow-x-auto h-full">
                  {loading ? (
                    <div className="absolute flex justify-center items-center top-0 left-0 w-full h-full bg-white bg-opacity-50 z-20">
                      <Spin spinning={loading} indicator={loadingIcon}></Spin>
                    </div>
                  ) : (
                    <></>
                  )}

                  {allData.map((value, index) => {
                    return (
                      <a
                        key={index}
                        href={"/view-memory/#" + value.access_token}
                        className="search-ball m-8"
                        name={value.name.substring(0, 15).toLowerCase()}
                        style={{
                          backgroundImage: "url(" + value.thumbnail + ")",
                        }}
                      ></a>
                    )
                  })}
                </div>
              )}
            </div>
          </div>
        </Layout>
      </StateMachineProvider>
    </>
  )
}

export default Search
