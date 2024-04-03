/* eslint-disable react/prop-types */
import React from 'react'
import { white } from '@edulastic/colors'
import withIconStyles from './HOC/withIconStyles'
import SVG from './common/SVG'

const IconClosedCaption = (props) => (
  <SVG viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg" {...props}>
    <path
      fill={props?.color || white}
      d="M15.8333 3.33301H4.16667C3.24167 3.33301 2.5 4.08301 2.5 4.99967V14.9997C2.5 15.9163 3.24167 16.6663 4.16667 16.6663H15.8333C16.75 16.6663 17.5 15.9163 17.5 14.9997V4.99967C17.5 4.08301 16.75 3.33301 15.8333 3.33301ZM15.8333 14.9997H4.16667V4.99967H15.8333V14.9997ZM5.83333 12.4997H8.33333C8.79167 12.4997 9.16667 12.1247 9.16667 11.6663V10.833H7.91667V11.2497H6.25V8.74967H7.91667V9.16634H9.16667V8.33301C9.16667 7.87467 8.79167 7.49967 8.33333 7.49967H5.83333C5.375 7.49967 5 7.87467 5 8.33301V11.6663C5 12.1247 5.375 12.4997 5.83333 12.4997ZM11.6667 12.4997H14.1667C14.625 12.4997 15 12.1247 15 11.6663V10.833H13.75V11.2497H12.0833V8.74967H13.75V9.16634H15V8.33301C15 7.87467 14.625 7.49967 14.1667 7.49967H11.6667C11.2083 7.49967 10.8333 7.87467 10.8333 8.33301V11.6663C10.8333 12.1247 11.2083 12.4997 11.6667 12.4997Z"
    />
  </SVG>
)

export default withIconStyles(IconClosedCaption)
