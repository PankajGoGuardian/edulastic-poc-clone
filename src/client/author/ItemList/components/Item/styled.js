import {
  mediumDesktopWidth,
  white,
  tabletWidth,
  textColor,
  lightGrey,
  greyDarken,
  greenPrimary,
  themeLightGrayColor,
  themeLightGrayBgColor,
  themeColorTagsBg,
  themeColor,
  red
} from "@edulastic/colors";
import styled from "styled-components";
import { Button } from "antd";
import { IconHeart, IconShare, IconUser, IconId } from "@edulastic/icons";

export const Container = styled.div`
  padding: 30px 0 15px;
  border-bottom: 1px solid #f6f6f6;

  @media (max-width: ${tabletWidth}) {
    flex-direction: column;
    padding: 28px 28px 0 28px;

    &:not(:first-child) {
      border-top: 0;
      position: relative;

      &:before {
        content: "";
        position: absolute;
        top: 0;
        left: 28px;
        right: 28px;
        height: 1px;
        background: #f6f6f6;
      }
    }
  }
`;

export const Question = styled.div`
  display: flex;

  & p {
    font-size: 13px;
  }

  table tr td img {
    max-height: 100%;
    max-width: 100%;
  }

  @media (max-width: ${tabletWidth}) {
    width: 100%;
    margin-bottom: 0;
    text-align: center;
    margin-top: -0.5em;
  }
`;

export const QuestionContent = styled.div`
  flex: 1;

  @media (max-width: ${tabletWidth}) {
    text-align: left;
  }
`;

export const ViewButton = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: auto;

  @media (max-width: ${tabletWidth}) {
    width: 50%;
    display: inline-flex;
    justify-content: flex-end;
    margin-top: 13px;
    padding-right: 5px;
  }
`;

export const ViewButtonStyled = styled(Button)`
  height: 40px;
  border-radius: 4px;
  background: ${white};
  box-shadow: 0px 1px 1px 1px ${themeColor}05;
  font-size: 11px;
  font-weight: 600;
  text-transform: uppercase;
  color: ${themeColor};
  padding: 5px 30px 5px 20px;
  line-height: 17px;
  display: flex;
  align-items: center;
  &:hover,
  &:focus {
    background: ${lightGrey};
    color: ${themeColor};
    svg {
      fill: ${themeColor};
    }
  }
  svg {
    fill: ${themeColor};
    margin-right: 20px;
    width: 20px;
  }

  @media (max-width: ${tabletWidth}) {
    width: 40px;
    height: 40px;
    border-radius: 3px;
    padding: 0;

    span {
      font-size: 0;
      display: none;
    }
  }

  @media (max-width: ${mediumDesktopWidth}) {
    height: 36px;
  }
`;

export const AddButtonStyled = styled(Button)`
  height: 40px;
  border-radius: 4px;
  background: ${white};
  box-shadow: 0 2px 4px 0 rgba(201, 208, 219, 0.5);
  font-size: 11px;
  font-weight: 600;
  text-transform: uppercase;
  margin-left: 10px;
  color: ${themeColor};
  padding: 0 15px;

  svg {
    max-width: 13px;
    max-height: 13px;
    fill: ${themeColor};
  }

  @media (max-width: ${tabletWidth}) {
    width: 40px;
    height: 40px;
    border-radius: 3px;
    padding: 0;

    svg {
      margin-top: 4px;
      stroke: ${themeColor};
    }
  }

  @media (max-width: ${mediumDesktopWidth}) {
    height: 36px;
  }
`;

export const Detail = styled.div`
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  margin-top: 15px;
  min-height: 40px;

  @media (max-width: ${tabletWidth}) {
    margin: 0;
    width: 50%;
    display: inline-flex;
    min-height: 0;
  }
`;

export const TypeCategory = styled.div`
  display: flex;
  align-items: center;
  margin-right: 10px;

  @media (max-width: ${tabletWidth}) {
    display: block;
    margin-right: 0px;
    width: 100%;
    margin: 0;
    position: relative;
    top: -4px;
  }
`;

export const DetailCategory = styled.div`
  display: flex;
  align-items: center;
  margin-left: 20px;

  svg {
    max-width: 16px;
    max-height: 14px;
    fill: ${themeLightGrayColor};
    &:hover {
      fill: ${themeLightGrayColor};
    }
  }
  @media (max-width: ${tabletWidth}) {
    width: auto;
    margin-right: 0px;
    margin-top: 17px;
    margin-left: 0px;
    flex-wrap: wrap;
    justify-content: center;
    text-align: center;

    > div {
      justify-content: center;
    }
  }
`;

export const CategoryName = styled.span`
  display: flex;
  align-items: baseline;
  font-size: 12px;
  font-weight: 600;
  margin-right: 5px;
  color: ${themeLightGrayColor};

  @media (max-width: ${tabletWidth}) {
    display: block;
    font-size: 14px;
    margin: 0 auto;
  }
