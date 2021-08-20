/* eslint-disable react/prop-types */
import React from 'react'
import withIconStyles from './HOC/withIconStyles'

const IconQRCode = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="682.667"
    height="682.667"
    version="1"
    viewBox="0 0 512 512"
    {...props}
  >
    <path
      d="M0 4320v-800h1600v1600H0v-800zm1280 0v-480H320v960h960v-480z"
      transform="matrix(.1 0 0 -.1 0 512)"
    ></path>
    <path
      d="M640 4320v-160h320v320H640v-160zM2560 4960v-160h640v320h-640v-160zM3520 4320v-800h1600v1600H3520v-800zm1280 0v-480h-960v960h960v-480z"
      transform="matrix(.1 0 0 -.1 0 512)"
    ></path>
    <path
      d="M4160 4320v-160h320v320h-320v-160zM1920 4480v-320h640v-320h320v320h320v320h-960v320h-320v-320zM1920 3680v-160h320v320h-320v-160zM2880 3360v-160h-960v-320h1280v640h-320v-160zM0 2560v-640h320v320h320v320H320v640H0v-640zM640 3040v-160h320v320H640v-160z"
      transform="matrix(.1 0 0 -.1 0 512)"
    ></path>
    <path
      d="M1280 2880v-320H960v-640h320v320h640v-320h640v320h-320v320h-640v640h-320v-320zM3840 3040v-160h-320v-320h1280v320h320v320h-640v-320h-320v320h-320v-160zM2880 2240v-320h320v640h-320v-320zM3520 2080v-160h320v-640h320v960h-640v-160zM4480 2080v-160h640v320h-640v-160zM0 800V0h1600v1600H0V800zm1280 0V320H320v960h960V800z"
      transform="matrix(.1 0 0 -.1 0 512)"
    ></path>
    <path
      d="M640 800V640h320v320H640V800zM1920 1440v-160h640V320h-640V0h960v320h640v320h-640v960h-960v-160z"
      transform="matrix(.1 0 0 -.1 0 512)"
    ></path>
    <path
      d="M3200 1280V960h320v640h-320v-320zM4800 1440v-160h320v320h-320v-160zM1920 800V640h320v320h-320V800zM3840 480V0h320v640h640v320h-960V480z"
      transform="matrix(.1 0 0 -.1 0 512)"
    ></path>
    <path
      d="M4480 160V0h640v320h-640V160z"
      transform="matrix(.1 0 0 -.1 0 512)"
    ></path>
  </svg>
)

export default withIconStyles(IconQRCode)
