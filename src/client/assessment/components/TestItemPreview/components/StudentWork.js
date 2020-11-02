import React from 'react'
import { FlexContainer } from '@edulastic/common'
import PerfectScrollbar from 'react-perfect-scrollbar'

const StudentWork = ({ imageAttachments, renderScratchPadImage }) => {
  return (
    <PerfectScrollbar>
      <FlexContainer
        alignItems="flex-end"
        flexDirection="row"
        flexWrap="no-wrap"
        justifyContent="space-between"
      >
        <>
          <div>{renderScratchPadImage && renderScratchPadImage()}</div>
          {imageAttachments && imageAttachments.length > 0 && (
            <>
              {imageAttachments.map((imageFile) => (
                <div>
                  <img
                    style={{
                      maxHeight: '400px',
                      width: 'auto',
                      padding: '10px',
                    }}
                    src={imageFile.source}
                    alt={imageFile.name}
                  />
                </div>
              ))}
            </>
          )}
        </>
      </FlexContainer>
    </PerfectScrollbar>
  )
}

export default StudentWork
