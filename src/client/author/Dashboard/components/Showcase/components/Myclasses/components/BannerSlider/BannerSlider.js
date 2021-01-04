import React, { useRef } from 'react'
import { debounce } from 'lodash'

// components
import { white } from '@edulastic/colors'
import { IconChevronLeft } from '@edulastic/icons'
import PerfectScrollbar from 'react-perfect-scrollbar'
import {
  ScrollbarContainer,
  Slides,
  PrevButton,
  NextButton,
  SliderContainer,
  LearnMore,
  SlideContainer,
  SlideDescription,
} from './styled'

import EmbeddedVideoPreviewModal from '../../../../../../../CurriculumSequence/components/ManageContentBlock/components/EmbeddedVideoPreviewModal'

const BannerSlider = ({
  bannerSlides,
  bannerActionHandler,
  handleBannerModalClose,
  isBannerModalVisible,
}) => {
  const scrollBarRef = useRef(null)

  const handleScroll = debounce((isScrollLeft) => {
    const scrollContainer = scrollBarRef.current._container
    const { scrollLeft, clientWidth } = scrollContainer
    const delta = isScrollLeft
      ? scrollLeft + clientWidth
      : scrollLeft - scrollLeft
    scrollContainer.scrollTo({
      left: delta,
      behavior: 'smooth',
    })
  }, 300)

  const bannerLength = bannerSlides.length

  return (
    <>
      <SliderContainer>
        <PrevButton className="prev" onClick={() => handleScroll(false)}>
          <IconChevronLeft color={white} width="32px" height="32px" />
        </PrevButton>
        <NextButton className="next" onClick={() => handleScroll(true)}>
          <IconChevronLeft color={white} width="32px" height="32px" />
        </NextButton>
        <ScrollbarContainer>
          <PerfectScrollbar
            ref={scrollBarRef}
            option={{
              suppressScrollY: true,
              useBothWheelAxes: true,
            }}
          >
            <SlideContainer>
              {bannerSlides.map((slide, index) => (
                <Slides
                  className={bannerLength === index + 1 ? 'last' : ''}
                  bgImage={slide.imageUrl}
                  key={slide._id}
                  onClick={() =>
                    bannerActionHandler(
                      slide.config.filters[0],
                      slide.description
                    )
                  }
                >
                  <LearnMore>LEARN MORE</LearnMore>
                  <SlideDescription>{slide.description}</SlideDescription>
                </Slides>
              ))}
            </SlideContainer>
          </PerfectScrollbar>
        </ScrollbarContainer>
      </SliderContainer>
      {isBannerModalVisible && (
        <EmbeddedVideoPreviewModal
          closeCallback={handleBannerModalClose}
          isVisible={isBannerModalVisible}
        />
      )}
    </>
  )
}

export default BannerSlider
