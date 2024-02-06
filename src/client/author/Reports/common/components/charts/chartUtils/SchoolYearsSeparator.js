import React from 'react'

const SchoolYearsSeparator = ({
  pathX,
  y,
  moveVerticalLine = 25,
  moveClockInXDirection = 8,
  dividerColor = '#D8D9DC',
  data,
  payload,
}) => {
  let tickObj = data.find((d) => {
    return d.testId === payload.value
  })

  if (!tickObj) {
    const index = Math.max(payload.index, 0)
    tickObj = data[index]
  }

  if (!tickObj.showSchoolYearDivider) {
    return null
  }

  return (
    <>
      <path
        d={`M${pathX},${y - moveVerticalLine}v${-y}`}
        stroke={dividerColor}
        strokeDasharray="5,5"
      />
      <g transform={`translate(${pathX - moveClockInXDirection},${y})`}>
        <svg
          width="16"
          height="16"
          viewBox="0 0 16 16"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M7.99334 1.3335C4.31334 1.3335 1.33334 4.32016 1.33334 8.00016C1.33334 11.6802 4.31334 14.6668 7.99334 14.6668C11.68 14.6668 14.6667 11.6802 14.6667 8.00016C14.6667 4.32016 11.68 1.3335 7.99334 1.3335ZM8.00001 13.3335C5.05334 13.3335 2.66668 10.9468 2.66668 8.00016C2.66668 5.0535 5.05334 2.66683 8.00001 2.66683C10.9467 2.66683 13.3333 5.0535 13.3333 8.00016C13.3333 10.9468 10.9467 13.3335 8.00001 13.3335ZM8.33334 4.66683H7.33334V8.66683L10.8333 10.7668L11.3333 9.94683L8.33334 8.16683V4.66683Z"
            fill="#232323"
          />
        </svg>
      </g>

      <g transform={`translate(${pathX - 10},${y - 95})`}>
        <text textAnchor="end" fontSize="12">
          &rarr;
        </text>
      </g>
      <g transform={`translate(${pathX - 10},${y - 90})`}>
        <text textAnchor="end" fontSize="12" transform="rotate(-90, 0,0)">
          {tickObj.schoolYear}
        </text>
      </g>
    </>
  )
}

export default SchoolYearsSeparator
