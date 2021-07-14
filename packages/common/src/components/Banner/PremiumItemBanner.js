import React from 'react'
import styled from 'styled-components'
import { Icon } from 'antd'
import { greyThemeDark3, themeColor } from '@edulastic/colors'
import { QuestionNumberLabel, QuestionSubLabel } from '@edulastic/common'

const PremiumItemBanner = ({
  itemBankName = [],
  isExpandedView = false,
  showStacked = false,
  data = {},
  hideQuestionLabels = false,
  height = false,
  isPrintPreview = false,
}) => (
  <PremiumItemBannerWrapper
    isExpandedView={isExpandedView}
    height={height}
    isPrintPreview={isPrintPreview}
  >
    {!hideQuestionLabels && data.qLabel && (
      <QuestionNumberLabel
        className="__print-space-reduce-qlabel"
        width={36}
        height={36}
        fontSize="11px"
      >
        {data.qLabel}
      </QuestionNumberLabel>
    )}
    {!hideQuestionLabels && data.qSubLabel && (
      <QuestionSubLabel className="sub-label">
        ({data.qSubLabel})
      </QuestionSubLabel>
    )}
    <Container showStacked={showStacked}>
      <span>
        <Icon type="warning" theme="filled" />
        Question is not accessible
      </span>
      <span>
        {`Because you are no longer subscribed to items from ${itemBankName.join(
          ','
        )}`}
      </span>
    </Container>
  </PremiumItemBannerWrapper>
)

export default PremiumItemBanner

const PremiumItemBannerWrapper = styled.div`
  width: 100%;
  display: flex;
  position: relative;
  height: ${({ isExpandedView, height }) =>
    height || (isExpandedView ? '70vh' : '250px')};
  align-items: center;
  section {
    position: absolute;
    top: 8px;
    left: ${({ isPrintPreview }) => (isPrintPreview ? '0px' : '16px')};
  }
  .sub-label {
    position: absolute;
    left: ${({ isPrintPreview }) => (isPrintPreview ? '0px' : '16px')};
    top: 50px;
    width: max-content;
  }
`

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  span: first-child {
    display: flex;
    align-items: center;
    flex-direction: ${({ showStacked }) => (showStacked ? 'column' : 'row')};
    font-weight: 700;
    svg {
      margin-right: 5px;
      height: 18px;
      width: 18px;
      fill: ${themeColor};
    }
  }
  span: last-child {
    color: ${greyThemeDark3};
  }
`
