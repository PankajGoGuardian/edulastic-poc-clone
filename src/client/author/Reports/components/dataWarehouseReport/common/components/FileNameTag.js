import { Icon, Tooltip } from 'antd'
import React from 'react'
import { FileNameTagContainer } from './StyledComponents'

const FileNameTag = ({ fileName, onClose }) => (
  <Tooltip title={fileName}>
    <FileNameTagContainer>
      <div className="file-name">{fileName}</div>
      <Icon type="close" onClick={() => onClose()} />
    </FileNameTagContainer>
  </Tooltip>
)

export default FileNameTag
