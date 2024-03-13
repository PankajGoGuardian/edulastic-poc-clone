import React from 'react'
import withIconStyles from './HOC/withIconStyles'
import SVG from './common/SVG'

const IconGoogleFormTest = (props) => (
  <SVG
    width="42"
    height="42"
    viewBox="0 0 42 42"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <circle cx="21" cy="21" r="21" fill="#D7C1FF" fillOpacity="0.4" />
    <g clipPath="url(#clip0_61_2411)">
      <path
        d="M23.524 11H15.4288C14.6664 11 14 11.6664 14 12.4288V29.572C14 30.3336 14.6664 31.0008 15.4288 31.0008H27.8096C28.5712 31.0008 29.2384 30.3344 29.2384 29.572V16.7144L25.9048 14.3336L23.524 11Z"
        fill="#673AB7"
      />
      <path
        d="M19.7143 25.7616H25.4287V24.8096H19.7143V25.7616ZM19.7143 19.5712V20.5232H25.4287V19.5712H19.7143ZM18.8567 20.048C18.8567 20.4288 18.5711 20.8096 18.0951 20.8096C17.6191 20.8096 17.3335 20.524 17.3335 20.048C17.3335 19.572 17.6191 19.2864 18.0951 19.2864C18.5711 19.2864 18.8567 19.6664 18.8567 20.048ZM18.8567 22.7144C18.8567 23.0952 18.5711 23.476 18.0951 23.476C17.6191 23.476 17.3335 23.1904 17.3335 22.7144C17.3335 22.2384 17.6191 21.9528 18.0951 21.9528C18.5711 21.9528 18.8567 22.3336 18.8567 22.7144ZM18.8567 25.2856C18.8567 25.6664 18.5711 26.0472 18.0951 26.0472C17.6191 26.0472 17.3335 25.7616 17.3335 25.2856C17.3335 24.8096 17.6191 24.524 18.0951 24.524C18.5711 24.524 18.8567 24.9048 18.8567 25.2856ZM19.7143 23.3808H25.4287V22.428H19.7143V23.3808Z"
        fill="#F1F1F1"
      />
      <path
        d="M23.9048 16.3336L29.2384 21.572V16.7144L23.9048 16.3336Z"
        fill="url(#paint0_linear_61_2411)"
      />
      <path
        d="M23.5239 11V15.2856C23.5239 16.0472 24.1903 16.7144 24.9527 16.7144H29.2383L23.5239 11Z"
        fill="#B39DDB"
      />
      <path
        d="M15.4288 11C14.6664 11 14 11.6664 14 12.4288V12.524C14 11.7616 14.6664 11.0952 15.4288 11.0952H23.524V11H15.4288Z"
        fill="white"
        fillOpacity="0.2"
      />
      <path
        d="M27.8096 30.9048H15.4288C14.6664 30.9048 14 30.2384 14 29.476V29.5712C14 30.3328 14.6664 31 15.4288 31H27.8096C28.5712 31 29.2384 30.3336 29.2384 29.5712V29.476C29.2384 30.2384 28.5712 30.9048 27.8096 30.9048Z"
        fill="#311B92"
        fillOpacity="0.2"
      />
      <path
        d="M24.9522 16.7144C24.1906 16.7144 23.5234 16.048 23.5234 15.2856V15.3808C23.5234 16.1424 24.1898 16.8096 24.9522 16.8096H29.2378V16.7144H24.9522Z"
        fill="#311B92"
        fillOpacity="0.1"
      />
      <path
        d="M23.524 11H15.4288C14.6664 11 14 11.6664 14 12.4288V29.572C14 30.3336 14.6664 31.0008 15.4288 31.0008H27.8096C28.5712 31.0008 29.2384 30.3344 29.2384 29.572V16.7144L23.524 11Z"
        fill="url(#paint1_radial_61_2411)"
      />
    </g>
    <defs>
      <linearGradient
        id="paint0_linear_61_2411"
        x1="26.5712"
        y1="16.7505"
        x2="26.5712"
        y2="21.5921"
        gradientUnits="userSpaceOnUse"
      >
        <stop stopColor="#311B92" stopOpacity="0.2" />
        <stop offset="1" stopColor="#311B92" stopOpacity="0.02" />
      </linearGradient>
      <radialGradient
        id="paint1_radial_61_2411"
        cx="0"
        cy="0"
        r="1"
        gradientUnits="userSpaceOnUse"
        gradientTransform="translate(14.4821 11.5338) scale(196.557 196.555)"
      >
        <stop stopColor="white" stopOpacity="0.1" />
        <stop offset="1" stopColor="white" stopOpacity="0" />
      </radialGradient>
      <clipPath id="clip0_61_2411">
        <rect
          width="15.2384"
          height="20"
          fill="white"
          transform="translate(14 11)"
        />
      </clipPath>
    </defs>
  </SVG>
)

export default withIconStyles(IconGoogleFormTest)
