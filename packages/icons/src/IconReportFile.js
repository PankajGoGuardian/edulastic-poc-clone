/* eslint-disable react/prop-types */
import React from 'react'
import withIconStyles from './HOC/withIconStyles'
import SVG from './common/SVG'

const IconReportFile = (props) => (
  <SVG xmlns="http://www.w3.org/2000/svg" viewBox="0 0 12 12" {...props}>
    <path
      d="M7.44667 1.33333L10.6667 4.55333V10.6667H1.33333V1.33333H7.44667ZM7.44667 0H1.33333C0.6 0 0 0.6 0 1.33333V10.6667C0 11.4 0.6 12 1.33333 12H10.6667C11.4 12 12 11.4 12 10.6667V4.55333C12 4.2 11.86 3.86 11.6067 3.61333L8.38667 0.393333C8.14 0.14 7.8 0 7.44667 0ZM2.66667 8H9.33333V9.33333H2.66667V8ZM2.66667 5.33333H9.33333V6.66667H2.66667V5.33333ZM2.66667 2.66667H7.33333V4H2.66667V2.66667Z"
      fill={props.color}
    />
  </SVG>
)

export default withIconStyles(IconReportFile)
