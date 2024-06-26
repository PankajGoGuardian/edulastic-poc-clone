import styled from "styled-components";
import { mobileWidth } from "@edulastic/colors";

/**
 * do not provide overflow here;
 * with overflow property, the page is getting blank on scrolling on the iPad Safari.
 * Also, don't provide transform: translate3d(0, 0, 0); here as well
 * if we use translate3d, the drag & drop not working properly.
 * @see https://snapwiz.atlassian.net/browse/EV-15752
 */
export const Container = styled.div`
  width: ${({ width }) => width};
  display: flex;
  flex-direction: column;
  border-right-color: ${props => props.theme.testItemPreview.itemColBorderColor};
  background-color: ${props => props.hasCollapseButtons && "#fff"};
  border-radius: ${props => props.hasCollapseButtons && "10px"};
  min-height: ${props => props.hasCollapseButtons && "calc(100vh - 122px)"};
  padding-top: ${props => props.hasCollapseButtons && "15px"};

  ${({ height }) => height && `height: ${height}`};
  @media (max-width: ${mobileWidth}) {
    padding-left: 0px;
    margin-right: ${props => !props.value && "20px"};
    margin-left: ${props => props.value && "20px"};
  }
`;

export const WidgetContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  padding-top: 20px;
  ${({ style }) => style};
`;
