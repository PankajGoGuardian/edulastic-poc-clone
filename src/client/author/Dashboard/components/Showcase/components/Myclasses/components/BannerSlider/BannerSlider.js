import React, { useEffect, useRef, useState } from 'react'
import { debounce } from 'lodash'

// components
import { title, white } from '@edulastic/colors'
import { IconChevronLeft } from '@edulastic/icons'
import { segmentApi } from '@edulastic/api'
import { proxyDemoPlaygroundUser } from '../../../../../../../authUtils'
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
import { TextWrapper } from '../../../../../styledComponents'

const BannerSlider = ({
  bannerSlides,
  bannerActionHandler,
  handleBannerModalClose,
  isBannerModalVisible,
  handleSparkClick,
  accessibleItembankProductIds = [],
  setShowBannerModal,
  windowWidth,
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

  const handleBannerClick = (
    evt,
    config,
    description,
    isSparkBannerTile,
    isDemoPlaygroundTile,
    slide
  ) => {
    segmentApi.genericEventTrack('bannerClick', { _id: slide._id, description })
    if (isSparkBannerTile) {
      handleSparkClick(config.subscriptionData.productId)
      return
    }
    if (isDemoPlaygroundTile) {
      evt.stopPropagation()
      const elementClasses = evt.currentTarget.getAttribute('class')
      proxyDemoPlaygroundUser(elementClasses.indexOf('automation') > -1)
      return
    }
    bannerActionHandler(config.filters[0], description)
  }

  return (
    <>
      <TextWrapper
        data-cy="bannerTitle"
        fw="bold"
        size="16px"
        color={title}
        style={{ marginBottom: '1rem' }}
      >
        Quick Introduction to Edulastic
      </TextWrapper>
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

              const isDemoPlaygroundTile = slide.description
                ?.toLowerCase()
                ?.includes('playground')

              return (
                <Slides
                  data-cy="banners"
                  className={bannerLength === index + 1 ? 'last' : ''}
                  bgImage={slide.imageUrl}
                  key={slide._id}
                  onClick={(evt) =>
                    handleBannerClick(
                      evt,
                      slide.config,
                      slide.description,
                      isSparkTile || isCPMTile,
                      isDemoPlaygroundTile,
                      slide
                    )
                  }
                >
                  <SlideDescription data-cy={slide.description}>
                    {slide.description}
                  </SlideDescription>
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
                  ) : isDemoPlaygroundTile ? (
                    <LearnMore data-cy="explore">Explore</LearnMore>
                  ) : (
                    <LearnMore data-cy="LearnMore">LEARN MORE</LearnMore>
                  )}
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
          setShowBannerModal={setShowBannerModal}
          windowWidth={windowWidth}
        />
      )}
    </>
  )
}

export default BannerSlider
