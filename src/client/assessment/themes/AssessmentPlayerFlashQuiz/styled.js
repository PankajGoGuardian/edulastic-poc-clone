import { lightGrey3, lightGrey4, themeColorBlue } from '@edulastic/colors'
import { IconBookmark, IconCheck } from '@edulastic/icons'
import { Tag } from 'antd'

import styled from 'styled-components'

export const HeaderTitle = styled.h3`
  width: 100%;
  text-align: center;
  font-size: 22px;
  color: white;
  font-weight: 600;
  margin-bottom: unset;
  padding-left: 20px;
`

export const FlashCardsWrapper = styled.div`
  width: 100%;
  height: 480px;
  display: flex;
  justify-content: center;
  position: relative;
`

export const FlipCardsWrapper = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  position: relative;
  border: 1px solid ${lightGrey4};
  border-radius: 10px;

  &:hover {
    transform: scale(1.02);
  }
`

export const FlashCardFront = styled.div`
  width: 620px;
  height: 410px;
  box-shadow: 0 0.3rem 1rem 0 rgb(0 0 0 / 16%);
  border-radius: 20px;
  background: white;
  padding: 6px 36px;
  position: absolute;
  backface-visibility: hidden;
  transform: perspective(1000px)
    ${({ front }) => (front ? 'rotateX(0deg)' : 'rotateX(180deg)')};
  transform-style: preserve-3d;
  transition: 300ms;

  &:hover {
    cursor: pointer;
  }
`

export const FlashCardBack = styled.div`
  width: 620px;
  height: 410px;
  box-shadow: 0 0.3rem 1rem 0 rgb(0 0 0 / 16%);
  border-radius: 20px;
  background: white;
  padding: 6px 36px;
  position: absolute;
  backface-visibility: hidden;
  transform: perspective(1000px)
    ${({ back }) => (back ? 'rotateX(0deg)' : 'rotateX(-180deg)')};
  transform-style: preserve-3d;
  transition: 300ms;

  &:hover {
    cursor: pointer;
  }
