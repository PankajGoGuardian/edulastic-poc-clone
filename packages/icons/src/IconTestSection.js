/* eslint-disable react/prop-types */
import React from 'react'
import withIconStyles from './HOC/withIconStyles'
import SVG from './common/SVG'

const IconTestSection = (props) => (
  <SVG
    width="12"
    height="12"
    viewBox="0 0 12 12"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <path d="M10.6667 0H1.33333C0.6 0 0 0.6 0 1.33333V10.6667C0 11.4 0.6 12 1.33333 12H10.6667C11.4 12 12 11.4 12 10.6667V1.33333C12 0.6 11.4 0 10.6667 0ZM10.6667 1.33333V3.33333H1.33333V1.33333H10.6667ZM10.6667 4.66667V7.33333H1.33333V4.66667H10.6667ZM1.33333 10.6667V8.66667H10.6667V10.6667H1.33333Z" />
  </SVG>
)

export default withIconStyles(IconTestSection)
