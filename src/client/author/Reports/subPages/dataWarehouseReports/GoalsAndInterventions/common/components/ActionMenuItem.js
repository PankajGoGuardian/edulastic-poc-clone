import React, { useMemo } from 'react'
import Menu from 'antd/lib/menu'
import { Link } from 'react-router-dom'
import { EduElse, EduIf, EduThen } from '@edulastic/common'

const ActionMenuItem = ({ item, urlData, ...restProps }) => {
  const { link = '', id, label } = item

  const url = useMemo(() => {
    if (link?.length) {
      let updatedUrl = link

      Object.keys(urlData).forEach((param) => {
        updatedUrl = urlData[param]?.length
          ? updatedUrl.replace(new RegExp(`{${param}}`, 'g'), urlData[param])
          : updatedUrl.replace(new RegExp(`{${param}}`, 'g'), '')
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
