import React from 'react'
import withIconStyles from './HOC/withIconStyles'
import SVG from './common/SVG'

const IconStudent = (props) => (
  <SVG
    xmlns="http://www.w3.org/2000/svg"
    xmlnsXlink="http://www.w3.org/1999/xlink"
    width="60"
    height="46"
    viewBox="0 0 60 46"
    {...props}
  >
    <defs>
      <linearGradient
        id="linear-gradient"
        x1="1.347"
        y1="1.318"
        x2="-0.375"
        y2="-0.57"
        gradientUnits="objectBoundingBox"
      >
        <stop offset="0" stopColor="#1ab395" />
        <stop offset="1" stopColor="#a1d3c9" />
      </linearGradient>
      <filter
        id="Ellipse_414"
        x="0"
        y="0"
        width="60"
        height="60"
        filterUnits="userSpaceOnUse"
      >
        <feOffset dy="8" input="SourceAlpha" />
        <feGaussianBlur stdDeviation="5" result="blur" />
        <feFlood floodOpacity="0.078" />
        <feComposite operator="in" in2="blur" />
        <feComposite in="SourceGraphic" />
      </filter>
    </defs>
    <g
      id="Group_10571"
      data-name="Group 10571"
      transform="translate(-106.201 -216.875)"
    >
      <g filter="#Ellipse_414" transform="matrix(1, 0, 0, 1, 106.2, 216.88)">
        <circle
          id="Ellipse_414-2"
          data-name="Ellipse 414"
          fill="url(#linear-gradient)"
          cx="15"
          cy="15"
          r="15"
          transform="translate(15 7)"
        />
      </g>
      <path
        id="Icon_awesome-user-graduate"
        data-name="Icon awesome-user-graduate"
        fill="#fff"
        d="M7.836,7.864,5.5,10.2l-2.34-2.34A3.29,3.29,0,0,0,0,11.147v.236A1.178,1.178,0,0,0,1.178,12.56H9.813a1.178,1.178,0,0,0,1.178-1.178v-.236A3.29,3.29,0,0,0,7.836,7.864ZM.334,1.957l.157.037V3.426a.567.567,0,0,0-.022.981L.086,5.936c-.042.169.052.343.186.343H1.3c.135,0,.228-.174.186-.343L1.1,4.407a.567.567,0,0,0-.022-.981V2.136l1.619.39a3.134,3.134,0,1,0,5.937,1.4,3.084,3.084,0,0,0-.343-1.4l2.362-.569a.39.39,0,0,0,0-.773L5.984.055a2.107,2.107,0,0,0-.974,0L.334,1.181a.392.392,0,0,0,0,.775Z"
        transform="translate(130.489 232.624)"
      />
    </g>
  </SVG>
)

export default withIconStyles(IconStudent)
