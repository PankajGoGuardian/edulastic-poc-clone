import React, { useMemo } from 'react'
import { Tooltip } from 'antd'
import Menu from 'antd/lib/menu'
import { Link } from 'react-router-dom'
import { EduElse, EduIf, EduThen } from '@edulastic/common'
import { EDIT } from '../../constants/common'
import { ucFirst, titleCase } from '../utils'

const ActionMenuItem = ({
  item,
  urlData,
  isEditDisabled,
  GIType,
  ...restProps
}) => {
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

  const isEditOptionDisabled = isEditDisabled && id === EDIT

  return (
    <Menu.Item key={id} {...restProps} disabled={isEditOptionDisabled}>
      <EduIf condition={url?.length > 0}>
        <EduThen>
          <Link to={url} target={url}>
            {label}
          </Link>
        </EduThen>
        <EduElse>
          <Tooltip
            placement="top"
            title={
              isEditOptionDisabled
                ? `The ${ucFirst(
                    titleCase(GIType)
                  )} has ended and hence cannot be edited.`
                : null
            }
          >
            {label}
          </Tooltip>
        </EduElse>
      </EduIf>
    </Menu.Item>
  )
}

export default ActionMenuItem
