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
import EdulasticOverviewModel from '../EdulasticOverview/EdulasticOverviewModel'

const BannerSlider = ({
  bannerSlides,
  bannerActionHandler,
  handleBannerModalClose,
  isBannerModalVisible,
  handleSparkClick,
  accessibleItembankProductIds = [],
}) => {
  const scrollBarRef = useRef(null)

  const handleScroll = debounce((isScrollLeft) => {
    const scrollContainer = scrollBarRef.current._container
    const { scrollLeft, clientWidth } = scrollContainer
    const delta = isScrollLeft
      ? scrollLeft + clientWidth
      : scrollLeft - scrollLeft
    scrollContainer.scrollLeft = delta
    scrollContainer.scrollTo({
      left: delta,
      behavior: 'smooth',
    })
  }, 300)

  const bannerLength = bannerSlides.length

  const handleBannerClick = (config, description, isSparkBannerTile) => {
    if (isSparkBannerTile) {
      handleSparkClick(config.subscriptionData.productId)
      return
    }
    bannerActionHandler(config.filters[0], description)
  }

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
            <SlideContainer data-cy="sliderContainer">
              {bannerSlides.map((slide, index) => {
                const isSparkTile = slide.description
                  ?.toLowerCase()
                  ?.includes('spark')

                return (
                  <Slides
                    data-cy="banners"
                    className={bannerLength === index + 1 ? 'last' : ''}
                    bgImage={slide.imageUrl}
                    key={slide._id}
                    onClick={() =>
                      handleBannerClick(
                        slide.config,
                        slide.description,
                        isSparkTile
                      )
                    }
                  >
                    {isSparkTile ? (
                      !accessibleItembankProductIds?.includes(
                        slide.config?.subscriptionData?.productId
                      ) && (
                        <LearnMore data-cy="tryItFree">TRY IT FREE</LearnMore>
                      )
                    ) : (
                      <LearnMore data-cy="LearnMore">LEARN MORE</LearnMore>
                    )}
                    <SlideDescription data-cy={slide.description}>
                      {slide.description}
                    </SlideDescription>
                  </Slides>
                )
              })}
            </SlideContainer>
          </PerfectScrollbar>
        </ScrollbarContainer>
      </SliderContainer>
      {isBannerModalVisible && (
        <EdulasticOverviewModel
          handleBannerModalClose={handleBannerModalClose}
          isBannerModalVisible={isBannerModalVisible}
        />
      )}
    </>
  )
}

export default BannerSlider
