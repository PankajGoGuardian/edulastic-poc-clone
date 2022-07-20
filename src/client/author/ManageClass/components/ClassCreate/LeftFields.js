import React, { useState, useEffect } from 'react'
import { Col } from 'antd'
import { StyledFlexContainer } from './styled'
import Uploader from './Uploader'
import { getThumbnail } from '../ClassSectionThumbnailsBySubjectGrade'

export default () => {
  const [thumbnail, setThumbnail] = useState('')
  useEffect(() => {
    const thumbNailImage = getThumbnail()
    setThumbnail(thumbNailImage)
  }, [])

  return (
    <StyledFlexContainer>
      <Col xs={24}>
        <Uploader url={thumbnail} setThumbnailUrl={setThumbnail} />
      </Col>
    </StyledFlexContainer>
  )
}
