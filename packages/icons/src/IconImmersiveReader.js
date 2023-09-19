import React from 'react'
import withIconStyles from './HOC/withIconStyles'
import SVG from './common/SVG'

const IconImmersiveReader = (props) => (
  <SVG
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 40 37"
    version="1.1"
    {...props}
  >
    <g fillRule="nonzero">
      <path d="M37.4,0.9 L37.4,9.6 L35.4,9.6 L35.4,2.9 L24.4,2.9 C22.9,3.3 20,4.5 20,6 L20,17.2 L18,17.2 L18,6 C18,5 15.6,3.6 13.8,2.9 L2,2.9 L2,29 L12.4,29 L12.4,31 L0,31 L0,0.9 L14.1,0.9 L14.3,1 C15,1.2 17.5,2.2 18.9,3.7 C20.5,1.9 23.5,1.1 23.9,1 L24.1,1 L37.4,1 L37.4,0.9 Z" />
      <path d="M27.4,37 L25.8,37 L18.4,29.4 L14,29.4 L14,21 L18.4,20.9 L26.1,13 L27.4,13 L27.4,37 Z M16,27.4 L19.2,27.4 L25.3,33.7 L25.3,16.6 L19.2,22.9 L15.9,22.9 L15.9,27.4 L16,27.4 Z" />
      <path d="M31.3,32.7 L29.6,31.7 C29.6,31.7 31.7,28.3 31.7,25.2 C31.7,21.9 29.6,18.5 29.6,18.4 L31.3,17.4 C31.4,17.6 33.7,21.3 33.7,25.2 C33.7,28.8 31.4,32.6 31.3,32.7 Z" />
      <path d="M36.4,36.2 L34.8,35 C34.8,35 38,30.8 38,25.2 C38,19.6 34.8,15.4 34.8,15.4 L36.4,14.2 C36.5,14.4 40,19 40,25.3 C40,31.5 36.5,36 36.4,36.2 Z" />
    </g>
  </SVG>
)

export default withIconStyles(IconImmersiveReader)
