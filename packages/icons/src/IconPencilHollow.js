/* eslint-disable react/prop-types */
import React from 'react'
import withIconStyles from './HOC/withIconStyles'
import SVG from './common/SVG'

const IconPencilHollow = ({ title, ...props }) => (
  <SVG
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 19.403 19.437"
    {...props}
  >
    <path
      d="M19.4,3.034A3.038,3.038,0,0,0,14.214.89L1.983,13.17A3.64,3.64,0,0,0,1.1,14.594l-.011.035L0,19.436l4.82-1.079.036-.012a3.646,3.646,0,0,0,1.425-.879L18.514,5.184a3.019,3.019,0,0,0,.889-2.15ZM2.673,17.282l-.511-.511.369-1.623L4.3,16.918ZM17.44,4.112,5.564,16.036,3.413,13.884l8.135-8.168,1.239,1.239L13.86,5.882,12.619,4.641l1.154-1.159,1.243,1.243,1.073-1.073L14.844,2.407l.444-.446A1.521,1.521,0,1,1,17.44,4.112ZM7.982,17.9H19.4v1.517H6.469Zm0,0"
      transform="translate(0 0.001)"
    />
    <title>{title || ''}</title>
  </SVG>
)

export default withIconStyles(IconPencilHollow)
