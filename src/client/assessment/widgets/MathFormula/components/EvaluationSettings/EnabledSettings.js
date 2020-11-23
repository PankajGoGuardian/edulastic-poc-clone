import React, { useMemo } from 'react'
import styled from 'styled-components'
import { keys, isArray, isEmpty, isString } from 'lodash'
import { withNamespaces } from '@edulastic/localization'
import { lightGrey9, greyThemeLight } from '@edulastic/colors'

const separators = [
  { value: ',', label: 'commna' },
  { value: '.', label: 'dot' },
  { value: ' ', label: 'space' },
]
const EnabledSettings = ({ t, options }) => {
  const optionsToShow = useMemo(() => {
    const optionKeys = keys(options)
    return optionKeys
      .map((key) => {
        if (options[key]) {
          if (isArray(options[key]) && !isEmpty(options[key])) {
            const labels = options[key].map((x) => {
              const separator = separators.find((s) => s.value === x)
              if (separator) {
                return separator.label
              }
              return x
            })
            return `"${labels.join(',')}" ${t(`component.math.${key}`)}`
          }
          if (isString(options[key])) {
            let label = options[key]
            const separator = separators.find((s) => s.value === options[key])
            if (separator) {
              label = separator.label
            }

            return `"${label}" ${t(`component.math.${key}`)}`
          }
          return t(`component.math.${key}`)
        }
        return false
      })
      .filter((x) => !!x)
  }, [options])

  return (
    <Container>
      <ul>
        {['Mathematically Equivalent'].concat(optionsToShow).map((opt) => (
          <li key={opt}>{opt}</li>
        ))}
      </ul>
    </Container>
  )
}

export default withNamespaces('assessment')(EnabledSettings)

const Container = styled.div`
  margin-top: 12px;
  ul {
    padding: 0px;
    margin: 0px;
    li {
      list-style: none;
      color: ${lightGrey9};
      font-size: 12px;
      padding: 2px 0px;

      &::before {
        content: ' ';
        width: 8px;
        height: 8px;
        display: inline-block;
        margin-right: 12px;
        border-radius: 50%;
        background: ${greyThemeLight};
      }
    }
  }
`
