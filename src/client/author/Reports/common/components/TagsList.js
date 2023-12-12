import React, { useMemo } from 'react'
import { Popover, Tooltip } from 'antd'
import styled from 'styled-components'
import { FilterTag } from '../styled'

/**
 * @typedef {{
 *   data: {title: string, key: string, closable?: boolean}[]
 *   onClose?: (e: React.MouseEvent<HTMLElement, MouseEvent>) => void
 *   maxTagsVisible: number
 * } & React.HTMLAttributes<HTMLDivElement> } TagsListProps
 *
 *  @type {React.FC<TagsListProps>} */
const TagsList = (props) => {
  const { data, maxTagsVisible = 5, onClose, ...rest } = props

  const [visibleTags, overflowTags] = useMemo(() => {
    // TODO: support responsive `maxTags`, similar to [rc-overflow](https://www.npmjs.com/package/rc-overflow)
    return [data.slice(0, maxTagsVisible), data.slice(maxTagsVisible)]
  }, [data, maxTagsVisible])

  const handleClose = (item) => (e) => {
    if (onClose) {
      onClose(item, e)
    }
  }

  const renderTag = (item) => (
    <Tooltip title={item.title} placement="topLeft" key={item.key}>
      <FilterTag
        visible // makes closing controlled
        onClose={handleClose(item)}
        closable
        data-key={item.key}
      >
        {item.title}
      </FilterTag>
    </Tooltip>
  )

  return (
    <div {...rest} style={{ display: 'inline-block' }}>
      {visibleTags.map(renderTag)}
      {overflowTags.length > 0 && (
        <Popover
          placement="bottom"
          content={
            <PopoverContentWrapper>
              {overflowTags.map(renderTag)}
            </PopoverContentWrapper>
          }
        >
          <FilterTag>{`+${overflowTags.length}`}</FilterTag>
        </Popover>
      )}
    </div>
  )
}

const PopoverContentWrapper = styled.div`
  max-width: 250px;
`

export default TagsList
