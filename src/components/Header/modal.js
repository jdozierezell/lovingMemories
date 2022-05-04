import { Link } from "gatsby"
import PropTypes from "prop-types"
import React, { useState } from "react"
import { StaticImage } from "gatsby-plugin-image"

import { VscClose } from 'react-icons/vsc'; 

function Main({ siteTitle }) {
  const [isExpanded, toggleExpansion] = useState(false)

  return (
    <nav className="md:absolute w-full flex flex-wrap items-center justify-between p-4  bg-transparent ">
      <div className="flex items-center flex-shrink-0 mr-6 text-black ">
        <span className="text-xl font-semibold tracking-tight">
          <Link to="/">
          <button
            href="#download"
            className="text-2xl leading-none text-black border border-black rounded-full h-14 w-14 flex flex-col items-center justify-center hover:border-transparent hover:text-white hover:bg-black lg:mt-0"
          >
            <VscClose />
          </button>
          </Link>
        </span>
      </div>
    </nav>
  )
}

Main.propTypes = {
  siteTitle: PropTypes.string,
}

Main.defaultProps = {
  siteTitle: ``,
}

export default Main
