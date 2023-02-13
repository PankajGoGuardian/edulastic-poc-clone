import React from 'react'
import withIconStyles from './HOC/withIconStyles'
import SVG from './common/SVG'

const IconBlackUpload = (props) => (
  <SVG
    xmlns="http://www.w3.org/2000/svg"
    width="9.882"
    height="12"
    viewBox="0 0 9.882 12"
    {...props}
  >
    <path
      id="Icon_material-file-upload"
      data-name="Icon material-file-upload"
      d="M10.324,13.676h4.235V9.441h2.824L12.441,4.5,7.5,9.441h2.824ZM7.5,15.088h9.882V16.5H7.5Z"
      transform="translate(-7.5 -4.5)"
    />
  </SVG>
)

export default withIconStyles(IconBlackUpload)
