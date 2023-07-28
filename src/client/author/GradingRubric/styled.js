import styled from 'styled-components'
import { Input, Col, Table } from 'antd'
import {
  themeColor,
  white,
  lightGrey3,
  lightGreySecondary,
  placeholderGray,
  title,
  boxShadowDefault,
  labelGrey2,
  themeColorLighter,
  borderGrey2,
  boxShadowColor,
  deleteRed,
  backgroundGrey,
  boxShadowColor2,
  inputBorder,
  paginationBoxShadowColor,
} from '@edulastic/colors'
import PerfectScrollbar from 'react-perfect-scrollbar'
import { StyledButton } from '../../assessment/containers/WidgetOptions/styled/Buttons'

export const SaveButton = styled(StyledButton)`
  width: 200px;
  display: flex;
  align-items: center;
  justify-content: center;
  i {
    font-size: ${(props) => props.theme.keyboardFontSize};
  }
`

export const FormContainer = styled.div`
  display: flex;
  justify-content: space-between;
  background: ${white};
  box-shadow: 0px 3px 10px ${boxShadowColor2};
  border-radius: 10px;
  padding: 22px 34px 30px;
  font-size: ${(props) => props.theme.smallFontSize};
  margin-bottom: 20px;
  > div {
    display: inline-block;
    margin-bottom: 0px;
    input {
      height: 40px;
      background: ${lightGreySecondary};
      border-radius: 2px;
      &:disabled {
        cursor: default;
        color: inherit;
        background: ${lightGreySecondary};
        &:hover,
        &:focus {
          box-shadow: none;
        }
      }
    }
    .ant-form-item-label {
      line-height: 25px;
      label {
        font-weight: ${(props) => props.theme.semiBold};
        color: ${title};
        font-size: ${(props) => props.theme.smallFontSize};
      }
    }
  }
  > div:first-child {
    width: 32%;
  }
  > div:last-child {
    width: 65%;
  }
`

export const SaveRubricButton = styled(StyledButton)`
  float: right;
  width: max-content;
  margin-left: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  i {
    font-size: ${(props) => props.theme.keyboardFontSize};
  }
`
export const CancelRubricButton = styled(SaveRubricButton)`
  background: ${white};
  color: ${themeColor};
  border: 1px solid ${themeColor};
  &:hover,
  &:active,
  &:focus {
    background-color: ${themeColor};
    color: ${white};
  }
`

export const EditRubricContainer = styled(Col)`
  box-shadow: 0px 3px 10px ${boxShadowColor2};
  border-radius: 10px;
  h3 {
    font-size: ${(props) => props.theme.titleSecondarySectionFontSize};
    span {
      color: ${white};
      cursor: pointer;
    }
  }
  > div:first-child {
    > div:first-child {
      border-radius: 10px 10px 0px 0px;
    }
  }
`

export const CriteriaContainer = styled.div`
  width: 100%;
  border: none;
  border-radius: 8px;
  position: relative;
  background: ${white};
`

export const CriteriaHeader = styled.div`
  background: ${white};
  padding: 0px 34px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
`

export const CriteriaDetails = styled.div`
  width: 423px;
  padding: 20px 0px;
  display: inline-block;

  > div:first-child {
    input {
      border: 1px solid ${inputBorder};
      border-radius: 2px;
      height: 40px;
      background: ${lightGreySecondary};
      text-overflow: ellipsis;
      font-weight: ${(props) => props.theme.semiBold};
      font-size: ${(props) => props.theme.bodyFontSize};

      &:hover,
      &:active,
      &:focus {
        border: 1px solid ${themeColor};
      }

      &:disabled {
        box-shadow: none;
        border: 1px solid ${inputBorder};
      }
    }
  }
`

export const CiteriaActionsContainer = styled.div`
  display: inline-flex;
  width: auto;
  padding: 20px 0px;
  justify-content: flex-end;
`

export const RatingWrapper = styled.div`
  position: relative;
  padding: 4px 34px 0px;
`

export const RatingSection = styled(PerfectScrollbar)`
  height: 100%;
  margin-right: ${({ isEditable }) => (isEditable ? '235px' : '-5px')};
  white-space: nowrap;
  overflow-x: hidden;
  padding: 0px 5px;
  margin-left: -5px;
`

export const RubricFooter = styled.div`
  padding: 20px 34px;
  background: ${white};
  border-radius: 0px 0px 10px 10px;
`

