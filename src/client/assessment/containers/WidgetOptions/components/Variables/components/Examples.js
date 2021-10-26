import React, { useEffect, useState } from 'react'
import { withNamespaces } from '@edulastic/localization'
import { connect } from 'react-redux'
import { compose } from 'redux'
import styled from 'styled-components'
import { Table, Popconfirm } from 'antd'
import { keys, cloneDeep, get, isEmpty } from 'lodash'

import {
  MathFormulaDisplay,
  TextInputStyled,
  EduButton,
} from '@edulastic/common'
import { redDark } from '@edulastic/colors'
import { IconTrash } from '@edulastic/icons'

import {
  getQuestionDataSelector,
  setQuestionDataAction,
} from '../../../../../../author/QuestionEditor/ducks'

import { Row } from '../../../../../styled/WidgetOptions/Row'
import { Col } from '../../../../../styled/WidgetOptions/Col'
import { Block } from '../../../../../styled/WidgetOptions/Block'
import { Label } from '../../../../../styled/WidgetOptions/Label'

import { getMathTemplate } from '../../../../../utils/variables'

const Examples = ({ t, onGenerate, questionData, setQuestionData }) => {
  const [count, setCount] = useState(0)
  const examples = get(questionData, 'variable.examples', [])
  const variables = get(questionData, 'variable.variables', {})
  const combinationsCount = get(questionData, 'variable.combinationsCount', 25)

  const handleChangeCount = (evt) => {
    if (/^\d+$/.test(evt.target.value) || !evt.target.value) {
      const countValue = !evt.target.value ? '' : +evt.target.value
      if (countValue <= 200) {
        setCount(countValue)
      }
    }
  }

  const handleBlurCount = () => {
    if (+count !== combinationsCount) {
      const newData = cloneDeep(questionData)
      if (!newData.variable) {
        newData.variable = {}
      }
      newData.variable.combinationsCount = +count
      onGenerate(newData)
    } else if (!count) {
      setCount(0)
    }
  }

  const clearExamples = (exam) => () => {
    const newData = cloneDeep(questionData)
    if (!exam) {
      newData.variable.examples = []
    } else {
      const { key: rowIdx } = exam
      const newExams = examples
        .filter((x, i) => i !== rowIdx)
        .map((x, i) => ({ ...x, key: i }))
      newData.variable.examples = newExams
    }
    setQuestionData(newData)
  }

  const handleGenerate = () => {
    onGenerate(questionData)
  }

  const columns = keys(variables).map((variableName) => ({
    title: variableName,
    dataIndex: variableName,
    key: variables[variableName].id,
    render: (text) => {
      return text !== 'Recursion_Error' && text !== 'Parsing_Error' ? (
        <MathFormulaDisplay
          dangerouslySetInnerHTML={{
            __html: getMathTemplate(text),
          }}
        />
      ) : (
        <ErrorText>Unable to parse expression</ErrorText>
      )
    },
  }))

  useEffect(() => {
    setCount(combinationsCount)
  }, [combinationsCount])

  if (!isEmpty(examples)) {
    columns.push({
      title: (
        <Popconfirm
          okText="Yes"
          cancelText="No"
          placement="left"
          onConfirm={clearExamples()}
          title="Are you sure to clear all examples?"
        >
          <TrashIcon />
        </Popconfirm>
      ),
      key: 'action',
      width: 30,
      render: (text, record) => (
        <Popconfirm
          okText="Yes"
          cancelText="No"
          placement="left"
          onConfirm={clearExamples(record)}
          title="Are you sure to clear this example?"
        >
          <TrashIcon />
        </Popconfirm>
      ),
    })
  }

  return (
    <Block>
      <Row gutter={24}>
        <Col md={20}>
          <InlineLabel>
            {t('component.options.beforeCombinationCount')}
          </InlineLabel>
          <TextInputStyled
            width="70px"
            type="number"
            value={count}
            size="large"
            style={{ margin: '0px 15px' }}
            data-cy="combinationCount"
            onChange={handleChangeCount}
            onBlur={handleBlurCount}
          />
          <InlineLabel>
            {t('component.options.afterCombinationCount')}
          </InlineLabel>
        </Col>
        <Col md={4}>
          <EduButton
            // don't pass event to generate method
            onClick={() => handleGenerate()}
            style={{ float: 'right' }}
            data-cy="generate"
          >
            Generate
          </EduButton>
        </Col>
      </Row>
      <Row gutter={24}>
        <Col md={24}>
          <Table
            columns={columns}
            dataSource={examples}
            pagination={{
              pageSize: 10,
            }}
          />
        </Col>
      </Row>
    </Block>
  )
}

export const ExampleField = ({ variable }) => (
  <Col md={5} style={{ paddingTop: 10, paddingLeft: 12 }}>
    {variable.exampleValue !== 'Recursion_Error' &&
      variable.exampleValue !== 'Parsing_Error' && (
        <MathFormulaDisplay
          dangerouslySetInnerHTML={{
            __html: getMathTemplate(variable.exampleValue),
          }}
        />
      )}
    {(variable.exampleValue === 'Recursion_Error' ||
      variable.exampleValue === 'Parsing_Error') && (
      <ErrorText>Unable to parse expression</ErrorText>
    )}
  </Col>
)

const enhance = compose(
  withNamespaces('assessment'),
  connect(
    (state) => ({
      questionData: getQuestionDataSelector(state),
    }),
    {
      setQuestionData: setQuestionDataAction,
    }
  )
)

export default enhance(Examples)

const InlineLabel = styled(Label)`
  display: inline-block;
`

const ErrorText = styled.span`
  color: ${redDark};
`

const TrashIcon = styled(IconTrash)`
  fill: ${redDark};
  cursor: pointer;
  margin-top: 2px;
`
