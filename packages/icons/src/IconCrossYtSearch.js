import React from 'react'
import SVG from './common/SVG'
import withIconStyles from './HOC/withIconStyles'

const IconCrossYtSearch = () => {
  return (
    <SVG
      xmlns="http://www.w3.org/2000/svg"
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
    >
      <path
        d="M12.6668 4.27301L11.7268 3.33301L8.00016 7.05967L4.2735 3.33301L3.3335 4.27301L7.06016 7.99967L3.3335 11.7263L4.2735 12.6663L8.00016 8.93967L11.7268 12.6663L12.6668 11.7263L8.94016 7.99967L12.6668 4.27301Z"
        fill="#555555"
      />
    </SVG>
  )
}

export default withIconStyles(IconCrossYtSearch)