`

export const FlipCardFrontDummy = styled.div`
  width: 100%;
  height: 100%;
  box-shadow: 0 0.3rem 1rem 0 rgb(0 0 0 / 16%);
  border-radius: 10px;
  background: transparent linear-gradient(180deg, #0e9f8c 0%, #095392 100%) 0%
    0% no-repeat padding-box;
  padding: 10px;
  position: absolute;
  backface-visibility: hidden;
  transform: perspective(1000px)
    ${({ front }) => (front ? 'rotateY(0deg)' : 'rotateY(-180deg)')};
  transform-style: preserve-3d;
  transition: 300ms;

  &:hover {
    cursor: pointer;
  }
`

export const FlipCardBack = styled.div`
  width: 100%;
  height: 100%;
  box-shadow: 0 0.3rem 1rem 0 rgb(0 0 0 / 16%);
  border-radius: 10px;
  background: white;
  padding: 6px 36px;
  position: absolute;
  backface-visibility: hidden;
  transform: perspective(1000px)
    ${({ back }) => (back ? 'rotateY(0deg)' : 'rotateY(180deg)')};
  transform-style: preserve-3d;
  transition: 300ms;

  &:hover {
    cursor: pointer;
  }
`

export const CardContent = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: 1000ms;
`

export const Button = styled.div`
  width: 60px;
  height: 60px;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 30px;
  border-radius: 100px;
  visibility: ${({ hide }) => (hide ? 'hidden' : 'visible')};

  &:hover {
    background: ${lightGrey3};
  }
`

export const PaginationText = styled.p`
  font-size: 16px;
  font-weight: 600;
  letter-spacing: 4px;
  text-align: center;
`

export const CardListItemWrapper = styled.div`
  width: 400px;
  max-height: calc(100vh - 200px);
  margin-top: 50px;
  display: flex;
  flex-direction: column;
  border: 1px solid ${lightGrey4};
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  border-radius: 4px;
  overflow: inherit;

  .scrollbar-container .ps,
  > div {
    width: 100% !important;
    padding: 20px 30px !important;
  }
`

export const CardListItem = styled.div`
  width: 100%;
  min-height: 60px;
  border: 1px solid ${lightGrey4};
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  border-radius: 4px;
  padding: 5px 10px;
  margin: 10px auto;

  &:hover {
    background: ${lightGrey3};
  }
`

export const CardNo = styled.div`
  width: 30px;
  height: 30px;
  text-align: center;
  line-height: ${({ active }) => (active ? '25px' : '30px')};
  border: ${({ active }) =>
    active ? `3px solid ${themeColorBlue}` : `1px solid ${lightGrey4}`};
  border-radius: 100px;
  margin-right: 20px;
  transition: 300ms;
`

export const StyledIconBookmark = styled(IconBookmark)`
  position: absolute;
  right: 45px;
  width: 22px;
  height: 22px;
  fill: #ffba08;
  &:hover {
    fill: #ffba08;
  }
`

export const StyledIconChecked = styled(IconCheck)`
  position: absolute;
  right: ${({ right = '45px' }) => right};
  top: ${({ top }) => top};
  fill: #fff;
  padding: 3px;
  width: 22px;
  height: 22px;
  border: 2px solid #8ac926;
  border-radius: 10px;
  background: #8ac926;
  &:hover {
    fill: #fff;
  }
`
export const GridContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  grid-gap: 12px;
  width: 100%;
  padding: 10px 30px;
`

export const FlipCard = styled.div`
  min-height: 200px;
  background-color: #eee;
`

export const FlipCardListItem = styled.div`
  width: 100%;
  min-height: 60px;
  border: 1px solid ${lightGrey4};
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  border-radius: 4px;
  padding: 5px 10px;
  margin: 10px auto;

  &:hover {
    background: ${lightGrey3};
  }
`

export const ConfettiContainer = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
  left: 50vw;
  bottom: 55vh;
`

export const StyledTag = styled(Tag)`
  padding: 10px 20px;
  font-size: 20px;
  line-height: 26px;
  margin-top: 16px;
  margin-bottom: 15px;
`

export const StatsContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: flex-start;
  height: 500px;
  width: 100%;
  border: 1px solid ${lightGrey4};
  padding: 10px 30px;
  border-radius: 20px;

  h2 {
    border-bottom: 2px dashed ${lightGrey4};
    width: 100%;
    text-align: center;
    padding: 10px 10px;
  }

  .ant-divider-horizontal.ant-divider-with-text-center::before,
  .ant-divider-horizontal.ant-divider-with-text-left::before,
  .ant-divider-horizontal.ant-divider-with-text-right::before,
  .ant-divider-horizontal.ant-divider-with-text-center::after,
  .ant-divider-horizontal.ant-divider-with-text-left::after,
  .ant-divider-horizontal.ant-divider-with-text-right::after {
    border-top: 1px solid ${lightGrey4};
  }
`

export const PerformanceContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-start;
  flex-direction: column;
  height: 500px;
  min-width: 500px;
  border: 1px solid ${lightGrey4};
  border-radius: 20px;
  padding: 10px 10px 10px 30px;
  margin: auto;
  padding: 30px 30px 10px 30px;

  .ant-divider-horizontal {
    margin: 20px 0 10px 0;
  }

  svg {
    background: #e9fbee;
  }

  .ant-progress-circle-path {
    stroke: #8ac926 !important;
  }

  .ant-progress-text {
    color: #8ac926;
    font-size: 30px;
    font-weight: 600;
  }

  .ant-progress-circle-trail {
    stroke: transparent !important;
  }

  .percent {
    svg {
      background: #fdf3ea;
    }

    .ant-progress-circle-path {
      stroke: #f9c74f !important;
    }

    .ant-progress-text {
      color: #f9c74f;
      font-size: 30px;
      font-weight: 600;
    }
  }

  .time {
    svg {
      background: #f0f5ff;
    }

    .ant-progress-circle-path {
      stroke: #f08080 !important;
    }

    .ant-progress-text {
      color: #f08080;
      font-size: 30px;
      font-weight: 600;
    }
  }

  h3 {
    margin-top: 10px;
    color: #333;
    font-size: 14px;
  }
`

export const PerformanceMetrics = styled.div`
  margin-top: 20px;
`

export const StatValue = styled.p`
  width: 100%;
  text-align: center;
`

export const FlashQuizReportContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-direction: column;
  height: calc(100vh - 160px);
  min-width: 500px;
  border: 1px solid ${lightGrey4};
  border-radius: 10px;
  padding: 20px 30px 10px 30px;
  margin: 30px auto;

  th {
    text-align: center;
  }

  svg,
  path,
  g {
    fill: #f3f3f3;
  }
`
