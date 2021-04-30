import React, { useRef } from 'react'
import { debounce } from 'lodash'
import { IconChevronLeft } from '@edulastic/icons'
import PerfectScrollbar from 'react-perfect-scrollbar'
import { greyishBorder } from '@edulastic/colors'
import {
  ScrollbarContainer,
  Slides,
  PrevButton,
  NextButton,
  SliderContainer,
  SlideContainer,
  SlideWrapper,
} from '../styled'

const AttachmentSlider = ({
  setCurrentAttachmentIndex,
  currentAttachmentIndex,
  attachmentsList,
}) => {
  const scrollBarRef = useRef(null)

  const handleScroll = debounce((isScrollLeft) => {
    const scrollContainer = scrollBarRef.current._container
    const { scrollLeft, clientWidth } = scrollContainer
    const delta = isScrollLeft
      ? scrollLeft + clientWidth
      : scrollLeft - clientWidth
    scrollContainer.scrollTo({
      left: delta,
      behavior: 'smooth',
    })
  }, 200)

  const slidesLength = attachmentsList.length

  const handleArrowClick = (isScrollLeft) => {
    handleScroll(isScrollLeft)
    if (isScrollLeft) {
      setCurrentAttachmentIndex(currentAttachmentIndex + 1)
    } else {
      setCurrentAttachmentIndex(currentAttachmentIndex - 1)
    }
  }

  return (
    <>
      {currentAttachmentIndex > 0 && (
        <PrevButton
          data-cy="prevAttachmentButton"
          className="prev"
          onClick={() => handleArrowClick(false)}
        >
          <IconChevronLeft color={greyishBorder} width="32px" height="32px" />
        </PrevButton>
      )}
      {currentAttachmentIndex < slidesLength - 1 && (
        <NextButton
          data-cy="nextAttachmentButton"
          className="next"
          onClick={() => handleArrowClick(true)}
        >
          <IconChevronLeft color={greyishBorder} width="32px" height="32px" />
        </NextButton>
      )}
      <SliderContainer>
        <ScrollbarContainer>
          <PerfectScrollbar
            ref={scrollBarRef}
            option={{
              suppressScrollY: true,
              useBothWheelAxes: true,
            }}
          >
            <SlideContainer data-cy="sliderContainer">
              {attachmentsList.map((slide, index) => {
                return (
                  <SlideWrapper>
                    <Slides
                      data-cy="banners"
                      className={slidesLength === index + 1 ? 'last' : ''}
                      bgImage={slide.source}
                      key={slide._id}
                    />
                  </SlideWrapper>
                )
              })}
            </SlideContainer>
          </PerfectScrollbar>
        </ScrollbarContainer>
      </SliderContainer>
    </>
  )
}

export default AttachmentSlider
