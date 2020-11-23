import React, { useRef } from 'react'
import PropTypes from 'prop-types'
import { FlexContainer } from '@edulastic/common'
import PerfectScrollbar from 'react-perfect-scrollbar'
import styled from 'styled-components'

const StyledImage = styled.img`
  max-height: 600px;
`
const FlexItem = styled.div`
  padding: 10px;
`

const StudentWork = ({ imageAttachments }) => {
  const ScrollbarRef = useRef(null)

  // This is needed for fixing a known bug in perfect-scrollbar library where
  // scrollbar exceeds the content length on some screen sizes
  // https://github.com/mdbootstrap/perfect-scrollbar/issues/920
  const handleScroll = () => ScrollbarRef.current?.updateScroll()

  return (
    <PerfectScrollbar ref={ScrollbarRef} onScrollX={handleScroll}>
      <FlexContainer
        alignItems="flex-end"
        flexDirection="row"
        flexWrap="no-wrap"
        justifyContent="space-between"
      >
        {imageAttachments.map((imageFile) => (
          <FlexItem>
            <StyledImage src={imageFile.source} alt={imageFile.name} />
          </FlexItem>
        ))}
      </FlexContainer>
    </PerfectScrollbar>
  )
}

StudentWork.propTypes = {
  imageAttachments: PropTypes.array.isRequired,
}

export default StudentWork
