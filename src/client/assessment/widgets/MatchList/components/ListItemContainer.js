import React, { useRef, useEffect, useState } from 'react'
import Popover from "antd/es/popover";
import { measureText } from '@edulastic/common'
import PropTypes from 'prop-types'
import { ListItem } from '../styled/ListItem'
import { StyledMathFormulaDisplay } from '../styled/StyledMathFormulaDisplay'

const ListItemContainer = ({ label, smallSize, stemColStyle }) => {
  const container = useRef(null)

  const [currentWidth, setCurrentWidth] = useState(0)

  useEffect(() => {
    setCurrentWidth(container?.current?.clientWidth || 0)
  }, [])

  const { width: contentWidth } = measureText(label)

  const widthOverFlow = currentWidth < contentWidth

  const getContent = (isPopover = false) => {
    const overrideStyle = isPopover
      ? { ...stemColStyle, width: 'auto' }
      : { ...stemColStyle }
    return (
      <ListItem smallSize={smallSize} style={overrideStyle} ref={container}>
        <StyledMathFormulaDisplay dangerouslySetInnerHTML={{ __html: label }} />
      </ListItem>
    )
  }

  const content = getContent(false)
  const popOverContent = getContent(true)

  return widthOverFlow ? (
    <Popover
      content={popOverContent}
      getPopupContainer={(triggerNode) => triggerNode.parentNode}
    >
      {content}
    </Popover>
  ) : (
    content
  )
}

export default ListItemContainer

ListItemContainer.propTypes = {
  label: PropTypes.string,
  smallSize: PropTypes.bool.isRequired,
  stemColStyle: PropTypes.object.isRequired,
}

ListItemContainer.defaultProps = {
  label: '',
}
