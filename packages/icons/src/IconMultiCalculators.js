/* eslint-disable react/prop-types */
import React from 'react'
import withIconStyles from './HOC/withIconStyles'
import SVG from './common/SVG'

const IconMultiCalculators = (props) => (
  <SVG
    data-cy="calculator"
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 19.501 19.493"
    {...props}
  >
    <g id="Group_6762" x transform="translate(-468 -124)">
      <path
        d="M9.368,16.625h.868V15.1h1.528v-.868H10.236V12.7H9.368v1.528H7.84V15.1H9.368Zm3.733-.608h3.49v-.851H13.1Zm0-1.858h3.49v-.868H13.1Zm.642-2.83L14.8,10.271l1.059,1.059.625-.625L15.427,9.646l1.059-1.059-.625-.625L14.8,9.021,13.743,7.962l-.625.625,1.059,1.059L13.118,10.7ZM8.1,10.08h3.4V9.212H8.1ZM7.042,18.5A1.068,1.068,0,0,1,6,17.458V7.042A1.068,1.068,0,0,1,7.042,6H17.458A1.068,1.068,0,0,1,18.5,7.042V17.458A1.068,1.068,0,0,1,17.458,18.5Zm0-1.042H17.458V7.042H7.042Zm0-10.417v0Z"
        transform="translate(464.5 120.5)"
        stroke="none"
      />
      <line
        id="Line_298"
        y2="10.5"
        transform="translate(468.5 124.5)"
        fill="none"
        strokeLinecap="round"
        strokeWidth="1"
      />
      <line
        id="Line_299"
        x2="10"
        transform="translate(468.5 124.5)"
        fill="none"
        strokeLinecap="round"
        strokeWidth="1"
      />
    </g>
  </SVG>
)

export default withIconStyles(IconMultiCalculators)
