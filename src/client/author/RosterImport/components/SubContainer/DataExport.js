import { connect } from 'react-redux'
import React from 'react'
import { IconUpload } from '@edulastic/icons'
import { borderGrey, greyThemeLight } from '@edulastic/colors'
import styled from 'styled-components'
import { Progress } from 'antd'
import { DownloadCsv, StyledDiv } from './styled'
import { RosterDataWrapper } from '../Container/styled'

const RosterData = ({ isFileUploading, uploadProgress }) => {
  return (
    <RosterDataWrapper>
      <DownloadCsv>
        {isFileUploading ? (
          <StyledProgress percent={uploadProgress} />
        ) : (
          <>
            <StyledDiv mb="15px">
              <IconUpload
                style={{
                  minWidth: '36px',
                  minHeight: '36px',
                  fill: greyThemeLight,
                }}
              />
            </StyledDiv>
            <StyledDiv mb="8px">DRAG & DROP YOUR FILE</StyledDiv>
            <StyledDiv style={{ fontSize: '12px' }} mb="15px">
              ADD ROSTER DATA IN CSV FILES WITHIN A ZIP FILE FORMAT
            </StyledDiv>
          </>
        )}
      </DownloadCsv>
    </RosterDataWrapper>
  )
}

export default connect(() => ({}), {})(RosterData)

const StyledProgress = styled(Progress)`
  display: flex;
  justify-content: center;
  flex-direction: column;
  .ant-progress-inner {
    border-radius: 0px;
  }
  .ant-progress-bg {
    border-radius: 0px;
    height: 15px !important;
  }
  .ant-progress-inner {
    background: ${borderGrey};
  }
`
