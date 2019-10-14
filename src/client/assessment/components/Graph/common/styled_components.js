import styled from "styled-components";
import TextareaAutosize from "react-autosize-textarea";
import {
  greenDark,
  grey,
  tabletWidth,
  greenDarkSecondary,
  secondaryTextColor,
  mobileWidthMax,
  desktopWidth,
  themeColor,
  white,
  green,
  mediumDesktopExactWidth,
  smallDesktopWidth
} from "@edulastic/colors";
import { TextField, Paper } from "@edulastic/common";
import { StyledPaperWrapper } from "../../../styled/Widget";

const createStandardTextSet = element => styled(element)`
  font-size: ${props => {
    const fontSize = props?.fontSize || `${props?.theme?.common?.standardFont || "14px"}`;
    return fontSize;
  }};

  @media screen and (max-width: ${mediumDesktopExactWidth}) {
    font-size: ${({ theme }) => theme?.common?.bodyFontSize};
  }

  @media screen and (max-width: ${smallDesktopWidth}) {
    font-size: ${({ theme }) => theme?.common?.commentFontSize};
  }
`;

export const InstructorStimulus = styled.p`
  border-radius: 3px;
  margin-top: 0;
  margin-bottom: 15px;
  font-size: 18px;
  background: ${grey};
`;

export const StyledTextarea = styled(TextareaAutosize)`
  margin-top: 15px;
  resize: none;
  width: 100%;
  min-height: 134px;
  border-top-right-radius: 4px;
  border-bottom-right-radius: 4px;
  padding: 10px 30px;
  box-sizing: border-box;
  border: 1px solid ${grey};
  outline: none;

  &.small {
    min-height: auto;
  }

  &.big {
    min-height: 135px;
  }
`;

export const Subtitle = styled.div`
  color: ${secondaryTextColor};
  margin-bottom: 30px;
  font-size: 20px;
  font-weight: bold;
  font-style: normal;
  font-stretch: normal;
  line-height: 1.36;
  letter-spacing: normal;
  text-align: left;
`;

export const StyledTextField = createStandardTextSet(styled(TextField)`
  width: ${props => (props.width ? `${props.width}` : "100px")};
  padding: 5px 15px;
  margin-right: ${props => (props.marginRight ? props.marginRight : "3em")};
  height: 40px;
  margin-bottom: ${props => (props.marginBottom ? props.marginBottom : "1em")};
  border-radius: 4px;
`);

export const LineInput = styled(TextField)`
  width: 100px;
  text-align: center;
  margin-right: 25px;
  height: 50px;
`;

export const Label = createStandardTextSet(styled.label`
  display: block;
  margin-right: 0.7em;
  margin-bottom: 0.7em;
  font-weight: 600;
`);

export const ToolSubTitle = createStandardTextSet(styled.span`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: flex-start;
  width: 100%;
  color: #434b5d;
  line-height: 18px;
  font-weight: 600;
  margin-bottom: 9px;
  letter-spacing: 0.2px;
`);

export const SelectWrapper = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: flex-start;
`;

export const GraphToolsParamsWrapper = styled.div`
  width: 100%;
  display: flex;
  flex-wrap: wrap;
  flex-direction: row;
  align-items: flex-start;
  justify-content: flex-start;
`;

export const AddToolBtnWrapper = styled.div`
  width: 100%;
  margin-top: 14px;
`;

export const ToolSelect = styled.div`
  & + & {
    margin-top: 17px;
  }
`;

export const Container = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 15px 0;
  width: 50%;

  @media (max-width: ${tabletWidth}) {
    flex-direction: column;
  }
`;

export const MoreOptionsContainer = styled(Container)`
  width: 100%;
  padding: 33px 0 0 0;
  align-items: flex-start;
  flex-direction: column;
`;

export const ContainerStart = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-start;

  @media (max-width: ${tabletWidth}) {
    flex-direction: column;
  }
`;

export const LineParameter = styled.div`
  display: block;
  width: 50%;
`;

export const TitleTextInput = styled.input`
  width: 100%;
  height: 40px;
  padding: 0 20px 0 20px;
  outline: 0;
  border-radius: 4px;
  border: 1px solid #dfdfdf;
  color: #7a7a7a;
  background-color: transparent;
`;

export const StyledDragHandle = styled.div`
  width: 50px;
  flex: 1;
  border-top: 1px solid ${grey};
  border-bottom: 1px solid ${grey};
  border-left: 1px solid ${grey};
  border-top-left-radius: 4px;
  border-bottom-left-radius: 4px;
  padding: 6px;

  svg {
    height: 16px;
    width: 16px;
  }
