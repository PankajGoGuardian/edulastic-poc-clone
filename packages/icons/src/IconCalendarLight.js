/* eslint-disable react/prop-types */
import React from 'react'
import withIconStyles from './HOC/withIconStyles'
import SVG from './common/SVG'

const IconCalendarLight = (props) => (
  <SVG
    width="16"
    height="16"
    viewBox="0 0 16 16"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <path
      d="M13.3333 1.99984H12.6666V0.666504H11.3333V1.99984H4.66665V0.666504H3.33331V1.99984H2.66665C1.93331 1.99984 1.33331 2.59984 1.33331 3.33317V13.9998C1.33331 14.7332 1.93331 15.3332 2.66665 15.3332H13.3333C14.0666 15.3332 14.6666 14.7332 14.6666 13.9998V3.33317C14.6666 2.59984 14.0666 1.99984 13.3333 1.99984ZM13.3333 13.9998H2.66665V6.6665H13.3333V13.9998ZM13.3333 5.33317H2.66665V3.33317H13.3333V5.33317Z"
      fill="#555555"
    />
  </SVG>
)

export default withIconStyles(IconCalendarLight)
