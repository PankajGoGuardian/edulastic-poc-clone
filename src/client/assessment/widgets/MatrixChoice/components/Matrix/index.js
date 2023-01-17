import React, { useState } from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'

import { EduIf, helpers, WithMathFormula } from '@edulastic/common'
import { mainTextColor } from '@edulastic/colors'
import MatrixCell from '../MatrixCell'
import { StyledTable } from './styled/StyledTable'
import { getFontSize } from '../../../../utils/helpers'
import StyledHeader from './styled/StyledHeader'
import { IconWrapper } from './styled/IconWrapper'
import { IconCheck } from './styled/IconCheck'
import { IconClose } from './styled/IconClose'

const Matrix = (props) => {
  const {
    stems,
    options,
    response,
    responseIds,
    isMultiple,
    onCheck,
    uiStyle,
    evaluation,
    smallSize,
    isPrintPreview,
    tool,
    crossAction,
    onCrossOut,
    crossToolEnabled,
  } = props
  const [hoveredCell, setHoveredCell] = useState(null)

  // We expect stems to be an array, otherwise don't render
  if (!stems || !Array.isArray(stems)) {
    return null
  }

  const onCellMouseLeave = () => {
    setHoveredCell(null)
  }

  const getCell = (columnIndex, data) => {
    let checked = false
    let correct = false
    const rowIndex = data.index
    const responseId = responseIds?.[rowIndex]?.[columnIndex]

    const hovered = crossToolEnabled && hoveredCell === responseId
    const showCrossIcon =
      crossAction?.includes(responseId) ||
      (crossToolEnabled && hoveredCell === responseId)

    if (evaluation) {
      correct = evaluation[responseId] ? true : 'incorrect'
    }

    if (response && response.value) {
      checked = response.value[responseId]
    }

    const handleChange = () => {
      if (!crossToolEnabled && !crossAction?.includes(responseId)) {
        const checkData = {
          columnIndex,
          rowIndex,
          checked: !checked,
        }

        onCheck(checkData)
      } else if (crossToolEnabled && typeof onCrossOut === 'function') {
        onCrossOut(responseId)
      }
    }

    const handleHoverCell = () => {
      setHoveredCell(responseId)
    }

    return (
      <MatrixCell
        onChange={handleChange}
        onMouseEnter={handleHoverCell}
        onMouseLeave={onCellMouseLeave}
        checked={checked}
        correct={correct}
        type={uiStyle.type}
        label={options[columnIndex]}
        isMultiple={isMultiple}
        smallSize={smallSize}
        isPrintPreview={isPrintPreview}
        tool={tool}
        hovered={hovered}
        showCrossIcon={showCrossIcon}
      >
        <EduIf condition={evaluation && checked}>
          <IconWrapper correct={correct} isPrintPreview={isPrintPreview}>
            <EduIf condition={correct === true}>
              <IconCheck aria-label=", Correct answer" />
            </EduIf>
            <EduIf condition={correct === 'incorrect'}>
              <IconClose aria-label=", Incorrect answer" />
            </EduIf>
          </IconWrapper>
        </EduIf>
      </MatrixCell>
    )
  }

  const isTable = uiStyle.type === 'table'

  const optionsData = options.map((option, i) => ({
    title: (
      <StyledHeader
        style={{ color: mainTextColor }}
        dangerouslySetInnerHTML={{ __html: isTable ? option : '' }}
      />
    ),
    dataIndex: `${i}`,
    width: uiStyle.optionWidth || 'auto',
    key: i,
    render: (data) => getCell(i, data),
  }))

  const hasOptionRow = !helpers.isEmpty(uiStyle.optionRowTitle)
  const hasStemTitle = !helpers.isEmpty(uiStyle.stemTitle)

  const stemTitle = (
    <StyledHeader
      dangerouslySetInnerHTML={{ __html: uiStyle.stemTitle || '' }}
    />
  )
  const optionRowTitle = (
    <StyledHeader
      dangerouslySetInnerHTML={{ __html: uiStyle.optionRowTitle || '' }}
    />
  )

  let columns = [
    {
      title: stemTitle,
      dataIndex: 'stem',
      key: 'stem',
      width: uiStyle.stemWidth || 'auto',
      render: (stem) => <MathSpan dangerouslySetInnerHTML={{ __html: stem }} />,
    },
    {
      title: optionRowTitle,
      children: [...optionsData],
    },
  ]

  if (isTable && uiStyle.stemNumeration) {
    columns = [
      {
        title: '',
        dataIndex: 'numeration',
        key: 'numeration',
        render: (stem) => (
          <MathSpan dangerouslySetInnerHTML={{ __html: stem }} />
        ),
      },
      ...columns,
    ]
  }

  const getData = (i) => {
    const result = {}

    options.forEach((o, index) => {
      result[index] = {
        index: i,
      }
    })

    if (evaluation && evaluation.length > 0) {
      result[options.length] = {
        index: i,
      }
    }

    return result
  }

  const data = stems.map((stem, i) => ({
    key: i,
    stem,
    numeration: helpers.getNumeration(i, uiStyle.stemNumeration),
    ...getData(i),
  }))

  const fontSize = getFontSize(uiStyle.fontsize)

  const showHead = isTable || hasStemTitle || hasOptionRow

  return (
    <StyledTable
      evaluated={evaluation && evaluation.length > 0}
      data-cy="matrixTable"
      fontSize={fontSize}
      horizontalLines={uiStyle.horizontalLines}
      columns={columns}
      dataSource={data}
      pagination={false}
      maxWidth={uiStyle.maxWidth}
      hasOptionRow={hasOptionRow}
      isTable={isTable}
      showHead={showHead}
    />
  )
}

Matrix.propTypes = {
  stems: PropTypes.array.isRequired,
  options: PropTypes.array.isRequired,
  response: PropTypes.object.isRequired,
  onCheck: PropTypes.func.isRequired,
  uiStyle: PropTypes.object,
  smallSize: PropTypes.bool,
  isMultiple: PropTypes.bool,
  evaluation: PropTypes.object,
}

Matrix.defaultProps = {
  isMultiple: false,
  evaluation: null,
  smallSize: false,
  uiStyle: {},
}

export default Matrix

const MathSpan = WithMathFormula(styled.div`
  min-height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
`)
