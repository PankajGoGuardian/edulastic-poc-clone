import React from 'react'
import withIconStyles from './HOC/withIconStyles'
import SVG from './common/SVG'

const IconPassage = (props) => (
  <SVG
    xmlns="http://www.w3.org/2000/svg"
    width="15.96"
    height="19.338"
    viewBox="0 0 15.96 19.338"
    {...props}
  >
    <g transform="translate(0 0)">
      <path
        d="M13.82,0H5.7a2.143,2.143,0,0,0-2.14,2.14V2.4H2.14A2.143,2.143,0,0,0,0,4.543V17.2a2.143,2.143,0,0,0,2.14,2.14h8.124A2.143,2.143,0,0,0,12.4,17.2v-.263H13.82a2.143,2.143,0,0,0,2.14-2.14V2.14A2.143,2.143,0,0,0,13.82,0Zm-2.8,17.2a.761.761,0,0,1-.76.76H2.14a.761.761,0,0,1-.76-.76V4.543a.761.761,0,0,1,.76-.76h8.124a.76.76,0,0,1,.76.76V17.2Zm3.556-2.4a.761.761,0,0,1-.76.76H12.4V4.543a2.143,2.143,0,0,0-2.14-2.14H4.936V2.14a.761.761,0,0,1,.76-.76H13.82a.761.761,0,0,1,.76.76V14.795Z"
        transform="translate(15.96 19.338) rotate(180)"
        fill="#2f4151"
      />
      <g transform="translate(0 2.814)">
        <path
          d="M1.378,3.211H-4.331V1.8H1.378Z"
          transform="translate(11.302 7.457)"
          fill="#2f4151"
        />
        <path
          d="M1.378,3.211H-4.331V1.8H1.378Z"
          transform="translate(11.302 -1.111)"
          fill="#2f4151"
        />
        <circle
          cx="1.714"
          cy="1.714"
          r="1.714"
          transform="translate(8.111 3.963)"
          fill="#2f4151"
        />
      </g>
    </g>
  </SVG>
)

export default withIconStyles(IconPassage)
