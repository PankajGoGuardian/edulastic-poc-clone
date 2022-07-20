import { darkGrey3, fadedGreen, themeColor } from '@edulastic/colors'
import { Button, Carousel, Icon, Tooltip } from 'antd'
import PropTypes from 'prop-types'
import React from 'react'
import styled from 'styled-components'
import {
  getFullNameFromAsString,
  getInitialsFromName,
} from '../../../../common/utils/helpers'

const PrevButton = ({ onClick }) => (
  <StyledNextButton onClick={onClick} type="link">
    <Icon type="left" />
  </StyledNextButton>
)

PrevButton.propTypes = {
  onClick: PropTypes.func,
}

PrevButton.defaultProps = {
  onClick: () => null,
}

const NextButton = ({ onClick }) => (
  <StyledPrevButton onClick={onClick} type="link">
    <Icon type="right" />
  </StyledPrevButton>
)

NextButton.propTypes = {
  onClick: PropTypes.func,
}

NextButton.defaultProps = {
  onClick: () => null,
}

const Card = ({ teacher }) => {
  const fullName = getFullNameFromAsString(teacher)
  return (
    <CardWrapper>
      <TeacherInfo>
        {teacher.thumbnail ? (
          <img src={teacher.thumbnail} alt="Profile" />
        ) : (
          <CircleMark>{getInitialsFromName(teacher)}</CircleMark>
        )}
        <Tooltip placement="bottom" title={fullName}>
          <TeacherName>{fullName}</TeacherName>
        </Tooltip>
      </TeacherInfo>
    </CardWrapper>
  )
}

const carouselOptions = {
  dots: false,
  infinite: false,
  draggable: true,
  speed: 500,
  slidesToShow: 3,
  slidesToScroll: 3,
  initialSlide: 0,
  arrows: true,
  variableWidth: true,
  prevArrow: <PrevButton />,
  nextArrow: <NextButton />,
  responsive: [
    {
      breakpoint: 1024,
      settings: {
        slidesToShow: 3,
        slidesToScroll: 3,
      },
    },
    {
      breakpoint: 600,
      settings: {
        slidesToShow: 2,
        slidesToScroll: 2,
      },
    },
    {
      breakpoint: 480,
      settings: {
        slidesToShow: 1,
        slidesToScroll: 1,
      },
    },
  ],
}

const TeacherCarousel = ({ teachers }) => (
  <CarouselWrapper>
    <TeacherCount>HERE ARE A FEW TEACHERS FROM THIS SCHOOL</TeacherCount>
    <Carousel {...carouselOptions}>
      {teachers.map((item) => (
        <Card teacher={item._source} />
      ))}
    </Carousel>
  </CarouselWrapper>
)

export default TeacherCarousel

const CarouselWrapper = styled.div`
  .slick-track {
    display: flex;
  }
  .ant-carousel {
    margin-left: 20px;
    .slick-slider {
      width: 80%;
      margin: auto;
      .slick-slide {
        min-width: 100px;
        display: flex;
        justify-content: center;
      }

      .ant-btn:not([disabled]):active,
      .ant-btn {
        border: 0px;
        i {
          color: ${darkGrey3};
        }
      }
    }
  }
`

const TeacherCount = styled.div`
  margin-bottom: 16px;
  font-weight: 300;
  font-size: 12px;
  line-height: 16px;
  letter-spacing: 0.01em;
  text-transform: uppercase;
  color: ${darkGrey3};
`

const CardWrapper = styled.div`
  display: flex;
  align-items: center;
  img {
    width: 50px;
    height: 50px;
    border-radius: 50%;
  }
`

const TeacherInfo = styled.div`
  display: flex;
  flex-direction: column;
  font-size: 12px;
`

const TeacherName = styled.div`
  font-weight: 500;
  max-width: 70px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  margin-top: 15px;
`

const CircleMark = styled.div`
  height: 50px;
  width: 50px;
  background: ${fadedGreen};
  border-radius: 50%;
  border: 2px ${themeColor} solid;
  color: ${themeColor};
  font-size: 25px;
  text-transform: uppercase;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0px auto;
`

const ArrowBtn = styled(Button)`
  color: ${themeColor};
  position: absolute;
  top: 50%;
  width: 16px;
  height: 16px;
  margin-top: -24px;
  padding: 0px;
  outline: none;
  cursor: pointer;
  font-size: 16px;
`

const StyledNextButton = styled(ArrowBtn)`
  left: -5px;
  z-index: 20;
`

const StyledPrevButton = styled(ArrowBtn)`
  right: -25px;
  z-index: 20;
`
