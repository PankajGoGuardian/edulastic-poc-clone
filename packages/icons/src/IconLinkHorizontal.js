/* eslint-disable react/prop-types */
import React from 'react'
import withIconStyles from './HOC/withIconStyles'
import SVG from './common/SVG'

const IconLinkHorizontal = (props) => (
  <SVG
    width="20"
    height="20"
    viewBox="0 0 20 20"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <g clipPath="url(#clip0_2184_92)">
      <path
        d="M3.14252 11.15C2.97752 11.3492 2.74002 11.4525 2.50002 11.4525C2.31335 11.4525 2.12502 11.39 1.97002 11.2617C0.718355 10.2284 0.000854706 8.70502 0.000854706 7.08252C2.1373e-05 4.09669 2.43002 1.66669 5.41669 1.66669H9.58336C12.57 1.66669 15 4.09669 15 7.08335C15 10.07 12.57 12.5 9.58336 12.5C9.12336 12.5 8.75002 12.1275 8.75002 11.6667C8.75002 11.2059 9.12336 10.8334 9.58336 10.8334C11.6509 10.8334 13.3334 9.15085 13.3334 7.08335C13.3334 5.01585 11.6509 3.33335 9.58336 3.33335H5.41669C3.34919 3.33335 1.66669 5.01585 1.66669 7.08335C1.66669 8.20669 2.16419 9.26085 3.03085 9.97669C3.38585 10.27 3.43585 10.795 3.14252 11.15ZM18.0309 8.73752C17.6759 8.44585 17.1509 8.49585 16.8575 8.85002C16.5642 9.20502 16.6142 9.73085 16.9692 10.0234C17.8359 10.7384 18.3334 11.7934 18.3334 12.9167C18.3334 14.9842 16.6509 16.6667 14.5834 16.6667H10.4167C8.34919 16.6667 6.66669 14.9842 6.66669 12.9167C6.66669 10.8492 8.34919 9.16669 10.4167 9.16669C10.8767 9.16669 11.25 8.79419 11.25 8.33335C11.25 7.87252 10.8767 7.50002 10.4167 7.50002C7.43002 7.50002 5.00002 9.93002 5.00002 12.9167C5.00002 15.9034 7.43002 18.3334 10.4167 18.3334H14.5834C17.57 18.3334 20 15.9034 20 12.9167C20 11.295 19.2825 9.77169 18.0309 8.73752Z"
        fill="#434B5D"
      />
    </g>
    <defs>
      <clipPath id="clip0_2184_92">
        <rect width="20" height="20" fill="white" />
      </clipPath>
    </defs>
  </SVG>
)

export default withIconStyles(IconLinkHorizontal)