/* eslint-disable react/prop-types */
import React from 'react'
import withIconStyles from './HOC/withIconStyles'
import SVG from './common/SVG'

const IconSelection = (props) => (
  <SVG
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 22.482 22.482"
    {...props}
  >
    <g transform="translate(0.25 0.25)">
      <path
        className="a"
        d="M21.438,4.472a.549.549,0,0,0,.544-.539V.544A.543.543,0,0,0,21.438,0H18.049a.542.542,0,0,0-.539.544v1.18H4.472V.544A.549.549,0,0,0,3.933,0H.544A.55.55,0,0,0,0,.544V3.933a.542.542,0,0,0,.544.539h1.18V17.511H.544A.549.549,0,0,0,0,18.049v3.389a.55.55,0,0,0,.544.544H3.933a.542.542,0,0,0,.539-.544v-1.18H17.511v1.18a.549.549,0,0,0,.539.544h3.389a.55.55,0,0,0,.544-.544V18.049a.542.542,0,0,0-.544-.539h-1.18V4.472ZM1.078,3.394V1.078H3.394V3.394ZM3.394,20.9H1.078V18.588H3.394Zm14.116-2.856v1.131H4.472V18.049a.54.54,0,0,0-.539-.539H2.8V4.472H3.933a.54.54,0,0,0,.539-.539V2.8H17.511V3.933a.54.54,0,0,0,.539.539h1.131V17.511H18.049A.54.54,0,0,0,17.511,18.049Zm3.394.539V20.9H18.588V18.588ZM18.588,3.394V1.078H20.9V3.394Z"
      />
    </g>
  </SVG>
)

export default withIconStyles(IconSelection)
