import React from 'react'
import { Icon } from 'antd'
import { EduIf, EduThen } from '@edulastic/common'
import {
  DownloadTemplateContainer,
  DownloadTemplateDivider,
} from './styledComponents'

const DownloadTemplate = ({ url }) => {
  return (
    <EduIf condition={url}>
      <EduThen>
        <DownloadTemplateDivider />
        <DownloadTemplateContainer>
          <a href={url} download>
            DOWNLOAD TEMPLATE <Icon type="download" />
          </a>
        </DownloadTemplateContainer>
      </EduThen>
    </EduIf>
  )
}

export default DownloadTemplate
