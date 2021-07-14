import {
  white,
  mobileWidth,
  greyThemeDark2,
  greyLight1,
  mediumDesktopExactWidth,
} from '@edulastic/colors'
import styled from 'styled-components'

export const Container = styled.div`
  display: flex;
  position: relative;
  padding: 0;
  min-height: ${({ flowLayout }) => (flowLayout ? 'unset' : '250px')};
  margin-bottom: 30px;
  flex-direction: row;
  opacity: ${({ isDragging }) => (isDragging ? '0.4' : '1')};

  @media (max-width: ${mobileWidth}) {
    padding: 0;
  }
`

export const WidgetContainer = styled.div`
  width: 100%;
`

export const ButtonsContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-end;
  overflow-x: visible;
  padding: ${({ unscored }) =>
    unscored ? '80px 20px 0px 10px' : '40px 20px 0px 10px'};
  min-width: 180px;
  opacity: 0.3;

  &:hover {
    opacity: 1;
  }

  &:hover {
    .points-input-wrapper,
    .total-points-wrapper {
      background: white;
      padding: 0px 0px 0px 10px;
    }
  }
  .ant-btn {
    background: ${white};
    display: flex;
    justify-content: center;
    align-items: center;
    width: 30px;
    height: 30px;
    border: 1px solid ${greyThemeDark2} !important;
    border-radius: 3px;
    margin-bottom: 10px;

    svg {
      fill: ${greyThemeDark2};
    }

    @media (min-width: ${mediumDesktopExactWidth}) {
      width: 32px;
      height: 32px;
    }
  }

  @media (max-width: ${mobileWidth}) {
    right: 0px;
  }
`

export const PointsInputWrapper = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 10px;

  .ant-input-number-disabled {
    background-color: ${greyLight1};
    &:hover {
      background-color: ${greyLight1};
    }
  }
`

export const ItemLevelScoringDesc = styled.p`
  padding: 12px;
  max-width: 350px;
`
export const TotalPointsWrapper = styled.div`
  display: flex;
  align-items: center;
  position: absolute;
  right: 0px;
  top: -20px;
  right: 20px;
`
