import React from "react";
import ContentLoader from "react-content-loader"


const ImagePlaceholder = () => (
  <ContentLoader viewBox="0 0 300 300" height={300} width={300} speed={3}>
    {/* Only SVG shapes */}    
    <rect x="0" y="0" rx="150" ry="150" width="300" height="300" />
  </ContentLoader>
)

export default ImagePlaceholder

