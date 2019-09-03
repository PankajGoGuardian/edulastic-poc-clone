import React from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import { get } from "lodash";
import { Carousel, Icon, Button } from "antd";
import { themeColor, fadedGreen } from "@edulastic/colors";
import Profile from "../../../assets/Profile.png";
import { getFullNameFromAsString, getInitialsFromName } from "../../../../common/utils/helpers";

const PrevButton = ({ onClick }) => (
  <StyledNextButton onClick={onClick} type="link">
    <Icon type="left" />
  </StyledNextButton>
);

PrevButton.propTypes = {
  onClick: PropTypes.func
};

PrevButton.defaultProps = {
  onClick: () => null
};

const NextButton = ({ onClick }) => (
  <StyledPrevButton onClick={onClick} type="link">
    <Icon type="right" />
  </StyledPrevButton>
);

NextButton.propTypes = {
  onClick: PropTypes.func
};

NextButton.defaultProps = {
  onClick: () => null
};

const Card = ({ teacher }) => {
  return (
    <CardWrapper>
      <TeacherInfo>
        {teacher.thumbnail ? (
          <img src={teacher.thumbnail} alt="Profile" />
        ) : (
          <CircleMark>{getInitialsFromName(teacher)}</CircleMark>
        )}
        <TeacherName>{getFullNameFromAsString(teacher)}</TeacherName>
      </TeacherInfo>
    </CardWrapper>
  );
};

const carouselOptions = {
  dots: false,
  infinite: false,
  draggable: true,
  speed: 500,
  slidesToShow: 5,
  slidesToScroll: 5,
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
        slidesToScroll: 3
      }
    },
    {
      breakpoint: 600,
      settings: {
        slidesToShow: 2,
        slidesToScroll: 2
      }
    },
    {
      breakpoint: 480,
      settings: {
        slidesToShow: 1,
        slidesToScroll: 1
      }
    }
  ]
};

const TeacherCarousel = ({ teachers }) => {
  return (
    <CarouselWrapper>
      <TeacherCount>{teachers.length}+ teachers from this school use Edulastic</TeacherCount>
      <Carousel {...carouselOptions}>
        {teachers.map((item, index) => {
          return <Card teacher={item._source} />;
        })}
      </Carousel>
    </CarouselWrapper>
  );
};

export default TeacherCarousel;

const CarouselWrapper = styled.div`
  margin-top: 32px;
  .slick-track {
    display: flex;
  }
  .ant-carousel .slick-slider {
    .slick-slide {
      min-width: 70px;
      display: flex;
      justify-content: center;
    }

    .ant-btn:not([disabled]):active,
    .ant-btn {
      border: 0px;
      i {
        color: ${themeColor};
      }
    }
  }
`;

const TeacherCount = styled.div`
  margin-bottom: 16px;
  font-weight: 600;
`;

const CardWrapper = styled.div`
  display: flex;
  align-items: center;
  width: 60px;
  img {
    width: 60px;
    height: 60px;
    border-radius: 50%;
  }
`;

const TeacherInfo = styled.div`
  display: flex;
  flex-direction: column;
`;

const TeacherName = styled.div`
  font-weight: 500;
`;

const SchoolInfo = styled.div`
  display: flex;
  flex-direction: column;
  margin-left: 8px;
  font-weight: 500;
`;

const SchoolName = styled.div``;

const CircleMark = styled.div`
  height: 60px;
  width: 60px;
  background: ${fadedGreen};
  border-radius: 50%;
  border: 2px ${themeColor} solid;
  color: ${themeColor};
  font-size: 32px;
  text-transform: uppercase;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const ArrowBtn = styled(Button)`
  color: ${themeColor};
  position: absolute;
  top: 50%;
  width: 20px;
  height: 20px;
  margin-top: -24px;
  padding: 0px;
  outline: none;
  cursor: pointer;
  font-size: 24px;
`;

const StyledNextButton = styled(ArrowBtn)`
  left: -32px;
`;

const StyledPrevButton = styled(ArrowBtn)`
  right: -32px;
`;
