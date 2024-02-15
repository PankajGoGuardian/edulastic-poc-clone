/* eslint-disable react/prop-types */
import React from 'react'
import withIconStyles from './HOC/withIconStyles'
import SVG from './common/SVG'

const IconProfileCircle = (props) => {
  const { isBgDark } = props
  return (
    <SVG
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      {...props}
    >
      <circle cx="12" cy="12" r="12" fill={isBgDark ? 'white' : '#555555'} />
      <path
        d="M12.0003 7.93335C12.7737 7.93335 13.4003 8.56002 13.4003 9.33335C13.4003 10.1067 12.7737 10.7334 12.0003 10.7334C11.227 10.7334 10.6003 10.1067 10.6003 9.33335C10.6003 8.56002 11.227 7.93335 12.0003 7.93335ZM12.0003 13.9334C13.9803 13.9334 16.067 14.9067 16.067 15.3334V16.0667H7.93366V15.3334C7.93366 14.9067 10.0203 13.9334 12.0003 13.9334ZM12.0003 6.66669C10.527 6.66669 9.33366 7.86002 9.33366 9.33335C9.33366 10.8067 10.527 12 12.0003 12C13.4737 12 14.667 10.8067 14.667 9.33335C14.667 7.86002 13.4737 6.66669 12.0003 6.66669ZM12.0003 12.6667C10.2203 12.6667 6.66699 13.56 6.66699 15.3334V17.3334H17.3337V15.3334C17.3337 13.56 13.7803 12.6667 12.0003 12.6667Z"
        fill={isBgDark ? '#334050' : 'white'}
      />
    </SVG>
  )
}

export default withIconStyles(IconProfileCircle)
