import React, { useState, useEffect } from 'react'
import { Col } from 'antd'
import { StyledFlexContainer } from './styled'
import { FieldLabel } from './components'
import Tags from './components/Tags'
import Uploader from './Uploader'
import { getThumbnail } from '../ClassSectionThumbnailsBySubjectGrade'

export default (props) => {
  useEffect(() => {
    const thumbNailImage = getThumbnail()
    setThumbnail(thumbNailImage)
  }, [])
  const [thumbnail, setThumbnail] = useState('')

  return (
    <StyledFlexContainer>
      <Col xs={24}>
        <FieldLabel
          label={`${props.type} Image`}
          {...props}
          fiedlName="thumbnail"
          initialValue={thumbnail}
        >
          <Uploader url={thumbnail} setThumbnailUrl={setThumbnail} />
        </FieldLabel>
      </Col>
      {props.type !== 'class' && (
        <Col xs={24}>
          <Tags {...props} />
        </Col>
      )}
    </StyledFlexContainer>
  )
}
