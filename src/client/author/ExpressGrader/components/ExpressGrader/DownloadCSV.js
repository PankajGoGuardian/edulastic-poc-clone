import React from 'react'
import styled from 'styled-components'
import { EduButton, FlexContainer } from '@edulastic/common'
import { IconPrint } from '@edulastic/icons'

const DownloadCSV = () => {
  return (
    <FlexContainer marginLeft="20px">
      <PrintButton isGhost height="24px">
        <IconPrint />
        Print
      </PrintButton>
      <DownloadButton isGhost height="24px" ml="0px">
        Download CSV
      </DownloadButton>
    </FlexContainer>
  )
}

export default DownloadCSV

const PrintButton = styled(EduButton)`
  border-top-right-radius: 0px;
  border-bottom-right-radius: 0px;
`

const DownloadButton = styled(EduButton)`
  border-left: 0px;
  border-top-left-radius: 0px;
  border-bottom-left-radius: 0px;
`
