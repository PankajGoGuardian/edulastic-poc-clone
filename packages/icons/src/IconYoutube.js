import React from 'react'
import SVG from './common/SVG'
import withIconStyles from './HOC/withIconStyles'

const IconYoutube = () => {
  return (
    <SVG
      xmlns="http://www.w3.org/2000/svg"
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill="none"
    >
      <g clipPath="url(#clip0_4072_468)">
        <path
          d="M15.8463 2.92383H4.15374C1.85969 2.92383 0 4.78352 0 7.07757V12.9226C0 15.2166 1.85969 17.0763 4.15374 17.0763H15.8463C18.1403 17.0763 20 15.2166 20 12.9226V7.07757C20 4.78352 18.1403 2.92383 15.8463 2.92383ZM13.0371 10.2845L7.56814 12.8928C7.42241 12.9623 7.25408 12.8561 7.25408 12.6947V7.31488C7.25408 7.15115 7.42684 7.04503 7.57287 7.11905L13.0418 9.89045C13.2044 9.97284 13.2016 10.206 13.0371 10.2845Z"
          fill="#F61C0D"
        />
      </g>
      <defs>
        <clipPath id="clip0_4072_468">
          <rect width="20" height="20" fill="white" />
        </clipPath>
      </defs>
    </SVG>
  )
}

export default withIconStyles(IconYoutube)
