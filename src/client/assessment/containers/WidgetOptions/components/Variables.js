import React, { useEffect, useRef, useState } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { compose } from 'redux'
import {
  cloneDeep,
  get,
  has,
  random,
  isEmpty,
  shuffle,
  range,
  isArray,
  keys,
  flatMapDeep,
  first,
  values,
  isUndefined,
  zipObject,
  maxBy,
  isEqual,
  round,
} from 'lodash'

import { Select, Table } from 'antd'
import styled from 'styled-components'
import { withNamespaces } from '@edulastic/localization'
import { variableTypes, math } from '@edulastic/constants'
import {
  MathInput,
  MathFormulaDisplay,
  notification,
  CustomModalStyled,
} from '@edulastic/common'
import { extraDesktopWidthMax, redDark } from '@edulastic/colors'
import { getFormattedAttrId } from '@edulastic/common/src/helpers'
import {
  getQuestionDataSelector,
  setQuestionDataAction,
  calculateFormulaAction,
} from '../../../../author/QuestionEditor/ducks'

import { Block } from '../../../styled/WidgetOptions/Block'
import { Row } from '../../../styled/WidgetOptions/Row'
import { Col } from '../../../styled/WidgetOptions/Col'
import { Label } from '../../../styled/WidgetOptions/Label'
import { CustomStyleBtn } from '../../../styled/ButtonStyles'

import { Subtitle } from '../../../styled/Subtitle'
import Question from '../../../components/Question'
import { CheckboxLabel } from '../../../styled/CheckboxWithLabel'
import { SelectInputStyled, TextInputStyled } from '../../../styled/InputStyles'
import { StyledToggleLink, StyledResourceLink } from '../styled/StyledLink'

const { defaultNumberPad } = math

const SEQUENCE_TYPES = ['NUMBER_SEQUENCE', 'TEXT_SEQUENCE']
const SET_TYPES = ['NUMBER_SET', 'TEXT_SET']

const cartesian = (args, combinationsCount) => {
  const r = []
  const available = args.reduce((acc, curr) => acc * curr.length, 1)

  const helper = () => {
    const c = []
    for (let j = 0; j < args.length; j++) {
      const randomIndex = random(0, args[j].length - 1)
      c.push(args[j][randomIndex])
    }
    return c
  }

  let n = 0
  while (n < combinationsCount && n < available) {
    const combination = helper()
    if (!r.some((a) => isEqual(a, combination))) {
      n++
      r.push(combination)
    }
  }
  return r
}

const generateExample = (variable) => {
  const { type, set = '', sequence = '' } = variable
  let { min, max, step = 1 } = variable
  if (type === 'NUMBER_RANGE') {
    if (Number.isInteger(parseFloat(step))) {
      min = parseInt(min, 10)
      // need to include endpoint
      max = parseInt(max, 10) + 1
      step = parseInt(step, 10)
    } else {
      min = parseFloat(min)
      max = parseFloat(max)
      step = parseFloat(step)
      //  need to include endpoint
      max = parseFloat(max) + step
    }
    if (step === 0) {
      step = 1
    }
    const decimalPart = step.toString().split('.')[1]?.length || 1
    return range(min, max, step).map((x) => round(x, decimalPart))
  }
  if (SEQUENCE_TYPES.includes(type)) {
    if (isArray(sequence)) {
      return sequence
    }
    return sequence
      .split(',')
      .filter((x) => x.trim())
      .filter((x) => x)
  }
  if (SET_TYPES.includes(type)) {
    if (isArray(set)) {
      return set
    }
    return set
      .split(',')
      .filter((x) => x.trim())
      .filter((x) => x)
  }
  console.log('ERROR, unknown type:', type)
}

const processNonSequence = (nonSsequences, combinationsCount) => {
  const results = {}
  const input_list = []
  const variableNames = keys(nonSsequences)

  variableNames.forEach((variableName) => {
    input_list.push(generateExample(nonSsequences[variableName]))
  })

  const allCombinations = cartesian(input_list, combinationsCount)
  variableNames.forEach((variableName, index) => {
    results[variableName] = flatMapDeep(allCombinations, (c) => c[index])
  })
  return results
}

const processSequence = (sequences) => {
  const results = {}
  keys(sequences).forEach((variableName) => {
    results[variableName] = generateExample(sequences[variableName])
  })
  return results
}

