import React, { Component } from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import produce from 'immer'
import { isEqual } from 'lodash'

import { withNamespaces } from '@edulastic/localization'
import { graphEvaluateApi } from '@edulastic/api'
import {
  MathModal,
  MathInput,
  EduButton,
  notification,
} from '@edulastic/common'
import { IconClose } from '@edulastic/icons'
import { math, defaultSymbols } from '@edulastic/constants'
import { backgrounds, greyThemeDark2 } from '@edulastic/colors'

import { CONSTANT } from '../../../Builder/config/index'
import { IconKeyboard } from '../styled/IconKeyboard'

const { defaultNumberPad } = math

const emptyEquation = {
  _type: 98,
  type: CONSTANT.TOOLS.EQUATION,
  label: false,
  pointsLabel: false,
}

const getApiLatex = (latex) => {
  return graphEvaluateApi
    .convert({ latex })
    .then(({ result }) => result[0])
    .catch(() => {
      notification({ messageKey: 'equationErr' })
    })
}
class Equations extends Component {
  constructor(props) {
    super(props)

    this.state = {
      showMathModal: false,
      selectedIndex: -1,
      selectedInput: '',
      eqs: props.equations.map((e) => e.latex),
      changedEqs: props.equations.map(() => false),
      domains: props.equations.map((e) => e.domain),
      changedDomains: props.equations.map(() => false),
      newEquation: '',
      newDomain: '',
    }
  }

  componentDidUpdate(prevProps) {
    const { equations } = this.props

    if (!isEqual(equations, prevProps.equations)) {
      this.updateState()
    }
  }

  updateState = () => {
    const { equations } = this.props

    this.setState({
      eqs: equations.map((e) => e.latex),
      changedEqs: equations.map(() => false),
      domains: equations.map((e) => e.domain),
      changedDomains: equations.map(() => false),
    })
  }

  setApiLatices = async (equLatex, domainLatex, index = null) => {
    const { equations, setEquations } = this.props
    if (!equLatex) {
      return
    }

    const promise = [equLatex, domainLatex]
      .filter((x) => x)
      .map((latex) => getApiLatex(latex))

    Promise.all(promise).then((results) => {
      if (index === null) {
        setEquations(
          produce(equations, (draft) => {
            draft.push({
              ...emptyEquation,
              id: `jxgEq-${Math.random().toString(36).substr(2, 9)}`,
              latex: equLatex,
              apiLatex: results[0],
              domain: domainLatex,
              domainApiLatex: results[1] || '',
            })
          })
        )
      }
      if (equations[index]) {
        setEquations(
          produce(equations, (draft) => {
            draft[index].latex = equLatex
            draft[index].apiLatex = results[0]
            draft[index].domain = domainLatex
            draft[index].domainApiLatex = results[1] || ''
          })
        )
      }
    })
  }

  handleAddEquation = () => {
    const {
      eqs,
      changedEqs,
      domains,
      changedDomains,
      newEquation,
      newDomain,
    } = this.state
    let shouldUpdateState = false
    if (newEquation) {
      shouldUpdateState = true
      eqs.push(newEquation)
      changedEqs.push(false)
    }

    if (newDomain) {
      shouldUpdateState = true
      domains.push(newDomain)
      changedDomains.push(false)
    }

    if (shouldUpdateState) {
      this.setState({
        eqs,
        changedEqs,
        newEquation: '',
        domains,
        changedDomains,
        newDomain: '',
      })
      this.setApiLatices(newEquation, newDomain)
    }
  }

  handleDeleteEquation = (index) => () => {
    const { equations, setEquations } = this.props
    setEquations(
      produce(equations, (draft) => {
        draft.splice(index, 1)
      })
    )
    this.setState({ selectedIndex: -1 })
  }

  toggleMathModal = (open, index = -1) => () => {
    this.setState({ showMathModal: open, selectedIndex: index })
  }

  handleFocus = (index = -1) => {
    this.setState({ selectedIndex: index })
  }

  handleMathInputFocus = (wh, indx) => (vaild) => {
    if (vaild) {
      this.setState({ selectedInput: wh, selectedIndex: indx })
    }
  }

  handleInputEquation = (latex, index = null) => {
    const { eqs, changedEqs } = this.state

    if (index === null) {
      this.setState({ newEquation: latex })
    } else {
      eqs[index] = latex
      changedEqs[index] = true
      this.setState({ eqs, changedEqs })
    }
  }

  handleInputDomain = (latex, index = null) => {
    const { domains, changedDomains } = this.state
    if (index === null) {
      this.setState({ newDomain: latex })
    } else {
      domains[index] = latex
      changedDomains[index] = true
    }
  }

  handleModalSave = (latex) => {
    const {
      eqs,
      domains,
      selectedInput,
      selectedIndex,
      newDomain,
      newEquation,
    } = this.state
    this.toggleMathModal(false)()
    let equLatex = selectedIndex === -1 ? newEquation : eqs[selectedIndex]
    let domainLatex = selectedIndex === -1 ? newDomain : domains[selectedIndex]
    if (selectedInput === 'domain') {
      domainLatex = latex
    } else {
      equLatex = latex
    }
    if (equLatex && domainLatex) {
      this.setState({ newDomain: '', newEquation: '' })
      this.setApiLatices(
        equLatex,
        domainLatex,
        selectedIndex === -1 ? null : selectedIndex
      )
      return
    }

    if (selectedInput === 'domain') {
      if (selectedIndex === -1) {
        this.setState({ newDomain: latex })
      } else {
        domains[selectedIndex] = latex
        this.setState({ domains })
      }
    } else if (selectedIndex === -1) {
      this.setState({ newEquation: latex })
    } else {
      eqs[selectedIndex] = latex
      this.setState({ eqs })
    }
  }

