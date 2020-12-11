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
  flex: 10;
  max-width: 100%;
`

export const ButtonsContainer = styled.div`
  flex: 1;
  position: absolute;
  right: 20px;
  top: 50%;
  width: 32px;
  display: flex;
  flex-direction: column;
  align-items: center;
  transform: translateY(-50%);
  oveflow-x: visible;

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
  position: absolute;
  right: 0px;
  top: -40px;

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
