/* eslint-disable react/prop-types */
import React from 'react'
import withIconStyles from './HOC/withIconStyles'
import SVG from './common/SVG'

const IconVideoAISuite = (props) => (
  <SVG
    width="47"
    height="47"
    viewBox="0 0 47 47"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <path
      d="M15.6666 33.2917H41.125V37.2084H15.6666V33.2917ZM25.4583 9.79175H31.3333V15.6667H25.4583V9.79175ZM35.25 9.79175H41.125V15.6667H35.25V9.79175ZM25.4583 21.5417H31.3333V27.4167H25.4583V21.5417ZM35.25 21.5417H41.125V27.4167H35.25V21.5417ZM15.6666 9.79175H21.5416V15.6667H15.6666V9.79175Z"
      fill="#B1BCC2"
    />
    <path
      d="M18.5753 23.6393L4.72787 37.4867L1.95837 34.7172L13.0364 23.6393L1.95837 12.5612L4.72787 9.79175L18.5753 23.6393Z"
      fill="#B1BCC2"
    />
  </SVG>
)

export default withIconStyles(IconVideoAISuite)