  saveEquation = (index) => () => {
    const { eqs, domains, changedEqs } = this.state
    changedEqs[index] = false
    this.setState({ changedEqs })
    this.setApiLatices(eqs[index], domains[index], index)
  }

  render() {
    const { t, onChangeKeypad, symbols } = this.props
    const {
      showMathModal,
      selectedIndex,
      eqs,
      domains,
      changedEqs,
      newEquation,
      newDomain,
      selectedInput,
    } = this.state

    return (
      <Container>
        {eqs.map((eq, index) => (
          <Wrapper
            key={`equation-wrapper-${index}`}
            onFocus={() => this.handleFocus(index)}
          >
            <EquationInput
              fullWidth
              resetMath
              alwaysHideKeyboard
              symbols={symbols}
              numberPad={defaultNumberPad}
              value={eq}
              onFocus={this.handleMathInputFocus('equation', index)}
              onInput={(latex) => this.handleInputEquation(latex, index)}
            />
            <DomainInput
              fullWidth
              resetMath
              alwaysHideKeyboard
              symbols={symbols}
              value={domains[index]}
              numberPad={defaultNumberPad}
              onFocus={this.handleMathInputFocus('domain', index)}
              onInput={(latex) => this.handleInputDomain(latex, index)}
            />
            {selectedIndex === index && (
              <IconKeyboard
                width={25}
                height={20}
                color={greyThemeDark2}
                key={`eq-math-${index}`}
                onClick={this.toggleMathModal(true, index)}
              />
            )}
            {(selectedIndex === index || changedEqs[index]) && (
              <StyledEduButton
                key={`eq-plot-${index}`}
                onClick={this.saveEquation(index)}
              >
                {t('component.graphing.settingsPopup.plot')}
              </StyledEduButton>
            )}
            <IconClose
              key={`eq-del-${index}`}
              color={greyThemeDark2}
              onClick={this.handleDeleteEquation(index)}
            />
          </Wrapper>
        ))}
        <Wrapper key="equation-wrapper-add" onFocus={() => this.handleFocus()}>
          <EquationInput
            fullWidth
            resetMath
            alwaysHideKeyboard
            symbols={symbols}
            numberPad={defaultNumberPad}
            value={newEquation}
            onFocus={this.handleMathInputFocus('equation')}
            onInput={(latex) => this.handleInputEquation(latex)}
          />
          <DomainInput
            fullWidth
            resetMath
            alwaysHideKeyboard
            symbols={symbols}
            value={newDomain}
            numberPad={defaultNumberPad}
            onFocus={this.handleMathInputFocus('domain')}
            onInput={(latex) => this.handleInputDomain(latex)}
          />
          <IconKeyboard
            key="eq-math-add"
            width={25}
            height={20}
            color={greyThemeDark2}
            onClick={this.toggleMathModal(true)}
          />
          <StyledEduButton key="eq-add" onClick={this.handleAddEquation}>
            {t('component.graphing.settingsPopup.plot')}
          </StyledEduButton>
        </Wrapper>
        <MathModal
          show={showMathModal}
          symbols={symbols}
          numberPad={defaultNumberPad}
          showDropdown
          showResposnse={false}
          width="max-content"
          value={
            selectedInput === 'domain'
              ? selectedIndex !== -1
                ? domains[selectedIndex]
                : newDomain
              : selectedIndex !== -1
              ? eqs[selectedIndex]
              : newEquation
          }
          onSave={(latex) => this.handleModalSave(latex)}
          onClose={this.toggleMathModal(false)}
          onChangeKeypad={onChangeKeypad}
        />
      </Container>
    )
  }
}

Equations.propTypes = {
  t: PropTypes.func.isRequired,
  setEquations: PropTypes.func.isRequired,
  equations: PropTypes.array.isRequired,
  onChangeKeypad: PropTypes.func,
  symbols: PropTypes.array,
}

Equations.defaultProps = {
  onChangeKeypad: () => {},
  symbols: defaultSymbols,
}
export default withNamespaces('assessment')(Equations)

const Container = styled.div`
  padding: 12px 17px;
  > div {
    margin-bottom: 7px;
  }
  div:last-child {
    margin-bottom: 0px;
  }
`

const Wrapper = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: flex-start;
  align-content: stretch;
  > svg {
    margin-left: 12px;
    cursor: pointer;
  }
`

const EquationInput = styled(MathInput)`
  min-width: 120px;
  background: ${backgrounds.primary};
  width: 75%;
  .input__math {
    border-radius: 3px;
  }
`

const DomainInput = styled(MathInput)`
  min-width: 80px;
  background: ${backgrounds.primary};
  width: 25%;
  margin-left: 8px;

  .input__math {
    border-radius: 3px;
  }
`

const StyledEduButton = styled(EduButton)`
  padding: 0px;
  margin-left: 12px !important;
  max-height: 16px;
  border: unset;
  background-color: ${greyThemeDark2} !important;
`
