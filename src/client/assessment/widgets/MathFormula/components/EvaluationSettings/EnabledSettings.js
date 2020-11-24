import React, { useMemo } from 'react'
import styled from 'styled-components'
import { math as mathConstants } from '@edulastic/constants'

import { keys, isArray, isEmpty, isString, values } from 'lodash'

import { withNamespaces } from '@edulastic/localization'
import { lightGrey9, greyThemeLight } from '@edulastic/colors'

const { syntaxes } = mathConstants
const separators = [
  { value: ',', label: 'comma' },
  { value: '.', label: 'dot' },
  { value: ' ', label: 'space' },
]
const EnabledSettings = ({
  t,
  options,
  method,
  allowNumericOnly,
  allowedVariables,
}) => {
  const syntaxOptions = values(syntaxes).map((syntax) => ({
    value: syntax,
    label: t(`component.math.${syntax}`),
  }))

  const optionsToShow = useMemo(() => {
    const optionKeys = keys(options)
    const optsLables = optionKeys
      .map((key) => {
        if (key === 'syntax') {
          const syntax = syntaxOptions.find((x) => x.value === options[key])
          if (syntax) {
            return syntax.label
          }
          return false
        }
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
    if (allowNumericOnly) {
      optsLables.push(t('component.math.allowNumericOnly'))
    }
    if (!isEmpty(allowedVariables)) {
      optsLables.push(
        `${allowedVariables} ${t('component.math.allowedVariables')}`
      )
    }
    return optsLables
  }, [options, allowNumericOnly, allowedVariables])

  return (
    <Container>
      <ul>
        {[t(`component.math.${method}`)].concat(optionsToShow).map((opt) => (
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
