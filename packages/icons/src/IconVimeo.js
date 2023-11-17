import React from 'react'
import SVG from './common/SVG'
import withIconStyles from './HOC/withIconStyles'

const IconVimeo = () => {
  return (
    <SVG
      xmlns="http://www.w3.org/2000/svg"
      width="14"
      height="14"
      viewBox="0 0 14 14"
      fill="none"
    >
      <g clipPath="url(#clip0_4072_472)">
        <path
          d="M0 0V14H14V0H0ZM11.2286 6.26033C10.2789 8.28917 7.98642 11.0512 6.53742 11.0512C5.10942 11.0512 4.90292 8.00567 4.123 5.97858C3.73917 4.98167 3.49125 5.21033 2.772 5.71375L2.33333 5.14792C3.38217 4.22567 4.43275 3.15408 5.07792 3.09458C5.80417 3.02458 6.25158 3.521 6.419 4.58442C6.64008 5.98208 6.94867 8.15092 7.48767 8.15092C7.90767 8.15092 8.9425 6.43008 8.99558 5.81525C9.09008 4.91458 8.3335 4.88717 7.67667 5.16833C8.71558 1.764 13.0398 2.39108 11.2286 6.26033Z"
          fill="black"
        />
      </g>
      <defs>
        <clipPath id="clip0_4072_472">
          <rect width="14" height="14" fill="white" />
        </clipPath>
      </defs>
    </SVG>
  )
}

export default withIconStyles(IconVimeo)
