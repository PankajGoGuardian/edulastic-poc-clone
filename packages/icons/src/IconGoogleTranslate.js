/* eslint-disable react/prop-types */
import React from 'react'

import withIconStyles from './HOC/withIconStyles'
import SVG from './common/SVG'

const IconGoogleTranslate = (props) => (
  <SVG
    width="16"
    height="17"
    viewBox="0 0 16 17"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <path
      d="M13.334 4.00162H7.25398L6.66732 1.95605H2.66732C1.93398 1.95605 1.33398 2.56973 1.33398 3.31977V12.1839C1.33398 12.9339 1.93398 13.5476 2.66732 13.5476H7.33398L8.00065 15.5932H13.334C14.0673 15.5932 14.6673 14.9795 14.6673 14.2295V5.36534C14.6673 4.6153 14.0673 4.00162 13.334 4.00162ZM4.78065 10.5406C3.28065 10.5406 2.05398 9.29283 2.05398 7.75183C2.05398 6.21084 3.27398 4.96304 4.78065 4.96304C5.47398 4.96304 6.10732 5.21533 6.60732 5.69263L6.65398 5.73354L5.83398 6.53813L5.79398 6.50404C5.60065 6.31994 5.27398 6.10174 4.78065 6.10174C3.90732 6.10174 3.19398 6.84497 3.19398 7.75183C3.19398 8.6587 3.90732 9.40193 4.78065 9.40193C5.69398 9.40193 6.08732 8.80871 6.19398 8.40642H4.72065V7.34954H7.35398L7.36065 7.39727C7.38732 7.54046 7.39398 7.67001 7.39398 7.8132C7.39398 9.41557 6.32065 10.5406 4.78065 10.5406ZM8.80065 9.37465C9.02065 9.78377 9.29398 10.1792 9.59398 10.5338L9.23398 10.8952L8.80065 9.37465ZM9.31398 8.85644H8.65398L8.44732 8.14731H11.1073C11.1073 8.14731 10.8807 9.04054 10.0673 10.0156C9.72065 9.59285 9.47398 9.17692 9.31398 8.85644ZM14.0007 14.2295C14.0007 14.6045 13.7007 14.9113 13.334 14.9113H8.66732L10.0007 13.5476L9.46065 11.6589L10.074 11.0316L11.8607 12.8658L12.3473 12.368L10.5407 10.5406C11.1407 9.83832 11.6073 9.00645 11.8207 8.14731H12.6673V7.43818H10.2407V6.72905H9.54732V7.43818H8.24065L7.45398 4.68348H13.334C13.7007 4.68348 14.0007 4.99032 14.0007 5.36534V14.2295Z"
      fill="#777777"
    />
  </SVG>
)

export default withIconStyles(IconGoogleTranslate)