`;

export const QuestionTitleWrapper = styled.div`
  font-size: ${props => props.theme.fontSize};
  display: flex;
`;

export const Item = styled.div`
  width: 100%;
  display: flex;
  align-items: stretch;
  margin-right: 15px;
`;

export const MoreOptions = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  flex-direction: column;
`;

export const MoreOptionsHeading = createStandardTextSet(styled.div`
  width: 100%;
  padding: 6px 0;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
`);

export const MoreOptionsToggler = styled.div`
  width: 18.9px;
  height: 2.4px;
  background-color: ${greenDark};
  cursor: pointer;
  :hover {
    background-color: ${greenDarkSecondary};
  }
`;

export const MoreOptionsColumnContainer = styled.div`
  width: 100%;
  display: flex;
  flex-direction: row;
  align-items: flex-start;
`;

export const MoreOptionsColumn = styled.div`
  width: 50%;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
`;

export const MoreOptionsRow = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  margin-top: 30px;
`;

export const MoreOptionsRowInline = styled.div`
  width: 100%;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: flex-start;
  margin-top: 16px;
`;

export const MoreOptionsSubHeading = styled.div`
  color: ${secondaryTextColor};
  margin-bottom: 35px;
  font-size: 20px;
  font-weight: bold;
  font-style: normal;
  font-stretch: normal;
  line-height: 1.35;
  letter-spacing: normal;
  text-align: left;
  // width: 100%;
  // color: ${greenDark};
  // font-size: 14px;
  // margin: 2px 0;
  // font-weight: 600;
  // line-height: 1.36;
`;

export const MoreOptionsLabel = createStandardTextSet(styled.div`
  color: ${secondaryTextColor};
  font-weight: 600;
  line-height: 1.38;
`);

export const MoreOptionsLabelInline = styled(MoreOptionsLabel)`
  width: auto;
`;

export const MoreOptionsInput = createStandardTextSet(styled.input`
  width: 100%;
  height: 40px;
  padding: 0 15px;
  outline: 0;
  border-radius: 5px;
  border: 1px solid ${grey};
  color: ${secondaryTextColor};
  background-color: #fff;
  font-weight: 600;
  line-height: 1.38;
`);

export const MoreOptionsInputSmall = styled(MoreOptionsInput)`
  width: 7em;
  margin: 0;
  padding: 0 5px 0 20px;
  text-align: center;
`;

export const SelectContainer = styled.div`
  position: relative;
  width: ${props => (props.width ? `${props.width}px` : "100%")};
  height: ${props => (props.height ? `${props.height}px` : "58px")};

  &:before {
    position: absolute;
    font-family: "FontAwesome";
    top: 0;
    right: 25px;
    display: flex;
    align-items: center;
    height: 100%;
    color: ${themeColor};
    content: "\f0d7";
  }

  @media (max-width: 760px) {
    height: 52px;
    width: 188px;
  }
`;

export const Select = createStandardTextSet(styled.select`
  padding: 1em 2em;
  width: 100%;
  height: 100%;
  box-sizing: border-box;
  border-radius: 5px;
  background-color: ${props => props.theme.widgets.assessmentPlayers.selectBgColor};
  box-shadow: 0 2px 5px 0 rgba(0, 0, 0, 0.07);
  color: ${props => props.theme.widgets.assessmentPlayers.selectTextColor};
  border: none;
  outline: none;
  -webkit-appearance: none;
`);

export const MoreOptionsDivider = styled.div`
  width: 100%;
  height: 1px;
  padding: 0;
  margin-top: 48px;
  background-color: ${props => (props.backgroundColor ? props.backgroundColor : grey)};
`;

export const Row = styled.div`
  display: flex;
  align-items: flex-start;
  margin-bottom: ${props => (props.marginBottom ? props.marginBottom : "15px")};
  flex-wrap: wrap;

  &:last-child {
    margin-bottom: 0;
  }
`;

export const Col = styled.div`
  display: flex;
  flex-direction: column;
  padding-right: ${props => (props.paddingRight ? props.paddingRight : "0")};
  padding-left: ${props => (props.paddingLeft ? props.paddingLeft : "0")};
  margin-bottom: ${props => (props.marginBottom ? props.marginBottom : "0")}px;
  width: ${({ md }) => (100 / 12) * md}%;
  display: block;
`;

export const PaperWrapper = styled(StyledPaperWrapper)`
  padding: ${props => (props.flowLayout ? "0px" : props.isV1Multipart ? "0px 35px" : "35px")};

  @media (max-width: ${mobileWidthMax}) {
    padding: ${({ flowLayout }) => (flowLayout ? "0px" : "20px;")};
    margin-bottom: 15px;
  }
  @media screen and (min-width: ${desktopWidth}) {
    width: ${({ twoColLayout }) => twoColLayout?.first};
  }
