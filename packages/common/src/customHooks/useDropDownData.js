import React, { useMemo } from 'react'
import { AutoComplete } from 'antd'
import { escapeRegExp } from 'lodash'

const useDropdownData = (
  items,
  {
    title_key = 'title',
    id_key = '_id',
    showId = false,
    searchText = '',
    cropTitle = true,
    OptionComponent = AutoComplete.Option,
    value_key,
    optionProps,
    prefix = false,
    idKeyLength = 5,
  } = {}
) =>
  useMemo(
    () =>
      items.map((item) => {
        const idx = item[title_key].search(
          new RegExp(escapeRegExp(searchText), 'i')
        )
        let _title = item[title_key]
        if (idx !== -1) {
          const _titles = [
            _title.slice(0, idx),
            _title.slice(idx, idx + searchText.length),
            _title.slice(idx + searchText.length),
          ]
          _title = (
            <>
              {!!_titles[0].length && <b>{_titles[0]}</b>}
              {_titles[1]}
              {!!_titles[2].length && <b>{_titles[2]}</b>}
            </>
          )
        }
        const titleStyle = cropTitle
          ? {
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
            }
          : {}
        const _optionProps =
          typeof optionProps === 'object'
            ? optionProps
            : typeof optionProps === 'function'
            ? optionProps(item)
            : {}
        if (
          typeof value_key !== 'undefined' &&
          typeof (item[value_key] !== 'undefined')
        ) {
          _optionProps.value = item[value_key]
        }

        const showItemId = showId && item.showId !== false

        return (
          <OptionComponent
            {..._optionProps}
            key={item[id_key]}
            title={item[title_key]}
          >
            {typeof prefix === 'function' ? prefix(item) : prefix}
            <span style={titleStyle}>{_title}</span>
            {showItemId && (
              <span>{` (ID:${item[id_key].substring(
                item[id_key].length - idKeyLength
              )})`}</span>
            )}
          </OptionComponent>
        )
      }),
    [items, title_key, id_key, showId, searchText]
  )

export default useDropdownData
