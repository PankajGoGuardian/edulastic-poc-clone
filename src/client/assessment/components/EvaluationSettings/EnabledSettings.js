import React, { useMemo } from 'react'
import styled from 'styled-components'
import { getMathHtml } from '@edulastic/common'
import { math as mathConstants } from '@edulastic/constants'

import { keys, isArray, isEmpty, isString, values } from 'lodash'

import { withNamespaces } from '@edulastic/localization'
import { lightGrey9, greyThemeLight } from '@edulastic/colors'

const { syntaxes, GRAPH_EVALUATION_SETTING } = mathConstants
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
        let label = ''
        if (key === 'apiLatex' || key === 'isSimplified') {
          return false
        }
        if (key === 'syntax') {
          const syntax = syntaxOptions.find((x) => x.value === options[key])
          if (syntax) {
            label = syntax.label
          }
        } else if (key === 'unit') {
          const mathHtml = getMathHtml(options[key] || '')
          label = `${mathHtml} ${t(`component.math.${key}`)}`
        } else if (options[key]) {
          if (isArray(options[key]) && !isEmpty(options[key])) {
            const labels = options[key].map((x) => {
              const separator = separators.find((s) => s.value === x)
              if (separator) {
                return separator.label
              }
              return x
            })
            label = `"${labels.join(',')}" ${t(`component.math.${key}`)}`
          } else if (isString(options[key])) {
            label = options[key]
            const separator = separators.find((s) => s.value === options[key])
            if (separator) {
              label = separator.label
            }

            label = `"${label}" ${t(`component.math.${key}`)}`
          } else {
            label = t(`component.math.${key}`)
          }
        }
        if (label) {
          return { key, label }
        }
        return false
      })
      .filter((x) => !!x)
    if (allowNumericOnly) {
      optsLables.push({
        key: 'allowNumericOnly',
        label: t('component.math.allowNumericOnly'),
      })
    }
    if (!isEmpty(allowedVariables)) {
      optsLables.push({
        key: 'allowedVariables',
        label: `${allowedVariables} ${t('component.math.allowedVariables')}`,
      })
    }
    const evaluationMethod =
      method !== GRAPH_EVALUATION_SETTING
        ? [{ key: 'evaluationMethod', label: t(`component.math.${method}`) }]
        : []

    return evaluationMethod.concat(optsLables)
  }, [options, allowNumericOnly, allowedVariables])

  return (
    <Container>
      <ul>
        {optionsToShow.map((op) => (
          <li key={op.key} dangerouslySetInnerHTML={{ __html: op.label }} />
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
