import React from "react";
import ContentLoader from "react-content-loader"


const NotificationPlaceholder = () => (
  <ContentLoader viewBox="0 0 100 100" height={100} width={100} speed={3}>
    {/* Only SVG shapes */}    
    <rect x="0" y="0" rx="50" ry="50" width="100" height="100" />
  </ContentLoader>
)

export default NotificationPlaceholder