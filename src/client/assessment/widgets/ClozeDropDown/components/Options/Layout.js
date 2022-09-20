import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { isEqual, clamp, differenceBy } from 'lodash'
import styled from 'styled-components'

import { Select } from '@edulastic/common'
import { withNamespaces } from '@edulastic/localization'
import { response as Dimensions } from '@edulastic/constants'

import { getFormattedAttrId } from '@edulastic/common/src/helpers'
import { CustomStyleBtn } from '../../../../styled/ButtonStyles'
import { Row } from '../../../../styled/WidgetOptions/Row'
import { Col } from '../../../../styled/WidgetOptions/Col'
import { Label } from '../../../../styled/WidgetOptions/Label'

import { Container } from './styled/Container'
import { Subtitle } from '../../../../styled/Subtitle'
import Question from '../../../../components/Question'
import { TextInputStyled } from '../../../../styled/InputStyles'

class Layout extends Component {
  state = {
    focused: null,
    input: 0,
  }

  globalHeight = React.createRef()

  handleInputChange = (e) => {
    this.setState({
      input: +e.target.value,
    })
  }

  handleBlurGlobalHeight = () => {
    const { onChange, uiStyle } = this.props
    const { minHeight, maxHeight } = Dimensions
    if (uiStyle.heightpx < minHeight || uiStyle.heightpx > maxHeight) {
      const height = clamp(uiStyle.heightpx, minHeight, maxHeight)
      onChange('uiStyle', {
        ...uiStyle,
        heightpx: parseInt(height, 10),
      })
    }
  }

  handleBlurIndividualHeight = (index) => {
    const { uiStyle, onChange } = this.props
    const { responsecontainerindividuals: resp } = uiStyle
    const { minHeight, maxHeight } = Dimensions
    let height = resp[index].heightpx
    if (height && (height < minHeight || height > maxHeight)) {
      height = clamp(height, minHeight, maxHeight)
      resp[index].heightpx = height
      onChange('uiStyle', {
        ...uiStyle,
        responsecontainerindividuals: resp,
      })
    }
  }

