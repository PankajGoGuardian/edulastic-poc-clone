/* eslint-disable react/prop-types */
import React from 'react'
import withIconStyles from './HOC/withIconStyles'
import SVG from './common/SVG'

const IconReferenceGuide = (props) => (
  <SVG
    data-cy="icon-reference-sheet"
    xmlns="http://www.w3.org/2000/svg"
    width="14.367"
    height="16.793"
    viewBox="0 0 14.367 16.793"
    {...props}
  >
    <path
      d="M10.92,16.543H.006a.25.25,0,0,1-.25-.25V2.189a.25.25,0,0,1-.005-.078.25.25,0,0,1,.1-.174h0l.012-.01L2.585-.2A.25.25,0,0,1,2.738-.25H13.867a.25.25,0,0,1,.25.25V14.353a.25.25,0,0,1-.25.25H11.783a.25.25,0,0,1-.25-.25v-.787a.25.25,0,0,1,.25-.25h.994V1.037H3.127l-1.081.843H10.92a.25.25,0,0,1,.25.25V16.292A.251.251,0,0,1,10.92,16.543Zm-10.664-.5H10.67V2.379H1.319a.25.25,0,0,1-.154-.447L2.888.59A.25.25,0,0,1,3.041.537h9.986a.25.25,0,0,1,.25.25v12.78a.25.25,0,0,1-.25.25h-.994V14.1h1.584V.25H2.824l-2.568,2ZM9.241,8.674H1.685a.25.25,0,0,1-.25-.25V3.7a.25.25,0,0,1,.25-.25H9.241a.25.25,0,0,1,.25.25V8.424A.25.25,0,0,1,9.241,8.674Zm-7.306-.5H8.991V3.953H1.935Z"
      transform="translate(0.25 0.25)"
    />
  </SVG>
)

export default withIconStyles(IconReferenceGuide)
