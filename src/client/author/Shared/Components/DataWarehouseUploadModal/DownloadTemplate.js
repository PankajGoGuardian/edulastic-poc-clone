import React from 'react'
import { Icon } from 'antd'
import {
  DownloadTemplateContainer,
  DownloadTemplateDivider,
} from './styledComponents'

const DownloadTemplate = ({ url }) => {
  return (
    <>
      <DownloadTemplateDivider />
      <DownloadTemplateContainer>
        <a href={url} download>
          DOWNLOAD TEMPLATE <Icon type="download" />
        </a>
      </DownloadTemplateContainer>
    </>
  )
}

export default DownloadTemplate
