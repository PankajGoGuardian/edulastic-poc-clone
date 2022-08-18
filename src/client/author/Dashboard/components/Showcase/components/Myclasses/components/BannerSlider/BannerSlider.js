import React, { useEffect, useRef, useState } from 'react'
import { debounce } from 'lodash'

// components
import { lightGreen11, white } from '@edulastic/colors'
import {
  IconChevronLeft,
  IconTimer,
  IconVideoCamera,
  IconTestLibrary,
} from '@edulastic/icons'
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
  DashedLine,
  StyledRow,
  StyledCol,
  SlideInfo,
  IconWrapper,
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
  history,
}) => {
  const [showArrow, setShowArrow] = useState(false)
  const scrollBarRef = useRef(null)

  // We are doing minimal BE changes. So filtering the demo playground and then displaying test library banner.
  const updatedBannerSlides = bannerSlides.filter(
    (slide) => slide.description != 'Demo Playground'
  )
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

  const navigateToTest = () => history.push('/author/tests')

  return (
    <>
      <TextWrapper
        data-cy="bannerTitle"
        size="16px"
        style={{ marginBottom: '1rem' }}
        mt="10px"
        fw="700"
        lh="22px"
        color={lightGreen11}
      >
        <IconWrapper>
          <IconTimer alt="" margin="0px 15px 0px 5px" />
          Quick Introduction to Edulastic
        </IconWrapper>
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
            {updatedBannerSlides.map((slide) => {
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
                  <StyledRow>
                    <StyledCol span={12}>
                      <SlideDescription data-cy={slide.description}>
                        {slide.description}
                      </SlideDescription>
                    </StyledCol>
                    <StyledCol span={2} offset={10}>
                      <IconWrapper>
                        <IconVideoCamera margin="5px 0px 0px 0px" />
                      </IconWrapper>
                    </StyledCol>
                  </StyledRow>
                  <DashedLine />
                  <SlideInfo>Resource to help you up </SlideInfo>
                  <SlideInfo>and running quickly</SlideInfo>
                  {isSparkTile ? (
                    !accessibleItembankProductIds?.includes(
                      slide.config?.subscriptionData?.productId
                    ) && (
                      <LearnMore data-cy="tryItFree" moveLeft="145px">
                        TRY IT FREE
                      </LearnMore>
                    )
                  ) : isCPMTile ? (
                    !accessibleItembankProductIds?.includes(
                      slide.config?.subscriptionData?.productId
                    ) && (
                      <LearnMore data-cy="tryItFree" moveLeft="120px">
                        Start a Free Trial
                      </LearnMore>
                    )
                  ) : isDemoPlaygroundTile ? (
                    <LearnMore data-cy="explore" moveLeft="150px">
                      Explore
                    </LearnMore>
                  ) : (
                    <LearnMore data-cy="LearnMore">LEARN MORE</LearnMore>
                  )}
                </Slides>
              )
            })}
            <Slides
              data-cy="banners"
              className="last"
              key="TestLibrary"
              onClick={navigateToTest}
            >
              <StyledRow>
                <StyledCol span={12}>
                  <SlideDescription data-cy="Tests Library">
                    Tests Library
                  </SlideDescription>
                </StyledCol>
                <StyledCol span={2} offset={10}>
                  <IconWrapper>
                    <IconTestLibrary />
                  </IconWrapper>
                </StyledCol>
              </StyledRow>
              <DashedLine />
              <SlideInfo>Check out tests from our</SlideInfo>
              <SlideInfo>
                library of <b style={{ color: '#000' }}>over 100K+ tests</b>
              </SlideInfo>
              <LearnMore data-cy="Explore" moveLeft="150px">
                Explore
              </LearnMore>
            </Slides>
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
