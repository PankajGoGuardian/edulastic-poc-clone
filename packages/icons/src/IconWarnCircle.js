import React from 'react'
import withIconStyles from './HOC/withIconStyles'
import SVG from './common/SVG'

const IconWarnCircle = (props) => (
  <SVG
    width="20"
    height="20"
    viewBox="0 0 20 20"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <circle cx="10" cy="10" r="10" fill="#EB9442" />
    <path
      d="M10.8438 11.6846H9.17578L8.82715 5.00586H11.1924L10.8438 11.6846ZM8.7998 14.0225C8.7998 13.6396 8.90234 13.3503 9.10742 13.1543C9.3125 12.9583 9.611 12.8604 10.0029 12.8604C10.3812 12.8604 10.6729 12.9606 10.8779 13.1611C11.0876 13.3617 11.1924 13.6488 11.1924 14.0225C11.1924 14.3825 11.0876 14.6673 10.8779 14.877C10.6683 15.082 10.3766 15.1846 10.0029 15.1846C9.62012 15.1846 9.32389 15.0843 9.11426 14.8838C8.90462 14.6787 8.7998 14.3916 8.7998 14.0225Z"
      fill="white"
    />
  </SVG>
)

export default withIconStyles(IconWarnCircle)