  render() {
    const {
      onChange,
      uiStyle,
      advancedAreOpen,
      t,
      fillSections,
      cleanSections,
      item,
    } = this.props

    const changeUiStyle = (prop, value) => {
      onChange('uiStyle', {
        ...uiStyle,
        [prop]: value,
      })
    }

    const changeIndividualUiStyle = (prop, value, index) => {
      const { responsecontainerindividuals } = uiStyle
      const _item = responsecontainerindividuals[index]
      _item[prop] = value
      responsecontainerindividuals[index] = _item
      onChange('uiStyle', {
        ...uiStyle,
        responsecontainerindividuals,
      })
    }

    const addIndividual = () => {
      const { responsecontainerindividuals } = uiStyle
      const { responseIDs } = this.props
      const diff = differenceBy(responseIDs, responsecontainerindividuals, 'id')
      const response = diff[0]
      if (response) {
        responsecontainerindividuals[response.index] = {
          id: response.id,
          index: response.index,
          widthpx: 0,
          heightpx: 0,
          placeholder: '',
        }
        onChange('uiStyle', {
          ...uiStyle,
          responsecontainerindividuals,
        })
      }
    }

    const removeIndividual = (index) => {
      const { responsecontainerindividuals } = uiStyle
      responsecontainerindividuals[index] = {}
      onChange('uiStyle', {
        ...uiStyle,
        responsecontainerindividuals,
      })
    }

    const calculateRightWidth = (value) => {
      const { minWidth, maxWidth } = Dimensions
      return clamp(value, minWidth, maxWidth)
    }

    const onWidthInputBlur = (index) => () => {
      const { input } = this.state
      if (index !== undefined) {
        changeIndividualUiStyle('widthpx', calculateRightWidth(input), index)
      } else {
        changeUiStyle('widthpx', calculateRightWidth(input))
      }

      this.setState({ input: 0, focused: null })
    }

    const getIndividualWidthInputValue = (
      responsecontainerindividual,
      index
    ) => {
      const { focused, input } = this.state
      return isEqual(this[`individualWidth${index}`], focused)
        ? input || 0
        : responsecontainerindividual.widthpx
    }

    const getMainWidthInputValue = () => {
      const { focused, input } = this.state
      return isEqual(this.widthInput, focused) ? input || 0 : uiStyle.widthpx
    }

    const onFocusHandler = (responsecontainerindividual, index) => () => {
      if (responsecontainerindividual !== undefined && index !== undefined) {
        this.setState({
          focused: this[`individualWidth${index}`],
          input: responsecontainerindividual.widthpx,
        })
      } else {
        this.setState({ focused: this.widthInput, input: uiStyle.widthpx })
      }
    }

    return (
      <Question
        section="advanced"
        label={t('component.options.display')}
        advancedAreOpen={advancedAreOpen}
        fillSections={fillSections}
        cleanSections={cleanSections}
      >
        <Subtitle
          id={getFormattedAttrId(
            `${item?.title}-${t('component.options.display')}`
          )}
        >
          {t('component.options.display')}
        </Subtitle>
        <Row gutter={24}>
          <Col md={12}>
            <Label>{t('component.options.fontSize')}</Label>
            <FieldWrapper>
              <Select
                getPopupContainer={(triggerNode) => triggerNode.parentNode}
                onChange={(fontsize) => changeUiStyle('fontsize', fontsize)}
                options={[
                  { value: 'small', label: t('component.options.small') },
                  { value: 'normal', label: t('component.options.normal') },
                  { value: 'large', label: t('component.options.large') },
                  { value: 'xlarge', label: t('component.options.extraLarge') },
                  { value: 'xxlarge', label: t('component.options.huge') },
                ]}
                value={uiStyle.fontsize}
              />
            </FieldWrapper>
          </Col>
          <Col md={12}>
            <Label>{t('component.options.stemNumerationReviewOnly')}</Label>
            <FieldWrapper>
              <Select
                getPopupContainer={(triggerNode) => triggerNode.parentNode}
                onChange={(val) => changeUiStyle('stemNumeration', val)}
                options={[
                  {
                    value: 'numerical',
                    label: t('component.options.numerical'),
                  },
                  {
                    value: 'uppercase',
                    label: t('component.options.uppercasealphabet'),
                  },
                  {
                    value: 'lowercase',
                    label: t('component.options.lowercasealphabet'),
                  },
                ]}
                value={uiStyle.stemNumeration}
              />
            </FieldWrapper>
          </Col>
        </Row>
        <Row marginTop={15}>
          <Col md={12}>
            <Label>{t('component.options.responsecontainerglobal')}</Label>
          </Col>
        </Row>
        <Row gutter={24}>
          <Col md={12}>
            <Label>{t('component.options.widthpx')}</Label>
            <TextInputStyled
              ref={(ref) => {
                this.widthInput = ref
              }}
              type="number"
              disabled={false}
              onFocus={onFocusHandler()}
              onBlur={onWidthInputBlur()}
              onChange={this.handleInputChange}
              value={getMainWidthInputValue()}
            />
          </Col>
          <Col md={12}>
            <Label>{t('component.options.heightpx')}</Label>
            <TextInputStyled
              type="number"
              ref={this.globalHeight}
              disabled={false}
              onBlur={this.handleBlurGlobalHeight}
              onChange={(e) => changeUiStyle('heightpx', +e.target.value)}
              value={uiStyle.heightpx}
            />
          </Col>
        </Row>
        <Row marginTop={15}>
          <Col md={12}>
            <Label>{t('component.options.responsecontainerindividuals')}</Label>
          </Col>
        </Row>
        {uiStyle.responsecontainerindividuals.map(
          (responsecontainerindividual) => {
            if (!responsecontainerindividual.id) {
              return null
            }
            const respIndex = responsecontainerindividual.index

            return (
              <Container key={responsecontainerindividual.id}>
                <Row>
                  <Col md={18}>
                    <Label>
                      {`${t('component.options.responsecontainerindividual')} ${
                        respIndex + 1
                      }`}
                    </Label>
                  </Col>
                  <Col md={6}>
                    <CustomStyleBtn
                      width="40px"
                      height="30px"
                      padding="0px"
                      margin="0px"
                      style={{ float: 'right' }}
                      onClick={() => removeIndividual(respIndex)}
                    >
                      X
                    </CustomStyleBtn>
                  </Col>
                </Row>
                <Row gutter={24}>
                  <Col md={12}>
                    <Label>{t('component.options.widthpx')}</Label>
                    <TextInputStyled
                      ref={(ref) => {
                        this[`individualWidth${respIndex}`] = ref
                      }}
                      type="number"
                      disabled={false}
                      onFocus={onFocusHandler(
                        responsecontainerindividual,
                        respIndex
                      )}
                      onBlur={onWidthInputBlur(respIndex)}
                      onChange={this.handleInputChange}
                      value={getIndividualWidthInputValue(
                        responsecontainerindividual,
                        respIndex
                      )}
                    />
                  </Col>
                  <Col md={12}>
                    <Label>{t('component.options.heightpx')}</Label>
                    <TextInputStyled
                      type="number"
                      disabled={false}
                      onBlur={() => this.handleBlurIndividualHeight(respIndex)}
                      onChange={(e) =>
                        changeIndividualUiStyle(
                          'heightpx',
                          +e.target.value,
                          respIndex
                        )
                      }
                      value={responsecontainerindividual.heightpx}
                    />
                  </Col>
                  <Col md={12}>
                    <Label>{t('component.options.defaultText')}</Label>
                    <TextInputStyled
                      disabled={false}
                      onChange={(e) =>
                        changeIndividualUiStyle(
                          'placeholder',
                          e.target.value,
                          respIndex
                        )
                      }
                      value={responsecontainerindividual.placeholder}
                    />
                  </Col>
                </Row>
              </Container>
            )
          }
        )}
        <Row>
          <Col md={12}>
            <CustomStyleBtn onClick={addIndividual}>
              {t('component.options.add')}
            </CustomStyleBtn>
          </Col>
        </Row>
      </Question>
    )
  }
}

Layout.propTypes = {
  onChange: PropTypes.func.isRequired,
  uiStyle: PropTypes.object,
  t: PropTypes.func.isRequired,
  fillSections: PropTypes.func,
  cleanSections: PropTypes.func,
  advancedAreOpen: PropTypes.bool,
  responseIDs: PropTypes.array,
}

Layout.defaultProps = {
  uiStyle: {
    responsecontainerposition: 'bottom',
    fontsize: 'normal',
    stemNumeration: '',
    widthpx: 0,
    heightpx: 0,
    placeholder: '',
    responsecontainerindividuals: [],
  },
  responseIDs: [],
  advancedAreOpen: false,
  fillSections: () => {},
  cleanSections: () => {},
}

export default React.memo(withNamespaces('assessment')(Layout))

const FieldWrapper = styled.div`
  & > div {
    min-width: 100%;
  }
`
