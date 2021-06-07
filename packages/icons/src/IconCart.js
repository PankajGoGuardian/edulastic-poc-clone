/* eslint-disable react/prop-types */
import React from 'react'
import withIconStyles from './HOC/withIconStyles'
import SVG from './common/SVG'

const IconCart = (props) => (
  <SVG
    xmlns="http://www.w3.org/2000/svg"
    width="29.201"
    height="26.578"
    viewBox="0 0 29.201 26.578"
    {...props}
  >
    <g transform="translate(-10.201)">
      <g transform="translate(10.2 0)">
        <g transform="translate(0 0)">
          <path
            d="M133.3,382.711a3.356,3.356,0,1,0,3.356,3.356A3.36,3.36,0,0,0,133.3,382.711Zm0,4.7a1.342,1.342,0,1,1,1.342-1.342A1.344,1.344,0,0,1,133.3,387.409Z"
            transform="translate(-123.704 -362.844)"
            fill="#3f85e5"
          />
          <path
            d="M324.651,382.711a3.356,3.356,0,1,0,3.356,3.356A3.36,3.36,0,0,0,324.651,382.711Zm0,4.7a1.342,1.342,0,1,1,1.342-1.342A1.344,1.344,0,0,1,324.651,387.409Z"
            transform="translate(-300.279 -362.844)"
            fill="#3f85e5"
          />
          <path
            d="M25.844,18.354H8.121a1,1,0,0,1-.984-.8L4.18,2.609.826,2a1.026,1.026,0,0,1-.654-.434A.987.987,0,0,1,.02.824,1,1,0,0,1,1.006,0a1.065,1.065,0,0,1,.184.018l4.023.74a.985.985,0,0,1,.8.791l.643,3.213-.025.084L7.34,8.225l1.609,8.121h16.1L26.93,8.188h-.012l.525-2.016H28.2a1.008,1.008,0,0,1,.791.387.982.982,0,0,1,.188.848L26.83,17.574A1.015,1.015,0,0,1,25.844,18.354Z"
            fill="#3f85e5"
          />
        </g>
      </g>
    </g>
  </SVG>
)

export default withIconStyles(IconCart)
