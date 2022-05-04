import {Link, navigate} from "gatsby"
import PropTypes from "prop-types"
import React, { useState } from "react"
import { isLoggedIn } from "../../utils/auth"

const HeaderFriend = ({ title }) => {

  const [isExpanded, toggleExpansion] = useState(false)
  const [ isUserLoggedIn, setIsUserLoggedIn ] = useState(isLoggedIn)

  const handleCancel = () => {
      navigate("/");
  }

  return (
    <nav className="relative w-full flex md:flex-wrap items-center justify-between p-4 px-10  bg-transparent z-10">
      <div className="flex items-center">
        <h5>
            {title}
        </h5>
      </div>
      <div className="block lg:hidden">
        <button
          onClick={() => toggleExpansion(!isExpanded)}
          className="flex items-center px-3 py-2 text-white border border-white rounded hover:text-white hover:border-white"
        >
          <svg
            className="w-3 h-3 fill-current"
            viewBox="0 0 20 20"
            xmlns="http://www.w3.org/2000/svg"
          >
            <title>Menu</title>
            <path d="M0 3h20v2H0V3zm0 6h20v2H0V9zm0 6h20v2H0v-2z" />
          </svg>
        </button>
      </div>
      <div
        className="flex items-center justify-items-center w-auto"
      >
        
        <div>

          {(isUserLoggedIn) ? (

          <button
            onClick={() => handleCancel()}
            className="inline-block px-8 py-2 w-20 md:w-auto text-xs md:text-lg leading-none bg-white text-blue-500 border border-transparent rounded-full hover:border-transparent hover:text-black hover:bg-transparent lg:mt-0"
          >
            <b>Cancel</b>
          </button>          

          ) : (

  <Link to="/app/profile">
          <button
            className="btn-signin inline-block px-8 py-2 w-20 md:w-auto text-xs md:text-lg leading-none bg-white text-blue-500 border border-blue-500 rounded-full  hover:text-white hover:bg-blue-500 lg:mt-0"
          >
            Sign In
          </button>
          </Link>
          )}

          


        </div>
      </div>
    </nav>
  )
}

HeaderFriend.propTypes = {
  siteTitle: PropTypes.string,
}

HeaderFriend.defaultProps = {
  siteTitle: ``,
}

export default HeaderFriend
