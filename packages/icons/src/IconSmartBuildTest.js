import React from 'react'
import withIconStyles from './HOC/withIconStyles'
import SVG from './common/SVG'

const IconSmartBuildTest = (props) => (
  <SVG
    width="42"
    height="42"
    viewBox="0 0 42 42"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <circle cx="21" cy="21" r="21" fill="#006CFF" fillOpacity="0.15" />
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M22.2901 10.681V15.341H26.7601L22.2901 10.681ZM22.9971 24.052H16.0531V22.552H22.9971V24.052ZM20.9351 20.269H16.0521V18.769H20.9351V20.269ZM11.8301 9.25H22.7801L28.1701 14.87V23.0024C28.1136 23.0008 28.0569 23 28 23C24.77 23 22.1362 25.5522 22.0051 28.75H11.8301V9.25Z"
      fill="#006CFF"
    />
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M32.1659 28.7847C30.2285 28.2853 28.7145 26.7714 28.2151 24.834L28 24L27.7849 24.834C27.2855 26.7714 25.7715 28.2853 23.8341 28.7847L23 28.9998L23.8341 29.2153C25.7715 29.7147 27.2855 31.2286 27.7849 33.1655L28 34L28.2151 33.1655C28.7145 31.2286 30.2285 29.7147 32.1659 29.2153L33 28.9998L32.1659 28.7847Z"
      fill="url(#paint0_linear_61_2379)"
    />
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M30.9999 27.1102C30.9999 26.5938 31.566 25.9997 32.1104 25.9997C31.5865 25.9997 30.9999 25.3994 30.9999 24.8898C30.9999 25.3994 30.4187 25.9997 29.8899 25.9997C30.3987 25.9997 30.9999 26.5907 30.9999 27.1102Z"
      fill="url(#paint1_linear_61_2379)"
    />
    <defs>
      <linearGradient
        id="paint0_linear_61_2379"
        x1="28"
        y1="24"
        x2="28"
        y2="34"
        gradientUnits="userSpaceOnUse"
      >
        <stop stopColor="#006CFF" />
        <stop offset="1" stopColor="#006CFF" stopOpacity="0.4" />
      </linearGradient>
      <linearGradient
        id="paint1_linear_61_2379"
        x1="28"
        y1="24"
        x2="28"
        y2="34"
        gradientUnits="userSpaceOnUse"
      >
        <stop stopColor="#006CFF" />
        <stop offset="1" stopColor="#006CFF" stopOpacity="0.4" />
      </linearGradient>
    </defs>
  </SVG>
)

export default withIconStyles(IconSmartBuildTest)