export const StyledScrollbarContainer = styled(PerfectScrollbar)`
  max-height: 350px;
  box-shadow: ${boxShadowDefault};
  border-radius: 8px;
`

export const AddRatingSection = styled.div`
  width: 223px;
  height: 180px;
  position: absolute;
  border: 2px dashed ${borderGrey2};
  margin-top: 2px;
  border-radius: 10px;
  top: 4px;
  right: 34px;
  display: flex;
  align-items: center;
  justify-content: center;

  .add-rating-button {
    display: flex;
    flex-direction: column;
    align-items: center;
    cursor: pointer;
    background: white;
    padding: 20px;
    box-shadow: 0px 2px 4px ${boxShadowColor};
    border-radius: 4px;

    span:first-child {
      height: 30px;
      width: 30px;
      line-height: 29px;
      display: inline-block;
      text-align: center;
      border-radius: 50%;
      border: 1px solid ${themeColor};
      background: ${themeColor};
      color: ${white};
      font-size: ${(props) => props.theme.headerTitle};
      transition: all 0.35s ease-out;
      margin-bottom: 5px;
    }
    span:last-child {
      color: ${themeColor};
    }
    &:hover {
      span:first-child {
        background: ${white};
        color: ${themeColor};
      }
    }
  }
`

export const RatingContaner = styled.div`
  width: 270px;
  border-radius: 10px;
  margin: 2px
    ${({ className }) => (className === 'last-rating' ? '0px' : '15px')} 20px
    0px;
  height: 179px;
  display: inline-block;
  box-shadow: 0px 2px 5px ${boxShadowColor2};
  background: ${white};
  position: relative;

  > div:first-child {
    display: flex;
    position: relative;
    padding: 26px 14px 10px;
    justify-content: space-between;

    > span {
      display: flex;
      align-items: center;
      justify-content: center;
      flex-direction: column;

      span {
        letter-spacing: 0.22px;
        color: ${labelGrey2};
        text-transform: uppercase;
        font-size: ${(props) => props.theme.smallFontSize};
        font-weight: ${(props) => props.theme.semiBold};
        line-height: 30px;
      }

      .ant-input {
        height: 40px;
        font-size: ${(props) => props.theme.standardFont};
        text-align: center;
      }
    }

    > span:first-child {
      width: 55%;
    }
    > span:last-child {
      width: 43%;
      .ant-input {
        color: ${themeColorLighter};
      }
    }
  }
  > div:last-child {
    padding: 0px 14px 11px;
    position: relative;
    > div:first-child {
      background: ${backgroundGrey};
      > .fr-box {
        width: 242px;
        height: 92px;
        overflow-y: auto;
        .fr-view {
          padding: 7px;
          white-space: normal;
        }
      }
    }
  }
`

export const DeleteCriteria = styled.span`
  height: 40px;
  width: 45px;
  font-size: ${(props) => props.theme.questionTexthugeFontSize};
  padding: 1px 4px;
  color: ${white};
  background-color: ${deleteRed};
  cursor: pointer;
  box-shadow: 0px 2px 4px ${boxShadowColor};
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-left: 10px;
`

export const DuplicateCriteria = styled(DeleteCriteria)`
  width: 194px;
  font-size: ${(props) => props.theme.commentFontSize};
  text-transform: uppercase;
  font-weight: ${(props) => props.theme.semiBold};
  color: ${themeColor};
  background-color: ${white};
  transition: all 0.4s ease-in-out;
  i {
    font-size: ${(props) => props.theme.keyboardFontSize};
    margin-right: 20px;
  }
  &:hover {
    color: ${white};
    background: ${themeColor};
  }
`

export const DeleteRating = styled.span`
  position: absolute;
  display: inline-flex;
  align-items: center;
  top: 4px;
  right: 2px;
  z-index: 100;
  cursor: pointer;
  height: 18px;
  width: 18px;
  border-radius: 50%;
  transition: all 0.3s ease-in-out;
  &:hover {
    background: ${backgroundGrey};
  }
  i {
    font-size: ${(props) => props.theme.smallLinkFontSize};
  }
`

export const ExistingRubricContainer = styled(Col)``

export const SearchBar = styled(Input.Search)`
  margin-bottom: 20px;
  box-shadow: ${boxShadowDefault};
  border-radius: 5px;
  input {
    height: 43px;
    background: ${white};
    border: none;
    border-radius: 5px;
    &::placeholder {
      color: ${placeholderGray};
    }
  }
`

