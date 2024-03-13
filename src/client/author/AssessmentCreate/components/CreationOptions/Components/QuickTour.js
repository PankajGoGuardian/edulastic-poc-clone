import { CustomModalStyled } from '@edulastic/common'
import React, { useState } from 'react'

const QuickTour = ({ title, url, children }) => {
  const [isModelOpen, setIsModelOpen] = useState(false)

  const onVisibilityToggle = () => {
    setIsModelOpen(!isModelOpen)
  }

  return (
    <>
      <span onClick={onVisibilityToggle}>{children}</span>
      <CustomModalStyled
        visible={isModelOpen}
        onCancel={onVisibilityToggle}
        title={title}
        footer={null}
        destroyOnClose
        width="768px"
      >
        <iframe
          title={title}
          width="100%"
          height="400px"
          src={url}
          allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
          frameBorder="0"
          allowFullScreen
          scrolling="no"
        />
      </CustomModalStyled>
    </>
  )
}

export default QuickTour