const mergeResults = (sequences, nonSequences, combinationsCount) => {
  const results = {}
  const nonSequenceResults = processNonSequence(nonSequences, combinationsCount)
  const sequenceResults = processSequence(sequences)

  const nonSequenceLength = first(values(nonSequenceResults)).length

  first(values(sequenceResults)).forEach((a, replicationNumber) => {
    const replication = cloneDeep(nonSequenceResults)

    keys(sequenceResults).forEach((variableName) => {
      replication[variableName] = new Array(nonSequenceLength).fill(
        sequenceResults[variableName][replicationNumber]
      )
    })
    keys(replication).forEach((variableName) => {
      results[variableName] = [
        ...(results[variableName] || []),
        ...replication[variableName],
      ]
    })
  })
  return results
}

const shuffleCombinations = (combinations, combinationsCount) => {
  let results = []
  if (isEmpty(combinations)) {
    return results
  }
  const variableNames = keys(combinations)
  const combinationLength = maxBy(values(combinations), (c) => c.length).length
  for (let i = 0; i < combinationLength + 1; i++) {
    const combination = values(combinations)
      .map((value) => value[i])
      .filter((x) => !isUndefined(x))

    if (!isEmpty(combination)) {
      results.push(zipObject(variableNames, combination))
    }
  }
  results = shuffle(results)
  results = results
    .map((comb, index) => ({
      key: index,
      ...comb,
    }))
    .slice(0, combinationsCount)

  return results
}

const validSequence = (sequences) => {
  const seqArrays = values(sequences)
  return seqArrays?.every((seq) => seq.length === seqArrays[0]?.length)
}

const generateExampleValues = (
  variables,
  combinationsCount,
  shouldCheckSeq
) => {
  const nonSequences = {}
  const sequences = {}
  let results = {}
  let invalid = false

  keys(variables).forEach((variableName) => {
    const variable = variables[variableName]
    if (SEQUENCE_TYPES.includes(variable.type)) {
      sequences[variableName] = variable
    } else if (variable.type !== 'FORMULA') {
      nonSequences[variableName] = variable
    }
  })

  if (shouldCheckSeq) {
    invalid = !validSequence(processSequence(sequences))
  }

  if (invalid) {
    return [[], invalid]
  }

  if (!isEmpty(sequences) && !isEmpty(nonSequences)) {
    results = mergeResults(sequences, nonSequences, combinationsCount)
  } else if (!isEmpty(sequences)) {
    results = processSequence(sequences)
  } else if (!isEmpty(nonSequences)) {
    results = processNonSequence(nonSequences, combinationsCount)
  }

  const examplesValues = shuffleCombinations(results, combinationsCount)

  // remove combinations that has undefined
  const filtered = examplesValues.filter(
    (examples) => !values(examples).includes(undefined)
  )
  return [filtered, invalid]
}

const getMathFormulaTemplate = (latex) =>
  `<span class="input__math" data-latex="${latex}"></span>`

