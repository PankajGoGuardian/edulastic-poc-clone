import React, { useMemo } from 'react'
import styled from 'styled-components'
import { keys, isArray, isEmpty, isString } from 'lodash'
import { withNamespaces } from '@edulastic/localization'
import { lightGrey9, greyThemeLight } from '@edulastic/colors'

const EnabledSettings = ({ t, options }) => {
  const optionsToShow = useMemo(() => {
    const optionKeys = keys(options)
    return optionKeys
      .map((key) => {
        if (options[key]) {
          if (isArray(options[key]) && !isEmpty(options[key])) {
            return `${options[key].join(',')} ${t(`component.math.${key}`)}`
          }
          if (isString(options[key])) {
            return `${options[key]} ${t(`component.math.${key}`)}`
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
        {optionsToShow.map((opt) => (
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
