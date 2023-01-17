/* global Desmos, GGBApplet */
import React, { useRef, useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { Rnd } from 'react-rnd'
import { connect } from 'react-redux'
import { WithResources, getDesmosConfig, getStateName } from '@edulastic/common'
import { IconClose } from '@edulastic/icons'
import { white, boxShadowDefault } from '@edulastic/colors'
import { test as testContants } from '@edulastic/constants'
import { Spin } from 'antd'
import BasicCalculator from './BasicCalculator'
import EduScientificCalculator from './EduScientificCalculator'
import CalculatorTitle from './components/CalculatorTitle'
import AppConfig from '../../../../../app-config'
import { getCurrentSchoolState } from '../../../../author/src/selectors/user'

const { calculatorTypes } = testContants

const desmosGraphingCalcTypes = [
  `${calculatorTypes.GRAPHING}_DESMOS`,
  `${calculatorTypes.GRAPHING_STATE}_DESMOS`,
]

export function getDefaultCalculatorProvider(type) {
  if (type === 'SCIENTIFIC') {
    return 'DESMOS'
  }
  return 'EDULASTIC'
}

const defaultRndPros = {
  geogebraCalculator: { x: 0, y: 0, width: 800, height: 635 },
  basicCalculator: { x: 0, y: 0, width: 350, height: 355 },
  graphingDesmos: { x: 0, y: 0, width: 600, height: 400 },
  basicDesmos: { x: 0, y: 0, width: 350, height: 500 },
  desmosScientific: { x: 0, y: 0, width: 600, height: 500 },
  edulasticScientific: { x: 0, y: 0, width: 500, height: 370 },
}

const geogebraParams = {
  graphing: {
    id: 'ggbAppletGraphing',
    appName: 'graphing',
    width: 800,
    height: 600,
    showToolBar: true,
    borderColor: null,
    showMenuBar: true,
    allowStyleBar: true,
    showAlgebraInput: true,
    enableLabelDrags: false,
    enableShiftDragZoom: true,
    capturingThreshold: null,
    showToolBarHelp: false,
    errorDialogsActive: true,
    showTutorialLink: true,
    showLogging: true,
    useBrowserForJS: false,
  },
  scientific: {
    id: 'ggbAppletScientific',
    appName: 'scientific',
    width: 800,
    height: 600,
    showToolBar: true,
    borderColor: null,
    showMenuBar: true,
    allowStyleBar: true,
    showAlgebraInput: true,
    enableLabelDrags: false,
    enableShiftDragZoom: true,
    capturingThreshold: null,
    showToolBarHelp: false,
    errorDialogsActive: true,
    showTutorialLink: true,
    showLogging: true,
    useBrowserForJS: false,
  },
}

const CalculatorContainer = ({ calculateMode, changeTool, schoolState }) => {
  const handleCloseCalculator = () => {
    changeTool(0)
  }

  const desmosGraphingRef = useRef()
  const desmosBasicRef = useRef()
  const desmosScientificRef = useRef()
  const [graphingTitle, setGraphingTitle] = useState(
    'Desmos Graphing Calculator'
  )

  useEffect(() => {
    if (
      desmosGraphingRef.current &&
      desmosGraphingCalcTypes.includes(calculateMode)
    ) {
      const config = getDesmosConfig(schoolState, calculateMode)
      const stateName = getStateName(schoolState)
      const desmosGraphCalculator = Desmos.GraphingCalculator(
        desmosGraphingRef.current,
        config
      )
      desmosGraphCalculator.setExpression({ dragMode: Desmos.DragModes.XY })
      if (
        stateName &&
        calculateMode === `${calculatorTypes.GRAPHING_STATE}_DESMOS`
      ) {
        setGraphingTitle(`${graphingTitle} | ${stateName}`)
      }
    }

    if (desmosBasicRef.current && calculateMode === 'BASIC_DESMOS') {
      Desmos.FourFunctionCalculator(desmosBasicRef.current)
    }

    if (desmosScientificRef.current && calculateMode === 'SCIENTIFIC_DESMOS') {
      Desmos.ScientificCalculator(desmosScientificRef.current, {
        degreeMode: true,
      })
    }

    if (calculateMode === 'GRAPHING_GEOGEBRASCIENTIFIC') {
      const geogebraGraphing = new GGBApplet(
        geogebraParams.graphing,
        '5.0',
        'geogebra-graphingculator'
      )
      geogebraGraphing.inject('geogebra-graphingculator')
    }

    if (calculateMode === 'SCIENTIFIC_GEOGEBRASCIENTIFIC') {
      const geogebraScientific = new GGBApplet(
        geogebraParams.scientific,
        '5.0',
        'geogebra-scientificcalculator'
      )
      geogebraScientific.inject('geogebra-scientificcalculator')
    }
  }, [calculateMode, schoolState])

  return (
    <Container>
      {desmosGraphingCalcTypes.includes(calculateMode) && (
        <RndWrapper
          default={defaultRndPros.graphingDesmos}
          dragHandleClassName="calculator-drag-handler"
        >
          <div className="calculator-drag-handler">
            <CloseIcon color={white} onClick={handleCloseCalculator} />
            <Title data-cy="GRAPHING">{graphingTitle}</Title>
          </div>
          <Calculator id="demos-graphiccalculator" ref={desmosGraphingRef} />
        </RndWrapper>
      )}

      {calculateMode === 'BASIC_DESMOS' && (
        <RndWrapper
          default={defaultRndPros.basicDesmos}
          dragHandleClassName="calculator-drag-handler"
        >
          <div className="calculator-drag-handler">
            <CloseIcon color={white} onClick={handleCloseCalculator} />
            <Title data-cy="BASIC">Basic Calculator</Title>
          </div>
          <Calculator id="demos-basiccalculator" ref={desmosBasicRef} />
        </RndWrapper>
      )}

      {calculateMode === 'SCIENTIFIC_DESMOS' && (
        <RndWrapper
          default={defaultRndPros.desmosScientific}
          dragHandleClassName="calculator-drag-handler"
        >
          <div className="calculator-drag-handler">
            <CloseIcon color={white} onClick={handleCloseCalculator} />
            <Title data-cy="SCIENTIFIC">Scientific Calculator</Title>
          </div>
          <Calculator
            id="demos-scientific-calculator"
            ref={desmosScientificRef}
          />
        </RndWrapper>
      )}

      {calculateMode === 'SCIENTIFIC_EDULASTIC' && (
        <RndWrapper
          default={defaultRndPros.edulasticScientific}
          dragHandleClassName="calculator-drag-handler"
        >
          <CalculatorTitle
            onClose={handleCloseCalculator}
            title="Scientific Calculator"
          />
          <EduScientificCalculator />
        </RndWrapper>
      )}

      {calculateMode === 'BASIC_EDULASTIC' && (
        <RndWrapper
          default={defaultRndPros.basicCalculator}
          minWidth={defaultRndPros.basicCalculator.width}
          minHeight={defaultRndPros.basicCalculator.height}
          dragHandleClassName="calculator-drag-handler"
        >
          <div className="calculator-drag-handler">
            <CloseIcon color={white} onClick={handleCloseCalculator} />
            <Title data-cy="BASIC">Basic Calculator</Title>
          </div>
          <BasicCalculator id="edulastic-basiccalculator" />
        </RndWrapper>
      )}

      {calculateMode === 'GRAPHING_GEOGEBRASCIENTIFIC' && (
        <RndWrapper
          default={defaultRndPros.geogebraCalculator}
          dragHandleClassName="calculator-drag-handler"
        >
          <div className="calculator-drag-handler">
            <CloseIcon color={white} onClick={handleCloseCalculator} />
            <Title data-cy="GRAPHING">Graphing Calculator</Title>
          </div>
          <Calculator id="geogebra-graphingculator" />
        </RndWrapper>
      )}

      {calculateMode === 'SCIENTIFIC_GEOGEBRASCIENTIFIC' && (
        <RndWrapper
          default={defaultRndPros.geogebraCalculator}
          dragHandleClassName="calculator-drag-handler"
        >
          <div className="calculator-drag-handler">
            <CloseIcon color={white} onClick={handleCloseCalculator} />
            <Title data-cy="SCIENTIFIC">Scientific Calculator</Title>
          </div>
          <Calculator id="geogebra-scientificcalculator" />
        </RndWrapper>
      )}
    </Container>
  )
}

CalculatorContainer.propTypes = {
  calculateMode: PropTypes.string.isRequired,
  changeTool: PropTypes.func.isRequired,
}

const EnhancedCalculator = connect((state) => ({
  schoolState: getCurrentSchoolState(state),
}))(CalculatorContainer)

const Container = styled.div`
  position: absolute;
  /* froala editor z-index is 997 or 996
   * @see: https://snapwiz.atlassian.net/browse/EV-19515
   */
  z-index: 1000;
  left: 50%;
  top: 80px;
`

const RndWrapper = styled(Rnd)`
  box-shadow: ${boxShadowDefault};
`

const Calculator = styled.div`
  width: 100%;
  height: calc(100% - 35px);
`

const Title = styled.div`
  width: 100%;
  height: 35px;
  background: #0288d1;
  color: #ffffff;
  font-size: 16px;
  line-height: 35px;
  padding: 0 12px;
  font-weight: 600;
  text-align: left;
  cursor: move;
`

const CloseIcon = styled(IconClose)`
  width: 30px;
  float: right;
  cursor: pointer;
  margin-top: 10px;
`

const CalculatorContainerWithResources = (props) => (
  <WithResources
    resources={[
      `${AppConfig.desmosPath}/calculator.js`,
      `${AppConfig.geoGebraPath}/deployggb.js`,
      AppConfig.jqueryPath,
      `${AppConfig.eduScientificCalcPath}/CalcSS3.js`,
      `${AppConfig.eduScientificCalcPath}/CalcSS3.css`,
    ]}
    fallBack={<Spin />}
  >
    <EnhancedCalculator {...props} />
  </WithResources>
)

export default CalculatorContainerWithResources
