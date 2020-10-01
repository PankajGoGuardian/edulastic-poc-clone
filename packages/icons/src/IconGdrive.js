/* eslint-disable react/prop-types */
import React from 'react'
import withIconStyles from './HOC/withIconStyles'
import SVG from './common/SVG'

const IconGdrive = (props) => (
  <SVG xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" {...props}>
    <path d="m11.109 9.788-3.886-6.628v-.001l-7.223 12.708 3.778 6.633z" />
    <path d="m8.222 1.5 7.669 13.261h7.556l-7.669-13.261z" />
    <path d="m9.445 15.867-3.778 6.633h14.555l3.778-6.633z" />
  </SVG>
)

export default withIconStyles(IconGdrive)
