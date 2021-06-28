import styled from 'styled-components'

import {
  white,
  secondaryTextColor,
  greenDark,
  green,
  red,
  themeColor,
  sectionBorder,
  greyScoreCardTitleColor,
  smallDesktopWidth,
  greyThemeDark4,
} from '@edulastic/colors'

export const QuestionItemWrapper = styled.div`
  width: ${({ review, annotations }) =>
    annotations ? 'auto' : review ? '100%' : '265px'};
  padding: ${({ pdfPreview }) => !pdfPreview && '10px'};
  background: ${({ pdfPreview }) => (pdfPreview ? 'transparent' : white)};
  border-radius: ${({ review }) => (review ? '10px' : '0 10px 10px 0')};
  border: ${({ pdfPreview }) => !pdfPreview && `1px solid ${sectionBorder}`};
  box-shadow: ${({ highlighted, pdfPreview }) =>
    !pdfPreview && highlighted ? `0 0 10px 0 ${themeColor}` : 'none'};
  border-left: ${({ review }) => !review && 0};

  @media (max-width: ${smallDesktopWidth}) {
    width: 225px;
  }
`

export const AnswerForm = styled.div`
  display: flex;
  align-items: center;
  background: transparent;
  position: relative;
`

export const QuestionNumber = styled.span`
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: ${({ zoom = 1, pdfPreview }) => (pdfPreview ? 16 : 18) * zoom}px;
  font-weight: bold;
  color: ${({ dragging }) => (dragging ? '#aaafb8' : 'white')};
  background: ${({ dragging }) => (dragging ? 'transparent' : greyThemeDark4)};
  border: 2px ${({ dragging }) => (dragging ? 'dashed' : 'solid')}
    ${greyThemeDark4};
  border-radius: 4px;
  width: ${({ zoom = 1, pdfPreview }) => (pdfPreview ? 25 : 32) * zoom}px;
  height: ${({ zoom = 1, pdfPreview }) => (pdfPreview ? 25 : 32) * zoom}px;
  line-height: 30px;
  text-align: center;
  transition: all 300ms;
  cursor: ${({ dragging, viewMode }) =>
    viewMode && (dragging ? 'grabbing' : 'grab')};
  box-shadow: ${({ highlighted, pdfPreview }) =>
    pdfPreview && highlighted && `0 0 10px 0 ${themeColor}`};

  @media (max-width: ${smallDesktopWidth}) {
    font-size: 16px;
  }
`

export const QuestionForm = styled.div`
  display: flex;
  flex-wrap: wrap;
  margin-left: 10px;
  width: 100%;
  padding-right: 2px;

  .ant-select-selection,
  .input__math,
  .ant-input {
    width: 100%;
  }
  .input__math {
    & + .input__absolute__keyboard {
      position: absolute;
      overflow: auto;
      right: 0px;
    }
  }

  @media (max-width: ${smallDesktopWidth}) {
    width: calc(100% - 40px);
  }
`

export const EditButton = styled.span`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-left: 5px;
  position: relative;

  @media (max-width: ${smallDesktopWidth}) {
    position: absolute;
    right: -85px;
  }
`

export const ButtonWrapper = styled.span`
  background: ${({ inverse }) => (inverse ? 'transparent' : white)};
  font-weight: 600;
  width: 25px;
  height: 25px;
  line-height: 25px;
  text-align: center;
  cursor: pointer;
  position: relative;

  svg {
    cursor: pointer;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);

    &.edit {
      width: 13px;
      height: 13px;
      fill: ${themeColor};
      &:hover {
        fill: ${themeColor};
      }
    }
    &.delete {
      width: 10px;
      height: 10px;
      fill: ${greyThemeDark4};
      &:hover {
        fill: ${greyThemeDark4};
      }
    }
  }
`

export const AnswerIndicator = styled.span`
  display: inline-block;
  padding: 8px;

  svg {
    fill: ${({ correct }) => (correct ? green : red)};
    width: 13px;
    height: 13px;

    &:hover {
      fill: ${greenDark};
    }
  }

  @media (max-width: ${smallDesktopWidth}) {
    position: absolute;
    right: -40px;
  }
`

export const DetailsContainer = styled.p`
  margin: 15px 0 0 5px;
`

export const DetailTitle = styled.span`
  display: inline-block;
  margin-right: 5px;
  font-size: 11px;
  text-transform: uppercase;
  color: ${greyScoreCardTitleColor};
`

export const DetailContents = styled.span`
  display: inline-block;
  font-size: 11px;
  font-weight: bold;
  color: ${secondaryTextColor};
`

export const DetailContentsAlternate = styled(DetailContents)`
  display: inline-block;
  padding-left: 8px;
`

export const DetailAlternateContainer = styled.div`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
`
export const TitleWrapper = styled.div`
  display: flex;
  justify-content: flex-start;
  align-items: center;
`
