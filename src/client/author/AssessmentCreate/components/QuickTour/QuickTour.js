import { CustomModalStyled } from '@edulastic/common'
import React, { useState } from 'react'
import { Footer, FooterLink } from './styled'

const QuickTour = ({ title, quickTourLink }) => {
  const [isModelOpen, setIsModelOpen] = useState(false)
  return (
    <Footer>
      <FooterLink onClick={() => setIsModelOpen(true)}>
        WATCH QUICK TOUR
      </FooterLink>
      <CustomModalStyled
        visible={isModelOpen}
        onCancel={() => setIsModelOpen(false)}
        title={title}
        footer={null}
        destroyOnClose
        width="768px"
      >
        <iframe
          title={title}
          width="100%"
          height="400px"
          src={quickTourLink}
          allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
          frameBorder="0"
          allowFullScreen
          scrolling="no"
        />
      </CustomModalStyled>
    </Footer>
  )
}

export default QuickTour
