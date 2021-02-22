/* eslint-disable react/prop-types */
import React from 'react'
import withIconStyles from './HOC/withIconStyles'
import SVG from './common/SVG'

const IconLanguage = (props) => (
  <SVG
    xmlns="http://www.w3.org/2000/svg"
    width="20.058"
    height="20.058"
    viewBox="0 0 31.132 32.55"
    {...props}
  >
    <g transform="translate(-11.135)">
      <g transform="translate(23.168)">
        <path
          d="M364.366,19.673V0h-8.595l-.637,10.751.637,10.276,2.708-1.354Z"
          transform="translate(-345.267)"
          fill="#2d2d2d"
        />
        <path
          d="M209.685,0a9.561,9.561,0,0,0-9.55,9.55V19.673h5.157V23.7l5.348-2.674V0Z"
          transform="translate(-200.135)"
          fill="#2d2d2d"
        />
        <g transform="translate(5.332 5.301)">
          <path
            d="M366.443,87.141v-1.91h-4.1V83.27h-.955l-.255,2.122.255,1.749h1.417a4.411,4.411,0,0,1-1.417,2.745l-.255,1.134.255,1.21a9.077,9.077,0,0,0,4.465,1.1v-1.91a7.585,7.585,0,0,1-2.793-.5,6.373,6.373,0,0,0,1.667-3.775h1.714Z"
            transform="translate(-356.218 -83.27)"
            fill="#f7f0eb"
          />
          <path
            d="M287.641,87.141h1.417V83.27H288.1v1.961h-4.1v1.91h1.714a6.373,6.373,0,0,0,1.667,3.775,7.585,7.585,0,0,1-2.793.5h-.708v1.91h.708a9.077,9.077,0,0,0,4.465-1.1V89.886A4.411,4.411,0,0,1,287.641,87.141Z"
            transform="translate(-283.885 -83.27)"
            fill="#fffbf5"
          />
        </g>
      </g>
      <g transform="translate(11.135 8.849)">
        <g transform="translate(0)">
          <path
            d="M137.726,139h-.955l-.637,11.428.637,9.6,5.348,2.674v-4.028h5.157V148.55A9.561,9.561,0,0,0,137.726,139Z"
            transform="translate(-128.176 -139)"
            fill="#12b0ff"
          />
          <path
            d="M11.135,139v19.673h5.886l2.708,1.354V139Z"
            transform="translate(-11.135 -139)"
            fill="#12b0ff"
          />
        </g>
        <g transform="translate(4.498 5.256)">
          <path
            d="M137.6,221.563h-.825l-.637,1.684.637,1.59.01-.026.8,2.126h-.812l-.637,1.006.637.9H138.3l.777,2.058,1.787-.674Z"
            transform="translate(-132.675 -221.563)"
            fill="#f7f0eb"
          />
          <path
            d="M85.089,226.949l.8-2.1v-3.273h-.8l-3.3,8.662,1.785.68.784-2.059h1.527v-1.91Z"
            transform="translate(-81.792 -221.575)"
            fill="#fffbf5"
          />
        </g>
      </g>
    </g>
  </SVG>
)

export default withIconStyles(IconLanguage)
