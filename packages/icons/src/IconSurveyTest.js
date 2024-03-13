import React from 'react'
import withIconStyles from './HOC/withIconStyles'
import SVG from './common/SVG'

const IconSurveyTest = (props) => (
  <SVG
    width="42"
    height="42"
    viewBox="0 0 42 42"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <circle opacity="0.15" cx="21" cy="21" r="21" fill="#EB9442" />
    <path
      opacity="0.6"
      fillRule="evenodd"
      clipRule="evenodd"
      d="M21 11.25C15.624 11.25 11.25 15.624 11.25 21C11.25 26.376 15.624 30.75 21 30.75C26.376 30.75 30.75 26.376 30.75 21C30.75 15.624 26.376 11.25 21 11.25Z"
      fill="url(#paint0_linear_61_2477)"
    />
    <path
      d="M21 27C23.7571 27 26 25.0498 26 22.6524V22H24.4994V22.6524C24.4994 24.3304 22.9298 25.6952 21 25.6952C19.0702 25.6952 17.5006 24.3304 17.5006 22.6524V22H16V22.6524C16 25.0498 18.2429 27 21 27Z"
      fill="white"
    />
    <circle cx="17" cy="18" r="1" fill="white" />
    <circle cx="25" cy="18" r="1" fill="white" />
    <defs>
      <linearGradient
        id="paint0_linear_61_2477"
        x1="20.7075"
        y1="11.25"
        x2="20.342"
        y2="30.7442"
        gradientUnits="userSpaceOnUse"
      >
        <stop stopColor="#E36C0D" />
        <stop offset="1" stopColor="#F5CB9A" />
      </linearGradient>
    </defs>
  </SVG>
)

export default withIconStyles(IconSurveyTest)
