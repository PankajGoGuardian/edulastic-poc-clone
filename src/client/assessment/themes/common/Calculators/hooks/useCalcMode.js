import { getStateName } from '@edulastic/common'
import { useEffect, useMemo } from 'react'
import { BasicDesmosCalculator } from '../components/BasicDesmosCalculator'
import { BasicEdulasticCalculator } from '../components/BasicEdulasticCalculator'
import { ScientificDesmosCalculator } from '../components/ScientificDesmosCalculator'
import { GraphingDesmosCalculator } from '../components/GraphingDesmosCalculator'
import { ScientificEdulasticCalculator } from '../components/ScientificEdulasticCalculator'
import { GraphingGeogebraCalculator } from '../components/GraphingGeogebraCalculator'
import { ScientificGeogebraCalculator } from '../components/ScientificGeogebraCalculator'
import {
  CALC_MAP,
  CALC_MODES,
  DESMOS_GRAPHING_CALC_TYPES,
  DESMOS_CALC_PROVIDER,
  EDU_CALC_PROVIDER,
  SCIENTIFIC_TYPE,
} from '../constants'

const getDefaultCalculatorProvider = (type) => {
  if (type === SCIENTIFIC_TYPE) {
    return DESMOS_CALC_PROVIDER
  }
  return EDU_CALC_PROVIDER
}

const getCalculatorComponent = (calcMode) => {
  switch (calcMode) {
    case CALC_MODES.BASIC_EDULASTIC:
      return BasicEdulasticCalculator
    case CALC_MODES.SCIENTIFIC_EDULASTIC:
      return ScientificEdulasticCalculator
    case CALC_MODES.GRAPHING_GEOGEBRASCIENTIFIC:
      return GraphingGeogebraCalculator
    case CALC_MODES.SCIENTIFIC_GEOGEBRASCIENTIFIC:
      return ScientificGeogebraCalculator
    case CALC_MODES.BASIC_DESMOS:
      return BasicDesmosCalculator
    case CALC_MODES.SCIENTIFIC_DESMOS:
      return ScientificDesmosCalculator
    case CALC_MODES.GRAPHING_DESMOS:
    case CALC_MODES.GRAPHING_STATE_DESMOS:
      return GraphingDesmosCalculator
    default:
      return () => null
  }
}

export const useCalcMode = ({
  calcTypes,
  calcProvider,
  schoolState,
  currentCalculatorType,
  updateTestPlayer,
}) => {
  const calcModes = useMemo(() => {
    return calcTypes.map((calcType) => {
      // graphing calculator is not present for EDULASTIC so defaulting to DESMOS for now,
      // below work around should be removed once EDULASTIC calculator is built
      const resolvedCalcProvider = DESMOS_GRAPHING_CALC_TYPES.includes(calcType)
        ? DESMOS_CALC_PROVIDER
        : calcProvider
      const defaultCalcProvider = getDefaultCalculatorProvider(calcType)
      const calcMode = `${calcType}_${
        resolvedCalcProvider || defaultCalcProvider
      }`

      const { text, id } = CALC_MAP[calcType]
      const stateName = getStateName(schoolState)
      let calcTitle = `${text} Calculator`
      if (stateName && calcMode === CALC_MODES.GRAPHING_STATE_DESMOS) {
        calcTitle = `Desmos ${calcTitle} | ${stateName}`
      } else if (calcMode === CALC_MODES.GRAPHING_DESMOS) {
        calcTitle = `Desmos ${calcTitle}`
      }

      return {
        calcTitle,
        calcMode,
        calcTabLabel: text,
        comp: getCalculatorComponent(calcMode),
        calcId: id,
      }
    })
  }, [])

  const calculatorIndexByCalcMode = useMemo(() => {
    const calculatorIndex = calcModes.findIndex(
      (allCalculators) => allCalculators?.calcMode === currentCalculatorType
    )
    return calculatorIndex === -1 ? 0 : calculatorIndex
  }, [currentCalculatorType])

  const handleChangeCurrentCalculatorType = (calculatorIndex) => {
    updateTestPlayer({
      currentCalculatorType: calcModes[calculatorIndex].calcMode,
    })
  }

  useEffect(() => {
    if (!currentCalculatorType) {
      updateTestPlayer({
        currentCalculatorType: calcModes[0].calcMode,
      })
    }
  }, [])

  return {
    calcOptions: calcModes,
    calculatorIndexByCalcMode,
    handleChangeCurrentCalculatorType,
  }
}
