import React from 'react'
import withIconStyles from './HOC/withIconStyles'
import SVG from './common/SVG'

const IconGoogleForm = (props) => {
  return (
    <SVG
      width="19"
      height="24"
      viewBox="0 0 19 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <g clipPath="url(#clip0_61_3670)">
        <path
          d="M11.4288 0H1.71456C0.79968 0 0 0.79968 0 1.71456V22.2864C0 23.2003 0.79968 24.001 1.71456 24.001H16.5715C17.4854 24.001 18.2861 23.2013 18.2861 22.2864V6.85728L14.2858 4.00032L11.4288 0Z"
          fill="#673AB7"
        />
        <path
          d="M6.85696 17.7138H13.7142V16.5714H6.85696V17.7138ZM6.85696 10.2854V11.4278H13.7142V10.2854H6.85696ZM5.82784 10.8575C5.82784 11.3145 5.48512 11.7714 4.91392 11.7714C4.34272 11.7714 4 11.4287 4 10.8575C4 10.2863 4.34272 9.9436 4.91392 9.9436C5.48512 9.9436 5.82784 10.3996 5.82784 10.8575ZM5.82784 14.0572C5.82784 14.5142 5.48512 14.9711 4.91392 14.9711C4.34272 14.9711 4 14.6284 4 14.0572C4 13.486 4.34272 13.1433 4.91392 13.1433C5.48512 13.1433 5.82784 13.6002 5.82784 14.0572ZM5.82784 17.1426C5.82784 17.5996 5.48512 18.0566 4.91392 18.0566C4.34272 18.0566 4 17.7138 4 17.1426C4 16.5714 4.34272 16.2287 4.91392 16.2287C5.48512 16.2287 5.82784 16.6857 5.82784 17.1426ZM6.85696 14.8569H13.7142V13.7135H6.85696V14.8569Z"
          fill="#F1F1F1"
        />
        <path
          d="M11.8857 6.40039L18.2861 12.6865V6.85735L11.8857 6.40039Z"
          fill="url(#paint0_linear_61_3670)"
        />
        <path
          d="M11.4287 0V5.14272C11.4287 6.05664 12.2284 6.85728 13.1433 6.85728H18.286L11.4287 0Z"
          fill="#B39DDB"
        />
        <path
          d="M1.71456 0C0.79968 0 0 0.79968 0 1.71456V1.8288C0 0.91392 0.79968 0.11424 1.71456 0.11424H11.4288V0H1.71456Z"
          fill="white"
          fillOpacity="0.2"
        />
        <path
          d="M16.5715 23.8857H1.71456C0.79968 23.8857 0 23.086 0 22.1711V22.2854C0 23.1993 0.79968 23.9999 1.71456 23.9999H16.5715C17.4854 23.9999 18.2861 23.2003 18.2861 22.2854V22.1711C18.2861 23.086 17.4854 23.8857 16.5715 23.8857Z"
          fill="#311B92"
          fillOpacity="0.2"
        />
        <path
          d="M13.1423 6.85738C12.2284 6.85738 11.4277 6.0577 11.4277 5.14282V5.25706C11.4277 6.17098 12.2274 6.97162 13.1423 6.97162H18.285V6.85738H13.1423Z"
          fill="#311B92"
          fillOpacity="0.1"
        />
        <path
          d="M11.4288 0H1.71456C0.79968 0 0 0.79968 0 1.71456V22.2864C0 23.2003 0.79968 24.001 1.71456 24.001H16.5715C17.4854 24.001 18.2861 23.2013 18.2861 22.2864V6.85728L11.4288 0Z"
          fill="url(#paint1_radial_61_3670)"
        />
      </g>
      <defs>
        <linearGradient
          id="paint0_linear_61_3670"
          x1="15.0855"
          y1="6.90068"
          x2="15.0855"
          y2="12.7105"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#311B92" stopOpacity="0.2" />
          <stop offset="1" stopColor="#311B92" stopOpacity="0.02" />
        </linearGradient>
        <radialGradient
          id="paint1_radial_61_3670"
          cx="0"
          cy="0"
          r="1"
          gradientUnits="userSpaceOnUse"
          gradientTransform="translate(0.578506 0.640515) scale(235.868 235.866)"
        >
          <stop stopColor="white" stopOpacity="0.1" />
          <stop offset="1" stopColor="white" stopOpacity="0" />
        </radialGradient>
        <clipPath id="clip0_61_3670">
          <rect width="18.2861" height="24" fill="white" />
        </clipPath>
      </defs>
    </SVG>
  )
}

export default withIconStyles(IconGoogleForm)
