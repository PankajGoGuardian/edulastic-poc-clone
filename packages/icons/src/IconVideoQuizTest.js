import React from 'react'
import withIconStyles from './HOC/withIconStyles'
import SVG from './common/SVG'

const IconVideoQuizTest = (props) => (
  <SVG
    width="42"
    height="42"
    viewBox="0 0 42 42"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <circle cx="21" cy="21" r="21" fill="#FF0000" fillOpacity="0.12" />
    <path
      d="M32.3863 15.5367C32.1198 14.5373 31.3203 13.8044 30.3875 13.5379C28.5886 13.0049 21.393 13.0049 21.393 13.0049C21.393 13.0049 14.2641 13.0049 12.5318 13.4713C11.5324 13.7378 10.7995 14.4707 10.533 15.47C10 17.2689 10 21 10 21C10 21 10 24.731 10.4664 26.4633C10.7329 27.4627 11.5324 28.1956 12.4652 28.4621C14.2641 28.9951 21.393 28.9951 21.393 28.9951C21.393 28.9951 28.522 28.9951 30.3209 28.5287C31.3203 28.2622 32.0531 27.4627 32.3196 26.5299C32.786 24.731 32.786 21.0666 32.786 21.0666C32.786 21.0666 32.8526 17.2689 32.3863 15.5367Z"
      fill="#FF0000"
    />
    <path
      d="M19.1279 24.3979L25.0576 21L19.1279 17.6021V24.3979Z"
      fill="white"
    />
  </SVG>
)

export default withIconStyles(IconVideoQuizTest)
