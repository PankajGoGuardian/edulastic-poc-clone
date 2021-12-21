import React, { useEffect, useRef, useState } from 'react'
import { debounce } from 'lodash'

// components
import { white } from '@edulastic/colors'
import { IconChevronLeft } from '@edulastic/icons'
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
  const [showArrow, setShowArrow] = useState(false)
  const scrollBarRef = useRef(null)

  useEffect(() => {
    const { clientWidth, scrollWidth } = scrollBarRef.current
    if (scrollWidth > clientWidth) {
      setShowArrow(true)
    } else {
      setShowArrow(false)
    }
  }, [])

  const handleScroll = debounce((isScrollLeft) => {
    const scrollContainer = scrollBarRef.current
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
        {showArrow && (
          <>
            <PrevButton className="prev" onClick={() => handleScroll(false)}>
              <IconChevronLeft color={white} width="32px" height="32px" />
            </PrevButton>
            <NextButton className="next" onClick={() => handleScroll(true)}>
              <IconChevronLeft color={white} width="32px" height="32px" />
            </NextButton>
          </>
        )}
        <ScrollbarContainer className="scrollbar-container" ref={scrollBarRef}>
          <SlideContainer data-cy="sliderContainer">
            {bannerSlides.map((slide, index) => {
              const isSparkTile = slide.description
                ?.toLowerCase()
                ?.includes('spark')

              const isCPMTile = slide.description
                ?.toLowerCase()
                ?.includes('cpm')

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
                      isSparkTile || isCPMTile
                    )
                  }
                >
                  {isSparkTile ? (
                    !accessibleItembankProductIds?.includes(
                      slide.config?.subscriptionData?.productId
                    ) && <LearnMore data-cy="tryItFree">TRY IT FREE</LearnMore>
                  ) : isCPMTile ? (
                    !accessibleItembankProductIds?.includes(
                      slide.config?.subscriptionData?.productId
                    ) && (
                      <LearnMore data-cy="tryItFree">
                        Start a Free Trial
                      </LearnMore>
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
