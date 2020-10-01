/* eslint-disable react/prop-types */
import React from 'react'
import withIconStyles from './HOC/withIconStyles'
import SVG from './common/SVG'

const IconFolders = (props) => (
  <SVG
    xmlns="http://www.w3.org/2000/svg"
    width="17.352"
    height="17.352"
    viewBox="0 0 17.352 17.352"
    {...props}
  >
    <g transform="translate(0 0)">
      <path d="M16.843,4.14H14.975c0-.315.04-.537-.149-.727L11.562.149A.509.509,0,0,0,11.2,0H2.885a.509.509,0,0,0-.508.508V3.1H1.694A1.7,1.7,0,0,0,0,4.79V16.169a1.188,1.188,0,0,0,1.186,1.182H16.165a1.187,1.187,0,0,0,1.186-1.186V4.648A.509.509,0,0,0,16.843,4.14Zm-5.133-2.4L13.24,3.265H11.711ZM3.393,1.017h7.3V3.773a.508.508,0,0,0,.508.508h2.756V6.146H6.676c0-1.465.035-1.612-.13-2.006A1.7,1.7,0,0,0,4.982,3.1H3.393ZM16.335,16.165a.17.17,0,0,1-.169.169H1.186a.17.17,0,0,1-.169-.169V4.79a.679.679,0,0,1,.678-.678,27.04,27.04,0,0,1,3.479.028.679.679,0,0,1,.486.65V6.654a.509.509,0,0,0,.508.508h9.489a.678.678,0,0,1,.678.678Zm0-9.878a1.682,1.682,0,0,0-.678-.142h-.682V5.157h1.36Z" />
      <path
        d="M98.723,259H89.746a1.188,1.188,0,0,0-1.186,1.186v3.592a1.187,1.187,0,0,0,1.186,1.186h8.977a1.187,1.187,0,0,0,1.186-1.186v-3.592A1.188,1.188,0,0,0,98.723,259Zm.169,4.778a.17.17,0,0,1-.169.169H89.746a.17.17,0,0,1-.169-.169v-3.592a.17.17,0,0,1,.169-.169h8.977a.17.17,0,0,1,.169.169Z"
        transform="translate(-85.559 -250.223)"
      />
      <path
        d="M161.454,332h-5.821a.508.508,0,0,0,0,1.017h5.821a.508.508,0,0,0,0-1.017Z"
        transform="translate(-149.868 -320.749)"
      />
    </g>
  </SVG>
)

export default withIconStyles(IconFolders)
