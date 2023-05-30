/* eslint-disable react/prop-types */
import React from 'react'
import withIconStyles from './HOC/withIconStyles'
import SVG from './common/SVG'

const IconGears = (props) => (
  <SVG
    width="16"
    height="16"
    viewBox="0 0 16 16"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <g clipPath="url(#clip0_1777_2027)">
      <path
        d="M15.1534 12.7L14.5 12.3333C14.6 12.0133 14.6734 11.68 14.6734 11.3333C14.6734 10.9867 14.6067 10.6467 14.5 10.3333L15.1534 9.96667C15.4734 9.78667 15.5867 9.38 15.4134 9.06C15.2334 8.74 14.8267 8.62 14.5067 8.8L13.8534 9.16667C13.38 8.62 12.74 8.22 12.0067 8.06667V7.33333C12.0067 6.96667 11.7067 6.66667 11.34 6.66667C10.9734 6.66667 10.6734 6.96667 10.6734 7.33333V8.06667C9.94003 8.21333 9.30003 8.62 8.8267 9.16667L8.17337 8.8C7.85337 8.62 7.4467 8.73333 7.2667 9.06C7.0867 9.38 7.20003 9.78667 7.5267 9.96667L8.18003 10.3333C8.08003 10.6533 8.0067 10.9867 8.0067 11.3333C8.0067 11.68 8.07337 12.02 8.18003 12.3333L7.5267 12.7C7.2067 12.88 7.09337 13.2867 7.2667 13.6067C7.3867 13.8267 7.61337 13.9467 7.8467 13.9467C7.96003 13.9467 8.0667 13.92 8.17337 13.86L8.8267 13.4933C9.30003 14.04 9.94003 14.44 10.6734 14.5933V15.3267C10.6734 15.6933 10.9734 15.9933 11.34 15.9933C11.7067 15.9933 12.0067 15.6933 12.0067 15.3267V14.5933C12.74 14.4467 13.38 14.04 13.8534 13.4933L14.5067 13.86C14.6067 13.92 14.72 13.9467 14.8334 13.9467C15.0667 13.9467 15.2934 13.8267 15.4134 13.6067C15.5934 13.2867 15.48 12.88 15.1534 12.7ZM11.3334 13.3333C10.2334 13.3333 9.33337 12.4333 9.33337 11.3333C9.33337 10.2333 10.2334 9.33333 11.3334 9.33333C12.4334 9.33333 13.3334 10.2333 13.3334 11.3333C13.3334 12.4333 12.4334 13.3333 11.3334 13.3333ZM7.18003 6.83333L7.83337 7.2C7.93337 7.26 8.0467 7.28667 8.16003 7.28667C8.39337 7.28667 8.62003 7.16667 8.74003 6.94667C8.92003 6.62667 8.8067 6.22 8.48003 6.04L7.8267 5.67333C7.9267 5.35333 8.00003 5.02 8.00003 4.67333C8.00003 4.32667 7.93337 3.98667 7.8267 3.67333L8.48003 3.30667C8.80003 3.12667 8.91337 2.72 8.74003 2.4C8.56003 2.08 8.15337 1.96 7.83337 2.14L7.18003 2.50667C6.7067 1.96 6.0667 1.56 5.33337 1.40667V0.666667C5.33337 0.3 5.03337 0 4.6667 0C4.30003 0 4.00003 0.3 4.00003 0.666667V1.4C3.2667 1.54667 2.6267 1.95333 2.15337 2.5L1.50003 2.13333C1.18003 1.95333 0.773367 2.06667 0.593367 2.39333C0.413367 2.71333 0.5267 3.12 0.853367 3.3L1.5067 3.66667C1.4067 3.98667 1.33337 4.32 1.33337 4.66667C1.33337 5.01333 1.40003 5.35333 1.5067 5.66667L0.853367 6.03333C0.533367 6.21333 0.420033 6.62 0.593367 6.94C0.713367 7.16 0.940033 7.28 1.17337 7.28C1.2867 7.28 1.39337 7.25333 1.50003 7.19333L2.15337 6.82667C2.6267 7.37333 3.2667 7.77333 4.00003 7.92667V8.66C4.00003 9.02667 4.30003 9.32667 4.6667 9.32667C5.03337 9.32667 5.33337 9.02667 5.33337 8.66V7.92667C6.0667 7.78 6.7067 7.37333 7.18003 6.82667V6.83333ZM4.6667 6.66667C3.5667 6.66667 2.6667 5.76667 2.6667 4.66667C2.6667 3.56667 3.5667 2.66667 4.6667 2.66667C5.7667 2.66667 6.6667 3.56667 6.6667 4.66667C6.6667 5.76667 5.7667 6.66667 4.6667 6.66667Z"
        fill="white"
      />
    </g>
    <defs>
      <clipPath id="clip0_1777_2027">
        <rect width="16" height="16" fill="white" />
      </clipPath>
    </defs>
  </SVG>
)

export default withIconStyles(IconGears)
