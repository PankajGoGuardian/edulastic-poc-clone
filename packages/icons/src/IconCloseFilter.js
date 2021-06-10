import React from 'react'
import withIconStyles from './HOC/withIconStyles'
import SVG from './common/SVG'

const IconCloseFilter = (props) => (
  <SVG
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 15.152 15.152"
    {...props}
  >
    <path
      d="M12.127,8.242,7.576,12.793,3.025,8.242,3.862,7.4l3.122,3.122V0H8.168V10.527L11.29,7.4Zm3.025,5.726H0v1.184H15.152Zm0,0"
      transform="translate(15.152) rotate(90)"
    />
  </SVG>
)

export default withIconStyles(IconCloseFilter)
