import React from 'react'
import withIconStyles from './HOC/withIconStyles'
import SVG from './common/SVG'

const IconInfo = ({ fill, ...restProps }) => (
  <SVG
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 10.359 10.358"
    {...restProps}
  >
    <g transform="translate(0 0.001)">
      <path
        d="M5.179,0a5.179,5.179,0,1,0,5.179,5.179A5.179,5.179,0,0,0,5.179,0ZM6.257,8.027q-.4.158-.638.24a1.683,1.683,0,0,1-.553.083,1.1,1.1,0,0,1-.753-.236.763.763,0,0,1-.268-.6,2.177,2.177,0,0,1,.02-.289c.014-.1.035-.209.064-.333l.334-1.179c.029-.113.055-.221.075-.321a1.421,1.421,0,0,0,.03-.278A.427.427,0,0,0,4.475,4.8a.528.528,0,0,0-.356-.088.936.936,0,0,0-.265.039c-.09.028-.168.053-.232.077l.088-.363q.328-.134.627-.228a1.852,1.852,0,0,1,.566-.1,1.082,1.082,0,0,1,.742.232.772.772,0,0,1,.26.6q0,.077-.018.271A1.81,1.81,0,0,1,5.82,5.6L5.488,6.78c-.027.094-.051.2-.073.323a1.706,1.706,0,0,0-.032.274.394.394,0,0,0,.1.319.587.587,0,0,0,.363.085,1.052,1.052,0,0,0,.274-.043,1.56,1.56,0,0,0,.222-.075ZM6.2,3.257a.792.792,0,0,1-.559.216.8.8,0,0,1-.561-.216.689.689,0,0,1-.234-.523.7.7,0,0,1,.234-.524.8.8,0,0,1,.561-.218A.786.786,0,0,1,6.2,2.21a.706.706,0,0,1,0,1.047Z"
        fill={fill || '#abafc0'}
      />
    </g>
  </SVG>
)

export default withIconStyles(IconInfo)