const Variables = ({
  t,
  setQuestionData,
  calculateFormula,
  questionData,
  fillSections,
  cleanSections,
  advancedAreOpen,
  item = {},
}) => {
  const [invalidSeqMsg, setInvalidSeqMsg] = useState('')
  const [
    showDynamicParameterDetails,
    setShowDynamicParameterDetails,
  ] = useState(false)
  const [showVideoModal, setShowVideoModal] = useState(false)
  const mathFieldRef = useRef()

  const variableEnabled = get(questionData, 'variable.enabled', false)
  const variables = get(questionData, 'variable.variables', {})
  const combinationsCount = get(questionData, 'variable.combinationsCount', 25)
  const examples = get(questionData, 'variable.examples', [])

  const types = Object.keys(variableTypes)
  const columns = Object.keys(variables).map((variableName) => {
    return {
      title: variableName,
      dataIndex: variableName,
      key: variables[variableName].id,
      render: (text) => {
        return text !== 'Recursion_Error' && text !== 'Parsing_Error' ? (
          <MathFormulaDisplay
            dangerouslySetInnerHTML={{
              __html: getMathFormulaTemplate(text),
            }}
          />
        ) : (
          <ErrorText>Unable to parse expression</ErrorText>
        )
      },
    }
  })

  const generate = (evt) => {
    const [examplesValues, invalid] = generateExampleValues(
      variables,
      combinationsCount,
      !!evt // when they click generate button
    )

    if (invalid) {
      // @see https://snapwiz.atlassian.net/browse/EV-27028
      setInvalidSeqMsg(t('component.options.invalidSeqVariableMsg'))
      return
    }
    calculateFormula({ examples: examplesValues, variables })
  }

  const handleChangeVariableList = (
    variableName,
    param,
    value,
    newQuestionData = null
  ) => {
    const newData = newQuestionData || cloneDeep(questionData)

    if (!has(newData, `variable.variables.${variableName}`)) {
      return
    }
    newData.variable.variables[variableName][param] = value

    if (newData.variable.variables[variableName].type !== 'FORMULA') {
      const [newExampleValue] = generateExampleValues(
        newData.variable.variables,
        combinationsCount
      )
      if (!isEmpty(newExampleValue)) {
        const index = Math.floor(Math.random() * newExampleValue.length)
        if (newExampleValue[index]) {
          keys(newExampleValue[index]).forEach((varialeKey) => {
            if (varialeKey !== 'key') {
              newData.variable.variables[varialeKey].exampleValue =
                newExampleValue[index][varialeKey]
            }
          })
        }
      }
    }

    setQuestionData(newData)
  }

  const handleChangeVariableType = (variableName, param, value) => {
    const newData = cloneDeep(questionData)

    if (!has(newData, `variable.variables.${variableName}`)) {
      return
    }
    let newVariable = {
      id: newData.variable.variables[variableName].id,
      name: newData.variable.variables[variableName].name,
      type: value,
      exampleValue: '',
    }

    switch (newVariable.type) {
      case 'NUMBER_RANGE':
        newVariable = {
          ...newVariable,
          min: 0,
          max: 10,
          step: 1,
          decimal: 0,
        }
        break
      case 'TEXT_SET':
      case 'NUMBER_SET':
        newVariable = {
          ...newVariable,
          set: '',
        }
        break
      case 'NUMBER_SEQUENCE':
      case 'TEXT_SEQUENCE':
        newVariable = {
          ...newVariable,
          sequence: '',
        }
        break
      case 'FORMULA':
        newVariable = {
          ...newVariable,
          formula: '',
        }
        break
      default:
        break
    }

    newData.variable.variables[variableName] = newVariable
    handleChangeVariableList(variableName, param, value, newData)
  }

  const handleChangeVariable = (param, value) => {
    const newData = cloneDeep(questionData)

    if (!newData.variable) {
      newData.variable = {}
    }

    newData.variable[param] = value
    setQuestionData(newData)
  }

  const handleKeypressMathInput = (e) => {
    if (e.key === '@') {
      notification({
        msg: (
          <div>
            Dynamic Parameter formulas do not handle &#34;@&#34; symbols.
            <br /> For example, if you want to add one, can not handle
            &#34;@a+1&#34;, but instead write it as &#34;a+1&#34;
          </div>
        ),
      })
      e.preventDefault()
      e.stopPropagation()
    }
  }

  useEffect(() => {
    if (variableEnabled && !examples.length) {
      generate()
    }
  }, [variableEnabled])

  return (
    <Question
      section="advanced"
      label={t('component.options.dynamicParameters')}
      fillSections={fillSections}
      cleanSections={cleanSections}
      advancedAreOpen={advancedAreOpen}
    >
      <Subtitle
        id={getFormattedAttrId(
          `${item?.title}-${t('component.options.dynamicParameters')}`
        )}
      >
        {t('component.options.dynamicParameters')}
      </Subtitle>
      <Row gutter={24}>
        <Col md={24}>
          <DynamicText>
            <StyledToggleLink
              onClick={() =>
                setShowDynamicParameterDetails(!showDynamicParameterDetails)
              }
            >
              {t('component.options.generateRandomVariables')}
            </StyledToggleLink>
            {showDynamicParameterDetails && (
              <>
                <StyledResourceLink onClick={() => setShowVideoModal(true)}>
                  {t('component.options.videoReference')}
                </StyledResourceLink>
                <span>
                  {t('component.options.dynamicParametersDescription')}
                </span>
                <br />
                <br />
                <StyledResourceLink
                  onClick={() =>
                    window.open(
                      'https://edulastic.com/help-center/questions-with-dynamic-content-602',
                      '_blank'
                    )
                  }
                >
                  <span>{t('component.options.externalPageReference')}</span>
                </StyledResourceLink>
                <CustomModalStyled
                  title="Dynamic Parameters"
                  visible={showVideoModal}
                  onCancel={() => setShowVideoModal(false)}
                  footer={null}
                  destroyOnClose
                  width="768px"
                  centered
                >
                  <iframe
                    title="Dynamic Parameters"
                    src="https://www.youtube.com/embed/mvVjnpWAqKM?autoplay=1"
                    frameBorder="0"
                    allowFullScreen
                    width="100%"
                    height="400"
                  />
                </CustomModalStyled>
              </>
            )}
          </DynamicText>
        </Col>
      </Row>
      <Row gutter={24}>
        <Col md={24}>
          <CheckboxLabel
            data-cy="variableEnabled"
            checked={variableEnabled}
            onChange={(e) => {
              handleChangeVariable('enabled', e.target.checked)
            }}
            size="large"
          >
            {t('component.options.checkVariables')}
          </CheckboxLabel>
        </Col>
      </Row>
      {variableEnabled && Object.keys(variables).length > 0 && (
        <Block>
          <Row gutter={4}>
            <Col md={2}>
              <Label>{t('component.options.variable')}</Label>
            </Col>
            <Col md={5}>
              <Label>{t('component.options.variableType')}</Label>
            </Col>
            <Col md={3}>
              <Label>{t('component.options.variableMin')}</Label>
            </Col>
            <Col md={3}>
              <Label>{t('component.options.variableMax')}</Label>
            </Col>
            <Col md={3}>
              <Label>{t('component.options.variableStep')}</Label>
            </Col>
            <Col md={3}>
              <Label>{t('component.options.variableDecimalPlaces')}</Label>
            </Col>
            <Col md={5}>
              <Label>{t('component.options.variableExample')}</Label>
            </Col>
          </Row>
          {Object.keys(variables).map((variableName, index) => {
            const variable = variables[variableName]
            const isRange = variable.type.includes('RANGE')
            const isFormula = variable.type.includes('FORMULA')
            const isSet = variable.type.includes('SET')
            const isNumberSquence = variable.type === 'NUMBER_SEQUENCE'
            const isTextSquence = variable.type === 'TEXT_SEQUENCE'
            return (
              <Row
                key={`variable${index}`}
                gutter={4}
                data-cy={`variable${index}`}
              >
                <Col md={2}>
                  <Label style={{ textTransform: 'none' }}>
                    {variableName}
                  </Label>
                </Col>
                <Col md={5}>
                  <SelectInputStyled
                    size="large"
                    data-cy="variableType"
                    value={variable.type}
                    getPopupContainer={(triggerNode) => triggerNode.parentNode}
                    onChange={(value) =>
                      handleChangeVariableType(variableName, 'type', value)
                    }
                    style={{ width: '100%' }}
                  >
                    {types.map((key) => (
                      <Select.Option data-cy={key} key={key} value={key}>
                        {variableTypes[key]}
                      </Select.Option>
                    ))}
                  </SelectInputStyled>
                </Col>
                {isFormula && (
                  <Col md={12}>
                    <MathInput
                      ref={mathFieldRef}
                      dynamicVariableInput
                      fullWidth
                      showDropdown
                      numberPad={defaultNumberPad}
                      value={variable.formula}
                      showResponse={false}
                      onInput={(latex) =>
                        handleChangeVariableList(variableName, 'formula', latex)
                      }
                      onKeyPress={handleKeypressMathInput}
                      onBlur={generate}
                    />
                  </Col>
                )}
                {isSet && (
                  <Col md={12}>
                    <TextInputStyled
                      data-cy="variableSet"
                      value={variable.set}
                      onChange={(e) =>
                        handleChangeVariableList(
                          variableName,
                          'set',
                          e.target.value
                        )
                      }
                      onBlur={generate}
                      size="large"
                    />
                  </Col>
                )}
                {isNumberSquence && (
                  <Col md={12}>
                    <TextInputStyled
                      data-cy="variableNumberSequence"
                      value={variable.sequence}
                      onChange={(e) =>
                        handleChangeVariableList(
                          variableName,
                          'sequence',
                          e.target.value
                        )
                      }
                      onBlur={generate}
                      size="large"
                    />
                  </Col>
                )}
                {isTextSquence && (
                  <Col md={12}>
                    <TextInputStyled
                      data-cy="variableTextSequence"
                      value={variable.sequence}
                      onChange={(e) =>
                        handleChangeVariableList(
                          variableName,
                          'sequence',
                          e.target.value
                        )
                      }
                      onBlur={generate}
                      size="large"
                    />
                  </Col>
                )}
                {isRange && (
                  <Col md={3}>
                    <TextInputStyled
                      type="number"
                      data-cy="variableMin"
                      value={variable.min}
                      step={0.1}
                      onChange={(e) =>
                        handleChangeVariableList(
                          variableName,
                          'min',
                          e.target.value ? +e.target.value : ''
                        )
                      }
                      onBlur={generate}
                      size="large"
                    />
                  </Col>
                )}
                {isRange && (
                  <Col md={3}>
                    <TextInputStyled
                      type="number"
                      data-cy="variableMax"
                      value={variable.max}
                      step={0.1}
                      onChange={(e) =>
                        handleChangeVariableList(
                          variableName,
                          'max',
                          e.target.value ? +e.target.value : ''
                        )
                      }
                      onBlur={generate}
                      size="large"
                    />
                  </Col>
                )}
                {isRange && (
                  <Col md={3}>
                    <TextInputStyled
                      type="number"
                      data-cy="variableStep"
                      value={variable.step}
                      step={0.1}
                      onChange={(e) =>
                        handleChangeVariableList(
                          variableName,
                          'step',
                          e.target.value ? +e.target.value : ''
                        )
                      }
                      onBlur={generate}
                      size="large"
                    />
                  </Col>
                )}
                {isRange && (
                  <Col md={3}>
                    <TextInputStyled
                      type="number"
                      data-cy="variableDecimal"
                      value={variable.decimal}
                      onChange={(e) =>
                        handleChangeVariableList(
                          variableName,
                          'decimal',
                          e.target.value ? parseInt(e.target.value, 10) : ''
                        )
                      }
                      onBlur={generate}
                      size="large"
                    />
                  </Col>
                )}
                <Col md={5} style={{ paddingTop: 10, paddingLeft: 12 }}>
                  {variable.exampleValue !== 'Recursion_Error' &&
                    variable.exampleValue !== 'Parsing_Error' && (
                      <MathFormulaDisplay
                        dangerouslySetInnerHTML={{
                          __html: getMathFormulaTemplate(variable.exampleValue),
                        }}
                      />
                    )}
                  {(variable.exampleValue === 'Recursion_Error' ||
                    variable.exampleValue === 'Parsing_Error') && (
                    <ErrorText>Unable to parse expression</ErrorText>
                  )}
                </Col>
              </Row>
            )
          })}
        </Block>
      )}
      {variableEnabled && Object.keys(variables).length > 0 && (
        <Block>
          <Row gutter={24}>
            <Col md={20}>
              <InlineLabel>
                {t('component.options.beforeCombinationCount')}
              </InlineLabel>
              <TextInputStyled
                type="number"
                data-cy="combinationCount"
                value={combinationsCount}
                onChange={(e) =>
                  handleChangeVariable('combinationsCount', +e.target.value)
                }
                size="large"
                width="70px"
                style={{ margin: '0px 15px' }}
              />
              <InlineLabel>
                {t('component.options.afterCombinationCount')}
              </InlineLabel>
            </Col>
            <Col md={4}>
              <CustomStyleBtn
                width="auto"
                margin="0px"
                onClick={generate}
                type="button"
                style={{ float: 'right' }}
                data-cy="generate"
              >
                Generate
              </CustomStyleBtn>
            </Col>
          </Row>
          <Row gutter={24}>
            <Col md={24}>
              <Table
                columns={columns}
                key={`table-${Math.random(10)}`}
                dataSource={examples}
                pagination={{
                  pageSize: 10,
                }}
              />
            </Col>
          </Row>
        </Block>
      )}
      <ErrorMsgModal
        centered
        visible={!!invalidSeqMsg}
        onCancel={() => setInvalidSeqMsg('')}
        footer={
          <CustomStyleBtn onClick={() => setInvalidSeqMsg('')}>
            Confirm
          </CustomStyleBtn>
        }
      >
        {invalidSeqMsg}
      </ErrorMsgModal>
    </Question>
  )
}

