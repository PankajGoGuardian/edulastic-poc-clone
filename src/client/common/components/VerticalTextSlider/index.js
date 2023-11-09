import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types'

import {
  StyledVerticalTextSliderWrapper,
  StyledSliderContainer,
  StyledSliderItem,
} from './styled-components'

const VerticalTextSlider = ({ texts, textChangeInterval }) => {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [hideLastElement, setHideLastElement] = useState(true)
  const distanceBetweenTexts = 60

  useEffect(() => {
    const intervalId = setInterval(() => {
      setCurrentIndex((prevIndex) => {
        if (prevIndex + 1 > texts.length - 1) {
          return 0
        }
        return prevIndex + 1
      })
      setHideLastElement(false)
    }, textChangeInterval * 1000)
    return () => clearInterval(intervalId)
  }, [texts])

  const determinePlacement = (itemIndex) => {
    if (currentIndex === itemIndex) return 0
    if (currentIndex === 0 && hideLastElement) {
      return distanceBetweenTexts * 3
    }

    const previousIndex =
      currentIndex === 0 ? texts.length - 1 : currentIndex - 1
    const nextIndex = currentIndex === texts.length - 1 ? 0 : currentIndex + 1

    if (itemIndex === previousIndex) {
      return -distanceBetweenTexts
    }

    if (itemIndex === nextIndex) {
      return distanceBetweenTexts
    }

    if (
      itemIndex === (previousIndex === 0 ? texts.length - 1 : previousIndex - 1)
    ) {
      return -(distanceBetweenTexts * 2)
    }

    if (itemIndex === (nextIndex === texts.length - 1 ? 0 : nextIndex + 1)) {
      return distanceBetweenTexts * 2
    }

    return distanceBetweenTexts * 3
  }

  const getStyles = (index) => {
    const styles = { opacity: 1 }
    if (currentIndex === index) {
      return styles
    }
    return {
      transform: `translate(0px, ${determinePlacement(index)}px) scale(${
        Math.abs(determinePlacement(index)) <= distanceBetweenTexts ? 0.7 : 1
      })`,
      opacity:
        Math.abs(determinePlacement(index)) <= distanceBetweenTexts ? 0.3 : 0,
    }
  }

  return (
    <StyledVerticalTextSliderWrapper>
      <StyledSliderContainer>
        {texts.map((text, index) => {
          return (
            <StyledSliderItem style={getStyles(index)} key={index}>
              {text}
            </StyledSliderItem>
          )
        })}
      </StyledSliderContainer>
    </StyledVerticalTextSliderWrapper>
  )
}

VerticalTextSlider.propTypes = {
  texts: PropTypes.array.isRequired,
  textChangeInterval: PropTypes.number,
}

VerticalTextSlider.defaultProps = {
  textChangeInterval: 5,
}

export default VerticalTextSlider
