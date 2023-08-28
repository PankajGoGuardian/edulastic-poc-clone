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
  greyishDarker1,
  extraDesktopWidthMax,
  inputBorder,
  whiteSmoke,
  themeColorBlue,
} from '@edulastic/colors'
import { EduButton } from '@edulastic/common'

const getQuestionItemWrapperWidth = ({
  isSnapQuizVideoPlayer,
  review,
  annotations,
}) => {
  if (!isSnapQuizVideoPlayer) {
    return '98%'
  }
  if (isSnapQuizVideoPlayer) {
    return '100%'
  }
  return annotations ? 'auto' : review ? '100%' : '265px'
}

export const QuestionItemWrapper = styled.div`
  width: ${({ isSnapQuizVideoPlayer, review, annotations }) =>
    getQuestionItemWrapperWidth({
      isSnapQuizVideoPlayer,
      review,
      annotations,
    })};
  height: ${({ isSnapQuizVideoPlayer }) =>
    isSnapQuizVideoPlayer ? '100%' : ''};
  padding: ${({ pdfPreview }) => !pdfPreview && '10px'};
  background: ${({ pdfPreview }) => (pdfPreview ? 'transparent' : white)};
  border-radius: 10px;
  border: ${({ pdfPreview }) => !pdfPreview && `1px solid ${sectionBorder}`};
  box-shadow: ${({ highlighted, pdfPreview }) =>
    !pdfPreview && highlighted ? `0 0 10px 0 ${themeColor}` : 'none'};
  border-left: ${({ review }) => !review && 0};

  @media (max-width: ${smallDesktopWidth}) {
    width: 225px;
  }
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

export const VideoQuizQuestionForm = styled.div`
  cursor: ${(props) => (!props?.isSnapQuizVideoPlayer ? 'pointer' : '')};
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

export const VideoQuizItemWrapper = styled.div`
  display: flex;
`

export const VideoQuizItemContainer = styled.div`
  width: 100%;
`

export const EditButton = styled.span`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  margin-top: 5px;
  margin-left: 5px;
  position: relative;
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
      width: 15px;
      height: 15px;
      fill: ${greyThemeDark4};
      &:hover {
        fill: ${red};
      }
    }
  }
`

export const AnswerIndicator = styled.span`
  display: inline-block;
  padding: 8px;
  margin: auto;

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
export const StyledOptionsContainer = styled.div`
  display: flex;
  justify-content: flex-start;
  align-items: center;
  padding: 5px 0px;
`
export const StyledTimeStampContainer = styled.div`
  padding-top: 5px;
  font-size: 13px;
  span {
    color: ${themeColor};
    font-weight: bold;
  }
`
export const StyledRemoveQuestion = styled.div`
  margin-top: 10px;
  color: ${red};
  font-weight: bold;
  font-size: 10px;
  cursor: pointer;
`

const getBackground = ({ selected, checked, correct }) =>
  selected ? (checked ? (correct ? green : red) : themeColor) : white

const getBorder = ({ selected, checked, correct }) =>
  selected ? (checked ? (correct ? green : red) : themeColor) : greyishDarker1

export const QuestionChunk = styled.div`
  min-width: 150px;
  &:not(:last-child) {
    margin-bottom: 5px;
  }

  &:focus {
    outline: 3px solid ${themeColorBlue};
    outline-style: dashed;
  }

  .ant-radio-wrapper {
    margin-right: 0px;
    margin-left: 0px !important;
  }

  @media (max-width: ${smallDesktopWidth}) {
    min-width: 145px;
  }
`

export const QuestionOption = styled.span`
  display: inline-block;
  min-width: ${({ styleProps }) => styleProps?.minWidth || '32px'};
  height: ${({ styleProps }) => styleProps?.height || '32px'};
  border: 1px solid ${getBorder};
  font-size: 13px;
  margin-bottom: 2px;
  text-align: center;
  line-height: ${({ styleProps }) => styleProps?.lineHeight || '30px'};
  color: ${({ selected }) => (selected ? white : secondaryTextColor)};
  background: ${getBackground};
  cursor: ${({ review, mode }) =>
    review && mode !== 'report' ? 'pointer' : 'default'};
  border-radius: ${({ multipleResponses }) =>
    !multipleResponses ? '50%' : null};
  &:not(:last-child) {
    margin-right: 4px;
  }
  font-weight: bold;
  margin-top: ${({ styleProps }) => styleProps?.marginTop || ''};
  &:focus {
    outline: 3px solid ${themeColorBlue};
    outline-style: dashed;
  }
  @media (min-width: ${extraDesktopWidthMax}) {
    min-width: 32px;
    height: 32px;
    font-size: 13px;
    line-height: 30px;
  }
`

export const QuestionText = styled.p`
  margin: 0;
  font-size: 14px;
  border: 1px solid ${inputBorder};
  border-radius: 4px;
  padding: 4px 11px;
  background: ${whiteSmoke};
  color: rgba(0, 0, 0, 0.25); /* TODO: re-visit once mockup is updated */
`
export const SortableListContainer = styled.div`
  .main {
    margin-right: 5px !important;
  }
  svg {
    margin: unset;
  }
`

export const NextButton = styled(EduButton)`
  height: 30px;
`
