import React from 'react'
import { connect } from 'react-redux'
import Col from "antd/es/Col";

const ColWithZoom = ({
  theme,
  children,
  layout = {},
  zoomLevel,
  ...restProps
}) => {
  let newProps = { ...restProps }

  if (zoomLevel !== 'xs' && layout[zoomLevel]) {
    newProps = {
      ...newProps,
      lg: layout[zoomLevel],
      md: layout[zoomLevel],
      xs: layout[zoomLevel],
      sm: layout[zoomLevel],
      xxl: layout[zoomLevel],
    }
  }

  return <Col {...newProps}>{children}</Col>
}

export default connect((state) => ({ zoomLevel: state.ui.zoomLevel }))(
  ColWithZoom
)
