import React, { useEffect, useRef, useState } from 'react'
import { debounce } from 'lodash'

// components
import { white } from '@edulastic/colors'
import { IconChevronLeft } from '@edulastic/icons'
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

const BannerSlider = ({
  bannerSlides,
  bannerActionHandler,
  handleBannerModalClose,
  isBannerModalVisible,
  handleSparkClick,
  accessibleItembankProductIds = [],
  isSignupCompleted,
  setShowBannerModal,
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
    isDemoPlaygroundTile
  ) => {
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

  const startupBannerTiles = [
    {
      config: {
        filters: [
          {
            action: '0',
            data: {
              title: 'Quick Start Guide',
              url: 'https://youtu.be/5UENLg2_Nw4',
              contentType: 'tests',
            },
          },
        ],
        order: 1,
      },
      tags: ['FREE'],
      states: [],
      imageUrl:
        'https://cdn.edulastic.com/default/dashboard-assets/get-started.png',
      type: 'BANNER',
      description: '2 Min Overview',
      _id: '6135d26f002c7b4720011111',
    },
    {
      config: {
        filters: [
          {
            action: '2',
            data: {
              title: 'Get Started Video',
              externalUrl: 'https://www.google.com',
              contentType: 'tests',
            },
          },
        ],
        order: 1,
      },
      tags: ['FREE'],
      states: [],
      imageUrl:
        'https://cdn.edulastic.com/default/dashboard-assets/get-started.png',
      type: 'BANNER',
      description: 'Demo Playground',
      _id: '6135d26f002c7b4720022222',
    },
  ]

  const formattedBannerTiles =
    (isSignupCompleted ? bannerSlides : startupBannerTiles) || []

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
            {formattedBannerTiles.map((slide, index) => {
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
                      isDemoPlaygroundTile
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
                  ) : isDemoPlaygroundTile ? (
                    <LearnMore data-cy="explore">Explore</LearnMore>
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
          setShowBannerModal={setShowBannerModal}
        />
      )}
    </>
  )
}

export default BannerSlider
