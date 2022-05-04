import React from "react";
import ContentLoader from "react-content-loader"


const MemoryPlaceholder = () => (
  <ContentLoader viewBox="0 0 192 192" height={192} width={192} speed={3}>
    {/* Only SVG shapes */}    
    <rect x="0" y="0" rx="96" ry="96" width="192" height="192" />
  </ContentLoader>
)

export default MemoryPlaceholder

