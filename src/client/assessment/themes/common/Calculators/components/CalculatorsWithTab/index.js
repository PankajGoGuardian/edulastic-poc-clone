import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { EduIf, Tabs } from '@edulastic/common'

import { getCurrentSchoolState } from '../../../../../../author/src/selectors/user'
import {
  getCurrentCalculatorTypeSelector,
  updateTestPlayerAction,
} from '../../../../../../author/sharedDucks/testPlayer'
import { CalculatorTitle } from '../CalculatorTitle'
import { useCalcMode } from '../../hooks/useCalcMode'
import { useRndParams } from '../../hooks/useRndParams'
import { CalcContainer, RndWrapper } from './styled-components'

const tabStyle = { margin: 0 }

const renderTabs = ({ currentCalc, calcOptions, setCurrentCalc }) => {
  return (
    <Tabs value={currentCalc} onChange={setCurrentCalc} mb="0px">
      {calcOptions.map((calcOption) => (
        <Tabs.Tab
          key={calcOption.calcMode}
          label={calcOption.calcTabLabel}
          style={tabStyle}
        />
      ))}
    </Tabs>
  )
}

const CalculatorsWithTab = ({
  changeTool,
  calcProvider,
  calcTypes,
  schoolState,
  currentCalculatorType,
  updateTestPlayer,
}) => {
  const {
    calcOptions,
    calculatorIndexByCalcMode: currentCalc,
    handleChangeCurrentCalculatorType,
  } = useCalcMode({
    calcTypes,
    calcProvider,
    schoolState,
    currentCalculatorType,
    updateTestPlayer,
  })
  const { calcMode, comp: CalcComponent, calcTitle, calcId } = calcOptions[
    currentCalc
  ]
  const params = useRndParams(calcMode)

  return (
    <CalcContainer hasOnlySingleCalculator={calcOptions.length <= 1}>
      <RndWrapper
        default={params}
        minWidth={params.width}
        minHeight={params.height}
        dragHandleClassName="calculator-drag-handler"
      >
        <CalculatorTitle
          onClose={changeTool}
          title={calcTitle}
          calcId={calcId}
        />
        <EduIf condition={calcOptions.length > 1}>
          {renderTabs({
            currentCalc,
            calcOptions,
            setCurrentCalc: handleChangeCurrentCalculatorType,
          })}
        </EduIf>
        <Tabs.TabContainer className="calculator-tab-container" padding="0px">
          <CalcComponent calcMode={calcMode} schoolState={schoolState} />
        </Tabs.TabContainer>
      </RndWrapper>
    </CalcContainer>
  )
}

CalculatorsWithTab.propTypes = {
  calcProvider: PropTypes.string.isRequired,
  calcTypes: PropTypes.arrayOf(PropTypes.string).isRequired,
  changeTool: PropTypes.func.isRequired,
  schoolState: PropTypes.string.isRequired,
}

export default connect(
  (state) => ({
    schoolState: getCurrentSchoolState(state),
    currentCalculatorType: getCurrentCalculatorTypeSelector(state),
  }),
  {
    updateTestPlayer: updateTestPlayerAction,
  }
)(CalculatorsWithTab)
