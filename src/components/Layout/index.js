import React from "react"
import { Helmet } from "react-helmet"

// Global styles and component-specific styles.
import "./global.css"
//import { main } from "./main.module.css"
// <main className={main}>{children}</main>

const Layout = ({ children }) => (
  <>
    <Helmet title="American Foundation for Suicide Prevention" />
        <main className="h-screen">{children}</main>
  </>
)

export default Layout