export const TableActionsContainer = styled.div`
  display: inline;
  float: right;
  visibility: hidden;
  span {
    margin: 0px 7px;
    font-size: ${(props) => props.theme.titleSecondarySectionFontSize};
    color: ${themeColor};
    cursor: pointer;
  }
`

export const StyledTable = styled(Table)`
  box-shadow: ${boxShadowDefault};
  .ant-table-content {
    .ant-table-body {
      .ant-table-thead {
        tr {
          th {
            font-weight: 600;
            background: ${lightGreySecondary};
            border: none;
          }
        }
      }
      .ant-table-tbody {
        .ant-table-row {
          td {
            padding: 12px 16px;
            font-weight: 500;
            border: none;
            background: ${white};
            border-bottom: 10px solid ${lightGreySecondary};
          }
          &:hover {
            td:last-child {
              > div {
                visibility: visible;
              }
            }
          }
        }
        tr:last-child {
          td {
            border-bottom: none;
          }
        }
      }
    }
  }
`

export const RubricDetailsContainer = styled.div`
  margin-bottom: 20px;
  > div:first-child {
    display: flex;
    justify-content: space-between;
    background: ${lightGrey3};
    align-items: center;
    margin-bottom: 5px;
    padding: 11px 15px;
    border-radius: 8px 8px 0px 0px;
  }
  > div:last-child {
    height: 140px;
    display: block;
    border: none;
    padding: 11px 15px;
    font-weight: 500;
    border-radius: 0px 0px 8px 8px;
    background: ${lightGrey3};
  }
`
export const ActionBarContainer = styled.div`
  margin-bottom: 70px;
  position: relative;
  > div:first-child {
    float: left;
    span {
      margin-left: 0px;
      i {
        margin-right: 20px;
      }
    }
  }
  > div:last-child {
    float: right;
  }
  > div {
    display: flex;
    flex-wrap: wrap;
    > span {
      color: ${themeColor};
      background: ${white};
      cursor: pointer;
      margin-left: 5px;
      height: 45px;
      width: 120px;
      display: flex;
      align-items: center;
      justify-content: center;
      text-transform: uppercase;
      font-size: ${(props) => props.theme.commentFontSize};
      line-height: ${(props) => props.theme.commentFontSize};
      letter-spacing: 0.2px;
      border-radius: 4px;
      font-weight: ${(props) => props.theme.semiBold};
      box-shadow: ${boxShadowDefault};
      transition: all 0.4s ease-in-out;
      i {
        font-size: ${(props) => props.theme.questionTexthugeFontSize};
        margin-right: 10px;
      }

      &:hover {
        color: ${white};
        background: ${themeColor};
      }
    }
  }
`

export const PaginationContainer = styled.div`
  width: 100%;
  text-align: right;
  margin-top: 15px;
  display: inline-block;
  .ant-pagination {
    &-next,
    &-prev {
      a {
        border: none;
        box-shadow: 0px 2px 8px 1px ${paginationBoxShadowColor};
        &:hover,
        &:focus {
          background: ${themeColor};
          color: ${white};
        }
      }
    }

    .ant-pagination-item {
      box-shadow: 0px 2px 8px 1px ${paginationBoxShadowColor};
      border: none;
      line-height: 35px;
      font-weight: 500;
      background: ${white};
      &:hover,
      &:focus {
        background: ${themeColor};
        a {
          color: ${white};
        }
      }
    }
    .ant-pagination-item-active {
      background: ${themeColor};
      a {
        color: ${white};
      }
    }
    .ant-pagination-disabled {
      box-shadow: 0px 2px 8px 1px ${paginationBoxShadowColor};
      border: none;
      line-height: 35px;
      a {
        border: none;
      }
      &:hover,
      &:focus {
        background: ${white};
        a {
          color: inherit;
          background: ${white};
        }
      }
    }
  }
`

export const RecentlyUsedContainer = styled.div`
  margin: 0px 0px 15px;
  > span:first-child {
    text-transform: uppercase;
    color: ${placeholderGray};
    margin-right: 5px;
  }
`

export const TagContainer = styled.span`
  display: inline-block;
`

export const RubricsTag = styled.span`
  padding: 2px 8px;
  border-radius: 4px;
  display: inline-block;
  background: ${themeColor};
  color: ${white};
  font-size: 12px;
  margin-right: 10px;
  font-weight: 500;
  cursor: pointer;
`
