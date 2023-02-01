import React, { useState } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { Tabs } from '@edulastic/common'

import { getCurrentSchoolState } from '../../../../../../author/src/selectors/user'
import { CalculatorTitle } from '../CalculatorTitle'
import { useCalcMode } from '../../hooks/useCalcMode'
import { useRndParams } from '../../hooks/useRndParams'
import { CalcContainer, RndWrapper } from './styled-components'

const tabStyle = { margin: 0 }

const CalculatorsWithTab = ({
  changeTool,
  calcProvider,
  calcTypes,
  schoolState,
}) => {
  const [currentCalc, setCurrentCalc] = useState(0)
  const [calcOptions] = useCalcMode(calcTypes, calcProvider, schoolState)
  const { calcMode, comp: CalcComponent } = calcOptions[currentCalc]
  const params = useRndParams(calcMode)

  return (
    <CalcContainer>
      <RndWrapper
        default={params}
        minWidth={params.width}
        minHeight={params.height}
        dragHandleClassName="calculator-drag-handler"
      >
        <CalculatorTitle
          onClose={changeTool}
          title={calcOptions[currentCalc].calcTitle}
        />
        <Tabs value={currentCalc} onChange={setCurrentCalc} mb="0px">
          {calcOptions.map((calcOption) => (
            <Tabs.Tab
              key={calcOption.calcMode}
              label={calcOption.calcTabLabel}
              style={tabStyle}
            />
          ))}
        </Tabs>
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

export default connect((state) => ({
  schoolState: getCurrentSchoolState(state),
}))(CalculatorsWithTab)
