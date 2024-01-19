/* eslint-disable react/prop-types */
import React from 'react'
import withIconStyles from './HOC/withIconStyles'
import SVG from './common/SVG'

const IconComment = (props) => (
  <SVG
    width="20"
    height="20"
    viewBox="0 0 20 20"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <path
      d="M16.6666 14.3087L15.6916 13.3337H3.33329V3.33366H16.6666V14.3087ZM16.6666 1.66699H3.33329C2.41663 1.66699 1.66663 2.41699 1.66663 3.33366V13.3337C1.66663 14.2503 2.41663 15.0003 3.33329 15.0003H15L18.3333 18.3337V3.33366C18.3333 2.41699 17.5833 1.66699 16.6666 1.66699Z"
      fill="#777777"
    />
  </SVG>
)

export default withIconStyles(IconComment)
