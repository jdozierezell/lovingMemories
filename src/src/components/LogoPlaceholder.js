import React from "react";
import ContentLoader from "react-content-loader"


const MemoryPlaceholder = () => (
  <ContentLoader
    height={75}
    speed={1}
    viewBox="0 0 215 75"
  >
    {/* Only SVG shapes */}
    <rect x="20" y="25" rx="25" ry="25" width="50" height="50" />
    <rect x="80" y="30" rx="0" ry="0" width="120" height="10" />
    <rect x="80" y="45" rx="0" ry="0" width="120" height="10" />
    <rect x="80" y="60" rx="0" ry="0" width="120" height="10" />
  </ContentLoader>
)

export default MemoryPlaceholder

