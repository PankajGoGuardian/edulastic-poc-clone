import React from 'react'
import SVG from './common/SVG'
import withIconStyles from './HOC/withIconStyles'

const IconTwitch = () => {
  return (
    <SVG
      xmlns="http://www.w3.org/2000/svg"
      width="14"
      height="14"
      viewBox="0 0 14 14"
      fill="none"
    >
      <g clipPath="url(#clip0_4072_478)">
        <path
          d="M0.91198 0L0 2.43203V12.159H3.34237V13.9839H5.16717L6.99016 12.159H9.7254L13.3731 8.51253V0H0.91198ZM2.12699 1.21524H12.1576V7.9033L10.0295 10.0316H6.68657L4.8641 11.854V10.0316H2.12699V1.21524ZM5.47071 7.29611H6.68656V3.64856H5.47071V7.29611ZM8.81383 7.29611H10.0294V3.64856H8.81383V7.29611Z"
          fill="#5A3E85"
        />
      </g>
      <defs>
        <clipPath id="clip0_4072_478">
          <rect width="13.3731" height="14" fill="white" />
        </clipPath>
      </defs>
    </SVG>
  )
}

export default withIconStyles(IconTwitch)
