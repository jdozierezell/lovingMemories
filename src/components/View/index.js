import React from "react"
import PropTypes from "prop-types"
import { view } from "./view.module.css"

const View = ({ children }) => (
  <section className={view}>

    <div style={{
        margin: `0 auto`,
        maxWidth: 1920,       
    }}
    >
        {children}

    </div>
  </section>
)

export default View