`;

export const CategoryContent = styled.div`
  margin-left: 0;
  display: flex;
  align-items: center;
  flex-wrap: wrap;

  @media (max-width: ${tabletWidth}) {
    justify-content: flex-start;
    width: 100%;
  }
`;

export const Label = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 5px;
  height: 24px;
  padding: 6px 14px;
  margin-right: 10px;
  border-radius: 5px;
  background: ${themeLightGrayBgColor};

  span {
    font-size: 10px;
    font-weight: 700;
    font-weight: bold;
    letter-spacing: 0.2px;
    text-transform: uppercase;
    color: ${greyDarken};
  }

  @media (max-width: ${tabletWidth}) {
    margin-left: 0;
    width: auto;
    margin-top: 8px;
    height: 26px;
    padding-left: 18px;
    padding-right: 18px;
  }
`;

export const Count = styled.div`
  display: inline-flex;
  margin-left: 0;
  font-size: 12px;
  font-weight: 700;
  line-height: 24px;
  margin-right: 10px;
  color: ${greyDarken};

  @media (max-width: ${tabletWidth}) {
    display: none;
  }
`;

export const LabelText = styled.span`
  font-size: 10px;
  letter-spacing: 0.1px;
  text-align: center;
  color: ${textColor};
  text-transform: uppercase;

  @media (max-width: ${tabletWidth}) {
    letter-spacing: 0.2px;
    font-weight: bold;
    font-size: 10px;
  }
`;

export const Text = styled.span`
  display: flex;
  align-items: center;
  font-size: 12px;
  font-weight: 600;
  color: ${themeLightGrayColor};

  @media (max-width: ${tabletWidth}) {
    margin-top: 8px;
    font-size: 14px;
  }
`;

export const Categories = styled.div`
  display: flex;
  align-items: center;
  margin-left: auto;

  @media (max-width: ${tabletWidth}) {
    display: flex;
    justify-content: space-between;
    flex-wrap: nowrap;
    width: calc(100% + 15px);
    margin-top: 0;
    margin: 0 -7.5px;
  }
`;

export const ShareIcon = styled(IconShare)`
  display: flex;
  align-items: center;
  fill: ${themeColor};
`;

export const HeartIcon = styled(IconHeart)`
  display: flex;
  align-items: center;
  fill: ${themeColor};
`;

export const UserIcon = styled(IconUser)`
  display: flex;
  align-items: center;
  fill: ${themeColor};
`;

export const IdIcon = styled(IconId)`
  display: flex;
  align-items: center;
  fill: ${themeColor};
`;

export const StandardContent = styled.div`
  display: flex;
  align-items: center;

  @media (max-width: ${tabletWidth}) {
    flex-wrap: wrap;
    margin-right: 0;
    align-items: center;
  }
`;

export const LabelStandard = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 5px;
  height: 24px;
  padding: 6px 14px;
  margin-right: 10px;
  border-radius: 5px;
  background: ${themeColorTagsBg};

  span {
    font-size: 10px;
    font-weight: 700;
    font-weight: bold;
    letter-spacing: 0.2px;
    text-transform: uppercase;
    color: ${themeColor};
  }

  @media (max-width: ${tabletWidth}) {
    margin-left: 0;
    width: 26.6%;
    margin-top: 8px;
    height: 26px;
    padding: 4px;
  }
`;

export const LabelStandardText = styled.span`
  font-size: 10px;
  letter-spacing: 0.1px;
  text-align: center;
  color: ${textColor};
  text-transform: uppercase;

  @media (max-width: ${tabletWidth}) {
    letter-spacing: 0.2px;
    font-weight: bold;
    font-size: 10px;
  }
`;

export const CountGreen = styled.div`
  display: inline-flex;
  margin-left: 0;
  font-size: 12px;
  font-weight: 700;
  line-height: 24px;
  margin-right: 10px;
  color: ${greenPrimary};
`;

export const MoreInfo = styled.div`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  background: ${props => (props.isOpenedDetails ? themeColor : white)};
  box-shadow: 0 2px 4px 0 rgba(201, 208, 219, 0.5);
  border: 0;
  color: ${themeColor};
  width: 40px;
  height: 40px;
  border-radius: 3px;
  padding: 0;
  margin-right: 10px;
  transition: all 0.3s ease;

  &:focus,
  &:hover {
    svg {
      fill: ${props => (props.isOpenedDetails ? white : themeColor)};
    }
  }

  svg {
    display: initial;
    width: 18px;
    height: 15px;
    margin-bottom: -3px;
    fill: ${props => (props.isOpenedDetails ? white : themeColor)};
    position: relative;
    transition: all 0.3s ease;
    transform: ${props => (props.isOpenedDetails ? "rotate(180deg)" : "rotate(0deg)")};
  }
`;

export const Details = styled.div`
  background: #f8f8f8;
  border-radius: 3px;
  margin-top: 17px;
  padding: ;
  padding: ${props => (props.isOpenedDetails ? "22px 20px 20px" : "0 20px 0")};
  transition: all 0.3s ease;
  max-height: ${props => (props.isOpenedDetails ? "150px" : "0")};
  position: relative;
  overflow: hidden;
`;
