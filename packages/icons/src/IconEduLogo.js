import React from 'react'
import withIconStyles from './HOC/withIconStyles'
import SVG from './common/SVG'

const IconEduLogo = (props) => (
  <SVG
    width="50px"
    height="50px"
    viewBox="0 0 50 50"
    version="1.1"
    aria-label="Edulastic Logo"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <g
      id="Brandind-guides"
      stroke="none"
      strokeWidth="1"
      fill="none"
      fillRule="evenodd"
    >
      <g
        id="Edulastic-brand-guide-p1"
        transform="translate(-218.000000, -412.000000)"
      >
        <g id="Group-5" transform="translate(200.000000, 402.000000)">
          <g id="Group-9">
            <g
              id="Edulastic_logo_round"
              transform="translate(18.000000, 10.000000)"
            >
              <g id="round-logo">
                <circle
                  id="Oval-Copy-6"
                  fill={props.circleFill ? props.circleFill : '#00A37C'}
                  cx="25"
                  cy="25"
                  r="25"
                />
                <g
                  id="Group-12"
                  transform="translate(14.000000, 10.000000)"
                  fill="#FFFFFF"
                >
                  <polygon
                    id="Shape"
                    points="6.00922131 5.06369427 6.00922131 11.6878981 15.5455943 11.6878981 15.5455943 16.7834395 6.00922131 16.7834395 6.00922131 24.9044586 15.9375 24.9044586 15.9375 30 0 30 0 0 15.9375 0 15.9375 5.0955414 6.00922131 5.0955414"
                  />
                  <path
                    d="M24.609375,14.0625 C24.609375,15.5126953 23.4814453,16.640625 22.03125,16.640625 C20.5810547,16.640625 19.453125,15.5126953 19.453125,14.0625 C19.453125,12.6767578 20.5810547,11.484375 22.03125,11.484375 C23.4814453,11.484375 24.609375,12.6767578 24.609375,14.0625 Z"
                    id="Shape"
                    fillRule="nonzero"
                  />
                </g>
              </g>
            </g>
          </g>
        </g>
      </g>
    </g>
  </SVG>
)

export default withIconStyles(IconEduLogo)
