import React from 'react'
import withIconStyles from './HOC/withIconStyles'
import SVG from './common/SVG'

const IconPDFFile = (props) => (
  <SVG xmlns="http://www.w3.org/2000/svg" viewBox="0 0 23.438 30" {...props}>
    <defs>
      <linearGradient
        id="a"
        x1="0.5"
        y1="-0.5"
        x2="0.5"
        y2="-0.46"
        gradientUnits="objectBoundingBox"
      >
        <stop offset="0" stopColor="#f3f7ff" />
        <stop offset="0.99" stopColor="#b5d1ff" />
      </linearGradient>
      <linearGradient
        id="b"
        x1="0.5"
        y1="-0.17"
        x2="0.5"
        y2="20.658"
        gradientUnits="objectBoundingBox"
      >
        <stop offset="0" stopColor="#ff5252" />
        <stop offset="1" stopColor="#d50000" />
      </linearGradient>
      <linearGradient id="c" y1="-0.085" y2="2.406" xlinkHref="#a" />
      <linearGradient id="d" y1="-2.145" y2="-0.366" xlinkHref="#a" />
      <linearGradient id="e" y1="-0.123" y2="2.825" xlinkHref="#b" />
      <linearGradient id="f" y1="-4.203" y2="3.531" xlinkHref="#b" />
    </defs>
    <g transform="translate(0)">
      <path
        d="M32.646,30H12.469A.469.469,0,0,1,12,29.531V.469A.469.469,0,0,1,12.469,0H27.8a.469.469,0,0,1,.332.137l4.851,4.846a.469.469,0,0,1,.137.331V29.531A.469.469,0,0,1,32.646,30Z"
        transform="translate(-9.678)"
        fill="url(#a)"
      />
      <path
        d="M7,32l1.857-.821,1.3,1.99H7Z"
        transform="translate(-7 -16.554)"
        fill="url(#b)"
      />
      <path
        d="M31.646,30H11.469A.469.469,0,0,1,11,29.531V.469A.469.469,0,0,1,11.469,0H26.99l5.126,5.121V29.531A.469.469,0,0,1,31.646,30Z"
        transform="translate(-9.143)"
        fill="url(#c)"
      />
      <path
        d="M45.076,0V4.608a.464.464,0,0,0,.464.464h4.608l-2.275-2.74Z"
        transform="translate(-27.175)"
        fill="url(#d)"
      />
      <path
        d="M25.12,42.973H7.822A.821.821,0,0,1,7,42.151V34.714H25.12a.822.822,0,0,1,.822.822v6.615a.822.822,0,0,1-.822.822Z"
        transform="translate(-7 -18.383)"
        fill="url(#e)"
      />
      <path
        d="M8.857,31.179H7.821a.821.821,0,1,0,0,1.641H8.857Z"
        transform="translate(-7 -16.556)"
        fill="url(#f)"
      />
      <g transform="translate(3.779 18.438)">
        <path
          d="M15,42.887V39.7a.4.4,0,0,1,.4-.4,13.057,13.057,0,0,1,1.847.06,1.122,1.122,0,0,1,.806,1.167,1.153,1.153,0,0,1-.89,1.2,8.473,8.473,0,0,1-1.231.057.13.13,0,0,0-.13.13v.972a.4.4,0,1,1-.805,0Zm.805-2.781v.873a.13.13,0,0,0,.13.13,3.531,3.531,0,0,0,.948-.063A.544.544,0,0,0,16.774,40a7.877,7.877,0,0,0-.839-.027.13.13,0,0,0-.129.13Z"
          transform="translate(-15 -39.285)"
          fill="#fff"
        />
        <path
          d="M23,39.7a.4.4,0,0,1,.4-.4,9.046,9.046,0,0,1,1.828.076,1.5,1.5,0,0,1,.983,1.014,2.949,2.949,0,0,1,.13.943,2.617,2.617,0,0,1-.123.849,1.454,1.454,0,0,1-.993,1.022,9.7,9.7,0,0,1-1.825.085.4.4,0,0,1-.4-.4Zm.805.4v2.383a.13.13,0,0,0,.13.13,5.07,5.07,0,0,0,.959-.038.689.689,0,0,0,.536-.551,2.6,2.6,0,0,0,.082-.73,2.383,2.383,0,0,0-.082-.71.773.773,0,0,0-.6-.574,6.677,6.677,0,0,0-.893-.038.13.13,0,0,0-.128.13Z"
          transform="translate(-19.285 -39.277)"
          fill="#fff"
        />
        <path
          d="M31.682,42.9V39.716a.4.4,0,0,1,.4-.4h1.993a.337.337,0,1,1,0,.675h-1.46a.13.13,0,0,0-.13.13V40.8a.13.13,0,0,0,.13.13h1.2a.337.337,0,1,1,0,.675h-1.2a.13.13,0,0,0-.13.13V42.9a.4.4,0,0,1-.808,0Z"
          transform="translate(-23.936 -39.296)"
          fill="#fff"
        />
      </g>
    </g>
  </SVG>
)

export default withIconStyles(IconPDFFile)
