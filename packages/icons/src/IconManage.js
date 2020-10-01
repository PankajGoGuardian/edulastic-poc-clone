/* eslint-disable react/prop-types */
import React from 'react'
import withIconStyles from './HOC/withIconStyles'
import SVG from './common/SVG'

const IconManage = (props) => (
  <SVG xmlns="http://www.w3.org/2000/svg" viewBox="0 0 22.08 22.099" {...props}>
    <g transform="translate(-6.5 -6.4)">
      <g transform="translate(6.5 6.4)">
        <path
          className="a"
          d="M7.28,11.977H8.518v9.06a.772.772,0,0,0,.78.78h2.855L8.632,27.3a.768.768,0,0,0,.228,1.066.815.815,0,0,0,.419.114.766.766,0,0,0,.647-.362L13.981,21.8h7.081l4.054,6.339a.791.791,0,0,0,.647.362.815.815,0,0,0,.419-.114.752.752,0,0,0,.228-1.066l-3.5-5.5h2.874a.772.772,0,0,0,.78-.78v-9.06H27.8a.772.772,0,0,0,.78-.78V7.18a.772.772,0,0,0-.78-.78H7.28a.772.772,0,0,0-.78.78V11.2a.772.772,0,0,0,.78.78ZM25,20.276H21.709a.792.792,0,0,0-.514,0H10.078v-8.3H25.021v8.3ZM8.023,7.961H27v2.455H8.042V7.961Z"
          transform="translate(-6.5 -6.4)"
        />
        <path
          className="a"
          d="M34,48.25a.8.8,0,0,0,.552-.228l1.237-1.237,2.551.666a.8.8,0,0,0,.8-.247l2.589-3.084a.784.784,0,0,0-1.2-1.009l-2.284,2.7-2.513-.647a.727.727,0,0,0-.742.209l-1.561,1.561a.781.781,0,0,0,0,1.1A.918.918,0,0,0,34,48.25Z"
          transform="translate(-28.118 -35.897)"
        />
      </g>
    </g>
  </SVG>
)

export default withIconStyles(IconManage)