`;

export const GraphToolbar = createStandardTextSet(styled.div`
  box-sizing: border-box;
  position: relative;
  width: 100%;
  display: flex;
  flex-direction: row;
  align-items: flex-start;
  justify-content: space-between;
  min-height: 90px;
  padding: 0 0 10px 0;
  background-color: ${props => props.theme.widgets.axisLabels.responseBoxBgColor};

  ul {
    list-style: none;
  }

  ul li {
    margin: 10px 10px 0 0;
  }
`);

export const ToolbarLeft = styled.ul`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: flex-start;
  flex-wrap: wrap;
  margin: 0;
  padding: 0;
`;

export const ToolbarRight = styled.ul`
  display: flex;
  align-items: center;
  margin: 0;
  padding: 0;

  li:last-child {
    margin: 10px 0 0 0;
  }
`;

export const ToolbarItem = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

export const ToolbarItemLabel = createStandardTextSet(styled.span`
  color: ${props => (props.color ? props.color : `${secondaryTextColor}`)}
  font-weight: 600;
  line-height: 19px;
`);

export const ToolbarItemIcon = styled.div`
  display: flex;
  flex-direction: row;
  align-items: flex-end;
  justify-content: center;
  width: auto;
  height: auto;
  min-width: 23px;
  min-height: 24px;
  margin-bottom: 5px;
`;

export const ToolBtn = styled.li`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 93px;
  height: 84px;
  background-color: transparent;
  color: ${props => props.theme.widgets.chart.labelStrokeColor};
  cursor: pointer;
  display: inline-block;
  line-height: 1.5em;
  transition: background-color 0.1s ease-in;
  xuser-select: none;
  box-shadow: 0 3px 6px 0 rgba(0, 0, 0, 0);

  svg {
    color: ${props => props.theme.widgets.chart.labelStrokeColor};
    stroke: ${props => props.theme.widgets.chart.labelStrokeColor};
    fill: ${props => props.theme.widgets.chart.labelStrokeColor};
  }

  &:hover {
    background-color: ${props => props.theme.widgets.chart.labelBgHoverColor};
  }

  &:active {
    background-color: ${props => props.theme.widgets.chart.labelBgHoverColor};
    box-shadow: 0 3px 6px 0 rgba(0, 0, 0, 0.06);
  }

  &:hover,
  &:active,
  &.active {
    background-color: ${props => props.theme.widgets.chart.labelBgHoverColor};
    box-shadow: 0 3px 6px 0 rgba(0, 0, 0, 0.06);

    .dd-header-title svg {
      color: ${greenDark};
      stroke: ${greenDark};
      fill: ${greenDark};
    }

    .tool-btn-icon svg {
      color: ${props => props.theme.widgets.chart.labelStrokeColor};
      stroke: ${props => props.theme.widgets.chart.labelStrokeColor};
      fill: ${props => props.theme.widgets.chart.labelStrokeColor};
    }
  }
`;

export const DropdownMenu = styled.ul`
  position: absolute;
  top: 108%;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  min-width: 150px;
  margin: 1px 0 0;
  list-style: none;
  user-select: none;
  white-space: nowrap;
  border: 0;
  padding: 20px 0;
  box-shadow: 0 3px 6px 0 rgba(0, 0, 0, 0.1);
  background-color: #ffffff;
  z-index: 10;

  &:before {
    position: absolute;
    top: -10px;
    left: 50%;
    content: "";
    transform: translateX(-50%);
    z-index: 11;
    width: 12px;
    height: 10px;
    border-style: solid;
    border-width: 0 12px 10px 12px;
    border-color: transparent transparent #fff transparent;
  }
`;

export const GroupToolBtn = styled.li`
  padding: 0.6em 1.6em;
  background-color: ${white};
  width: 100%;
  line-height: 1.5em;
  transition: background-color 0.1s ease-in;
  user-select: none;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: flex-start;
  position: relative;
  cursor: pointer;
  color: ${secondaryTextColor};
  box-shadow: none;

  svg {
    color: ${secondaryTextColor};
    stroke: ${secondaryTextColor};
    fill: ${secondaryTextColor};
  }

  &:hover {
    background-color: ${green};
    color: ${white};

    svg {
      color: ${white};
      stroke: ${white};
      fill: ${white};
    }
  }

  &:active,
  &.active {
    box-shadow: none;
  }
`;
