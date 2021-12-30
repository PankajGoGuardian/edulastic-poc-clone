import React, { useMemo } from 'react'
import styled from 'styled-components'
import { getMathHtml, replaceLatexTemplate } from '@edulastic/common'
import { math as mathConstants } from '@edulastic/constants'

import { keys, isArray, isEmpty, isString, values } from 'lodash'

import { withNamespaces } from '@edulastic/localization'
import { lightGrey9, greyThemeLight } from '@edulastic/colors'

import { Desc } from './components/HelperToolTip'

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
        if (
          key === 'specialPointOpts' ||
          key === 'apiLatex' ||
          key === 'isSimplified' ||
          key === 'penalty'
        ) {
          return false
        }
        if (key === 'syntax') {
          const syntax = syntaxOptions.find((x) => x.value === options[key])
          if (syntax) {
            label = syntax.label
          }
        } else if (key === 'unit' || key === 'latex') {
          const mathHtml = getMathHtml(options[key] || '')
          label = `${t(`component.math.${key}`)}: ${mathHtml}`
        } else if (options[key]) {
          if (isArray(options[key]) && !isEmpty(options[key])) {
            const labels = options[key].map((x) => {
              const separator = separators.find((s) => s.value === x)
              if (separator) {
                return separator.label
              }
              return x
            })
            label = `${t(`component.math.${key}`)}: ${labels.join(',')}`
          } else if (isString(options[key])) {
            label = options[key]
            const separator = separators.find((s) => s.value === options[key])
            if (separator) {
              label = separator.label
            }

            label = `${t(`component.math.${key}`)}: ${label}`
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
        label: `${t('component.math.allowedVariables')}: ${allowedVariables}`,
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
      <ul data-cy="enabledSettings">
        {optionsToShow.map((op) => (
          <li key={op.key}>
            <Desc text={replaceLatexTemplate(op.label)} />
          </li>
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
