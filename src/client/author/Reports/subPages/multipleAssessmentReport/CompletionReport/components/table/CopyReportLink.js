import React from 'react'
import { IconCopy } from '@edulastic/icons'
import { themeColor } from '@edulastic/colors'
import CopyToClipboard from 'react-copy-to-clipboard'
import { ActionContainer } from './styled'

const CopyReportLink = ({ report }) => {
  return (
    <CopyToClipboard text="New Text" onCopy={() => console.log(report)}>
      <ActionContainer>
        <IconCopy color={themeColor} />
      </ActionContainer>
    </CopyToClipboard>
  )
}

export default CopyReportLink
