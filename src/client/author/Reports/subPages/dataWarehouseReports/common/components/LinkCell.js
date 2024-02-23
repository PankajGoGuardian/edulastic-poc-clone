import { Tooltip } from 'antd'
import { EduElse, EduIf, EduThen } from '@edulastic/common'
import React from 'react'
import { Link } from 'react-router-dom'
import { CompareByContainer } from './styledComponents'

const LinkCell = ({ value, url, openNewTab = false, title = value.name }) => {
  const showLink = !!url
  const cellValue = value.name || '-'

  const linkProps = {
    // FIXME if current user is a proxy, then new tab gets opened as proxying user not proxied user.
    target: openNewTab ? '_blank' : '_self',
    rel: openNewTab ? 'opener' : '',
  }

  return (
    <div>
      <EduIf condition={showLink}>
        <EduThen>
          <Tooltip title={title}>
            <Link to={url} {...linkProps}>
              <CompareByContainer className="dimension-name">
                {cellValue}
              </CompareByContainer>
            </Link>
          </Tooltip>
        </EduThen>
        <EduElse>
          <Tooltip title={title}>
            <CompareByContainer className="dimension-name">
              {cellValue}
            </CompareByContainer>
          </Tooltip>
        </EduElse>
      </EduIf>
    </div>
  )
}

export default LinkCell
