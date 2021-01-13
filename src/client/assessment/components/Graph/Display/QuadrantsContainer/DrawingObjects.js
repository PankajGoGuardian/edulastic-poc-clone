import React, { Component } from 'react'
import { withNamespaces } from '@edulastic/localization'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import striptags from 'striptags'
import { cloneDeep, unescape } from 'lodash'
import {
  IconGraphRay as IconRay,
  IconGraphLine as IconLine,
  IconGraphPoint as IconPoint,
  IconGraphSine as IconSine,
  IconGraphParabola as IconParabola,
  IconGraphParabola2 as IconParabola2,
  IconGraphCircle as IconCircle,
  IconGraphVector as IconVector,
  IconGraphSegment as IconSegment,
  IconGraphPolygon as IconPolygon,
  IconGraphArea as IconArea,
} from '@edulastic/icons'
import { CustomStyleBtn } from '../../../../styled/ButtonStyles'
import { RadioLabel, RadioLabelGroup } from '../../../../styled/RadioWithLabel'
import { InnerTitle } from '../../../../styled/InnerTitle'
import utils from '../../common/utils'

class DrawingObjects extends Component {
  state = {
    isDashed: {},
  }

  getLabel = (drawingObject) => {
    const type = utils.capitalizeFirstLetter(
      drawingObject.type === 'parabola2' ? 'parabola' : drawingObject.type
    )
    const objLabel = striptags(drawingObject.label)
    if (objLabel) {
      return unescape(`${type} ${objLabel}`)
    }

    if (drawingObject.pointLabels) {
      const pointLabels = drawingObject.pointLabels
        .map((item) => striptags(item.label))
        .join('')
      if (pointLabels) {
        return unescape(`${type} ${pointLabels}`)
      }
    }

    return type
  }

  getIconByToolName = (toolName) => {
    if (!toolName) {
      return ''
    }

    const options = {
      width:
        toolName === 'point'
          ? 10
          : toolName === 'circle' || toolName === 'polygon'
          ? 15
          : 20,
      height: 20,
    }

    const iconsByToolName = {
      point: () => <IconPoint {...options} />,
      line: () => <IconLine {...options} />,
      ray: () => <IconRay {...options} />,
      segment: () => <IconSegment {...options} />,
      vector: () => <IconVector {...options} />,
      circle: () => <IconCircle {...options} />,
      ellipse: () => <IconLine {...options} />,
      hyperbola: () => <IconLine {...options} />,
      tangent: () => <IconLine {...options} />,
      secant: () => <IconLine {...options} />,
      exp: () => <IconLine {...options} />,
      logarithm: () => <IconLine {...options} />,
      polynom: () => <IconLine {...options} />,
      parabola: () => <IconParabola {...options} />,
      parabola2: () => <IconParabola2 {...options} />,
      sine: () => <IconSine {...options} />,
      polygon: () => <IconPolygon {...options} />,
      area: () => <IconArea {...options} />,
    }

    return iconsByToolName[toolName]()
  }

  setDrawingObj(drawingObj) {
    const { selectDrawingObject } = this.props
    selectDrawingObject(drawingObj)
  }

  handleClikDrawingObj = (drawingObject) => () => {
    let newDrawingObject = cloneDeep(drawingObject)
    const { includeDashed } = this.props
    if (newDrawingObject.disabled || newDrawingObject.selected) {
      return
    }
    const { isDashed } = this.state
    if (includeDashed) {
      newDrawingObject = {
        ...newDrawingObject,
        dashed: isDashed[drawingObject.id] === 'dashed',
      }
    }
    this.setDrawingObj(newDrawingObject)
  }

  handleChangeLineStyle = (drawingObject) => (e) => {
    const newDrawingObject = {
      ...drawingObject,
      dashed: e.target.value === 'dashed',
    }
    const { isDashed } = this.state
    this.setState(
      { isDashed: { ...isDashed, [drawingObject.id]: e.target.value } },
      () => {
        this.setDrawingObj(newDrawingObject)
      }
    )
  }

  drawArea = () => {
    const { selectedObj, selectDrawingObject } = this.props
    if (selectedObj) {
      selectDrawingObject(null)
    } else {
      selectDrawingObject({ type: 'area' })
    }
  }

  render() {
    const {
      drawingObjects,
      showSolutionSet,
      selectedObj,
      includeDashed,
      t,
    } = this.props
    const { isDashed } = this.state
    return (
      <Container>
        <InnerTitle innerText={t('component.graphing.clickToSelect')} />
        {drawingObjects.map((drawingObject, index) => (
          <Wrapper key={`drawing-object-${index}`}>
            <Button
              shadowColor={drawingObject.baseColor}
              onClick={this.handleClikDrawingObj(drawingObject)}
              disabled={drawingObject.disabled}
              className={
                drawingObject.disabled
                  ? 'disabled'
                  : drawingObject.selected
                  ? 'selected'
                  : ''
              }
            >
              {this.getIconByToolName(drawingObject.type)}
              {this.getLabel(drawingObject)}
            </Button>
            {includeDashed && (
              <RadioLabelGroup
                mt="4px"
                pl="12px"
                disabled={drawingObject.disabled}
                onChange={this.handleChangeLineStyle(drawingObject)}
                value={isDashed[drawingObject.id] || 'solid'}
              >
                <RadioLabel labelPadding="8px" value="solid">
                  <Line />
                </RadioLabel>
                <RadioLabel labelPadding="8px" value="dashed">
                  <Line type="dashed" />
                </RadioLabel>
              </RadioLabelGroup>
            )}
          </Wrapper>
        ))}
        {showSolutionSet && (
          <Button
            onClick={this.drawArea}
            disabled={selectedObj && selectedObj.type === 'area'}
          >
            {this.getIconByToolName('area')}
            {t('component.graphing.solutionSet')}
          </Button>
        )}
      </Container>
    )
  }
}

DrawingObjects.propTypes = {
  selectDrawingObject: PropTypes.func.isRequired,
  drawingObjects: PropTypes.array.isRequired,
  t: PropTypes.func.isRequired,
  includeDashed: PropTypes.bool,
  selectedObj: PropTypes.object,
}

DrawingObjects.defaultProps = {
  selectedObj: {},
  includeDashed: false,
}

export default withNamespaces('assessment')(DrawingObjects)

const Container = styled.div`
  display: flex;
  flex-direction: column;
  width: 150px;
  padding: 5px;
`

const Wrapper = styled.div`
  margin-bottom: 5px;
`

const Button = styled(CustomStyleBtn).attrs(() => ({
  width: '100%',
  height: 'auto',
  ghost: true,
  padding: '5px',
  justifyContent: 'flex-start',
}))`
  box-shadow: ${({ shadowColor }) =>
    `inset 0 0 1em ${shadowColor || '#434B5D'}`};

  & span {
    white-space: normal;
    text-align: left;
  }

  & svg {
    margin-left: 5px;
  }
`

const Line = styled.span`
  border-bottom: ${({ type }) => `2px ${type || 'solid'}`};
  display: inline-block;
  min-width: 40px;
  vertical-align: middle;
`
