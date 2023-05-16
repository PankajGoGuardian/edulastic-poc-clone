import styled from 'styled-components'
import { Button } from 'antd'

import { FlexContainer } from '@edulastic/common'

export const CreateUploadContainer = styled(FlexContainer)`
  justify-content: center;
  align-items: center;
  flex-direction: column;
  width: 50%;
  height: 70%;
  /* todo: delete when upload icon is available */
  padding-bottom: 90px;
`
export const FileInfoCont = styled.div`
  padding: 4px;
  display: flex;
  align-items: flex-start;
`

export const FileName = styled.div`
  font-size: 12px;
  font-weight: 600;
  margin-top: 20px;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;

  svg {
    font-size: 20px;
    margin-right: 4px;
  }
`

export const FileSize = styled.div`
  margin-left: 4px;
  padding-top: 2px;
  font-style: italic;
`

export const UploadCancelBtn = styled(Button)`
  padding: 2px 4px;
  font-size: 12px;
  height: 24px;
  margin-left: 2px;
  position: relative;
  z-index: 1000;
`

export const ProgressCont = styled.div`
  display: flex;
  width: 100%;
`

export const ProgressBarWrapper = styled.div`
  width: 100%;
`