Variables.propTypes = {
  setQuestionData: PropTypes.func.isRequired,
  item: PropTypes.object.isRequired,
  calculateFormula: PropTypes.func.isRequired,
  questionData: PropTypes.object.isRequired,
  t: PropTypes.func.isRequired,
  fillSections: PropTypes.func,
  cleanSections: PropTypes.func,
  advancedAreOpen: PropTypes.bool,
}

Variables.defaultProps = {
  advancedAreOpen: false,
  fillSections: () => {},
  cleanSections: () => {},
}

const enhance = compose(
  withNamespaces('assessment'),
  connect(
    (state) => ({
      questionData: getQuestionDataSelector(state),
    }),
    {
      setQuestionData: setQuestionDataAction,
      calculateFormula: calculateFormulaAction,
    }
  )
)

export default enhance(Variables)

const InlineLabel = styled(Label)`
  display: inline-block;
`

const DynamicText = styled.div`
  font-size: ${(props) => props.theme.smallFontSize};

  @media (min-width: ${extraDesktopWidthMax}) {
    font-size: ${(props) => props.theme.widgetOptions.labelFontSize};
  }
`

const ErrorMsgModal = styled(CustomModalStyled)`
  .ant-modal-close {
    display: none;
  }
`

const ErrorText = styled.span`
  color: ${redDark};
`
