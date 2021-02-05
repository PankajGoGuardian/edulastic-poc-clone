import React from 'react'
import { FlexContainer } from '@edulastic/common'
import PerfectScrollbar from 'react-perfect-scrollbar'
import styled from 'styled-components'

const StyleImage = styled.img`
  max-height: 600px;
`
const FlexItem = styled.div`
  padding: 10px;
`

const StudentWork = ({ imageAttachments }) => {
  return (
    <PerfectScrollbar>
      <FlexContainer
        alignItems="flex-end"
        flexDirection="row"
        flexWrap="no-wrap"
        justifyContent="space-between"
      >
        {imageAttachments && imageAttachments.length > 0 && (
          <>
            {imageAttachments.map((imageFile) => (
              <FlexItem>
                <StyleImage src={imageFile.source} alt={imageFile.name} />
              </FlexItem>
            ))}
          </>
        )}
      </FlexContainer>
    </PerfectScrollbar>
  )
}

export default StudentWork
