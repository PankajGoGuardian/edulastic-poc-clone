import React, { useMemo } from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'

import { lightGrey1 } from '@edulastic/colors'
import { Subtitle } from '@edulastic/common'

const Container = styled.div`
  height: auto;
  flex: 1 1 30%;
  margin: ${({ margin }) => margin || '20px 0px'};
  padding: ${({ padding }) => padding || '22px 12px'};
  min-height: ${({ minHeight }) => minHeight || 200}px;
  background-color: ${({ noBackground }) => !noBackground && lightGrey1};
  max-width: ${({ maxWidth }) => maxWidth || null};
  min-width: ${({ minWidth }) => minWidth || '650px'};
  border: ${({ showBorder }) => showBorder && '1px solid #d6d6d6'};
  border-radius: 4px;

  width: 100%;
  img {
    ${({ imageStyle }) =>
      imageStyle
        ? `
        z-index: 1;
        position: relative;
      `
        : null}
    ${({ imageStyle }) => imageStyle}
  }
`

const ScoreBlock = styled.span`
  background-color: #f8f8f8;
  border: 1px solid #b9b9b9;
  padding: 8px 4px;
  width: 60px;
  display: inline-block;
  text-align: center;
  margin-left: 8px;
  border-radius: 2px;
`

const CorrectAnswersContainer = ({
  title,
  children,
  imageStyle,
  maxWidth,
  className,
  style = {},
  titleMargin,
  minWidth,
  minHeight,
  noBackground,
  showBorder,
  padding,
  margin,
  showAnswerScore,
  score,
}) => {
  const blockTitle = useMemo(() => {
    if (!showAnswerScore || !score) {
      return <Subtitle margin={titleMargin}>{title}</Subtitle>
    }
    return (
      <Subtitle margin={titleMargin}>
        {title} / Score<ScoreBlock>{score}</ScoreBlock>
      </Subtitle>
    )
  }, [showAnswerScore, title, score, titleMargin])

  return (
    <div className="__prevent-page-break">
      <Container
        className={`${className} __print_fit_content`}
        maxWidth={maxWidth}
        minWidth={minWidth}
        minHeight={minHeight}
        imageStyle={imageStyle}
        style={style}
        noBackground={noBackground}
        showBorder={showBorder}
        padding={padding}
        margin={margin}
      >
        {blockTitle}
        {children}
      </Container>
    </div>
  )
}

CorrectAnswersContainer.propTypes = {
  title: PropTypes.string.isRequired,
  children: PropTypes.any,
  imageStyle: PropTypes.object,
}

CorrectAnswersContainer.defaultProps = {
  children: null,
  imageStyle: {},
}

CorrectAnswersContainer.ScoreBlock = ScoreBlock

export default CorrectAnswersContainer
