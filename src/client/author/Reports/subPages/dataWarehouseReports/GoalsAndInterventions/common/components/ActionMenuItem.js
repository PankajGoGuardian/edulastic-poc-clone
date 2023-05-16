import React, { useMemo } from 'react'
import Menu from 'antd/lib/menu'
import { Link } from 'react-router-dom'
import { EduElse, EduIf, EduThen } from '@edulastic/common'
import { urlParamsKeys } from '../../constants/common'

const ActionMenuItem = ({ item, urlData, ...restProps }) => {
  const { link = '', id, label } = item

  const url = useMemo(() => {
    if (link?.length) {
      let updatedUrl = link

      urlParamsKeys.forEach((param) => {
        updatedUrl = urlData[param]?.length
          ? updatedUrl.replace(`{${param}}`, urlData[param])
          : updatedUrl.replace(`{${param}}`, '')
      })
      return updatedUrl
    }
    return ''
  }, [urlData])

  return (
    <Menu.Item key={id} {...restProps}>
      <EduIf condition={url?.length > 0}>
        <EduThen>
          <Link to={url} target={url}>
            {label}
          </Link>
        </EduThen>
        <EduElse>{label}</EduElse>
      </EduIf>
    </Menu.Item>
  )
}

export default ActionMenuItem
