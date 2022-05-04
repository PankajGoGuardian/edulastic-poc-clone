import styled, { css } from 'styled-components'
import {
  white,
  themeColor,
  mobileWidthMax,
  lightGreySecondary,
  secondaryTextColor,
  cardTitleColor,
  extraDesktopWidthMax,
  mediumDesktopExactWidth,
  smallDesktopWidth,
  borderGrey,
  greyThemeDark1,
  darkGrey2,
  lightFadedBlack,
  themeColorBlue,
} from '@edulastic/colors'
import { SelectInputStyled } from '@edulastic/common'
import { Button, Table, Select, Icon, Dropdown } from 'antd'
import { IconPlusCircle } from '@edulastic/icons'
import { ConfirmationModal } from '../../../src/components/common/ConfirmationModal'

export const OptionWrapper = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
`
export const SelectStyled = styled(SelectInputStyled)`
  .ant-select-selection__placeholder {
    color: ${secondaryTextColor};
  }
`
export const ClassCreateContainer = styled.div`
  width: 100%;
  justify-content: center;
  align-items: center;
  display: flex;
  flex-direction: column;
  height: 70vh;
`
export const ButtonsContainer = styled.div`
  display: flex;
  margin: 0.8rem;
  justify-content: space-between;
  @media (max-width: ${mobileWidthMax}) {
    flex-direction: column;
    align-items: center;
    margin: 0.5rem;
  }
`

export const IconEdit = styled(Icon)`
  color: ${themeColor};
  margin-left: 0.3rem;
  cursor: pointer;
`
export const IconQuestion = styled(Icon)`
  color: ${themeColor};
  padding: 0.2rem;
  font-size: 20px;
`
export const SyncClassDiv = styled.div`
  display: flex;
  justify-content: space-between;
  color: ${themeColor};
  font-size: 15px;
  cursor: pointer;
`
export const SyncImg = styled.img`
  width: 30px;
  height: 30px;
  border-radius: 50%;
`
export const ThemeButton = styled(Button)`
  display: flex;
  align-items: center;
  background-color: ${themeColor};
  color: ${white};
  font-size: 11px;
  margin-right: 0.5rem;
  border-radius: 4px;
  min-width: 234px;
  height: 45px;
  text-transform: uppercase;
  white-space: nowrap;
  font-style: 'Open Sans,SemiBold';
  &:hover,
  &:focus {
    background-color: ${white};
    color: ${themeColor};
  }
  & > span {
    width: 100%;
    text-align: center;
  }
  & > svg {
    margin-right: 5px;
  }
  @media (max-width: ${mobileWidthMax}) {
    width: 250px;
    margin-bottom: 10px;
  }
`

export const CreateIcon = styled(IconPlusCircle)`
  margin-right: 10px;
  width: 20px;
  height: 20px;
`

const ShareButtonStyle = css`
  font-weight: 600;
  font-size: 11px;
  border-radius: 4px;
  height: 36px;
  display: flex;

  @media (min-width: ${mediumDesktopExactWidth}) {
    height: 40px;
  }
`
export const CreateClassButton = styled(Button)`
  ${ShareButtonStyle}
  padding: 5px 20px;
  border-color: ${themeColor};
  text-transform: uppercase;
  color: ${themeColor};
  background: ${white};
  display: flex;
  align-items: center;
  &:hover {
    background: ${themeColor};
    color: ${white};
  }
`

const ResponsiveButton = styled(Button)`
  height: 36px;
  border-color: ${themeColorBlue};
  box-shadow: none;

  @media (min-width: ${mediumDesktopExactWidth}) {
    height: 40px;
  }
  @media (min-width: ${extraDesktopWidthMax}) {
    height: 45px;
  }
`

export const ClassStatusButton = styled(ResponsiveButton)`
  width: 180px;
  height: 36px;
  font-size: ${(props) => props.theme.smallFontSize};
  padding: 0px 20px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-weight: 600;
  svg {
    fill: ${themeColor};
  }
`

export const SyncButtons = styled(ResponsiveButton)`
  ${ShareButtonStyle}
  color: ${themeColor};
  padding: 5px 20px;
  background-color: ${white};
  margin-right: 15px;
  font-size: 11px;
  display: flex;
  align-items: center;
  justify: space-between;
  &:hover,
  &:focus {
    color: ${themeColor};
  }
  & > p {
    margin-left: 8px;
  }
`

export const ButtonsWrapper = styled.div`
  display: flex;
  align-items: right;
`
// main content

export const TableWrapper = styled.div`
  background: ${white};
`

// class select

export const ClassSelect = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  font-weight: bold;
  button {
    &:hover,
    &:focus {
      color: ${themeColorBlue};
    }
  }
`

export const ClassListTable = styled(Table)`
  margin-top: 20px;
  .ant-table {
    overflow: auto;
    &-thead {
      & > tr > th {
        border-bottom: none;
        font-weight: bold;
        font-size: 12px;
        text-transform: uppercase;
        color: ${cardTitleColor};
        background: white;
        &.ant-table-column-has-actions.ant-table-column-has-sorters:hover,
        & .ant-table-header-column .ant-table-column-sorters::before {
          background: ${white};
        }
        &.ant-table-column-has-actions.ant-table-column-has-filters
          &.ant-table-column-has-actions.ant-table-column-has-sorters {
          text-align: center;
        }
        .ant-table-column-sorters {
          display: flex;
          justify-content: center;

          .ant-table-column-sorter-inner {
            &.ant-table-column-sorter-inner-full {
              margin-top: 0em;
            }
            .ant-table-column-sorter {
              &-up,
              &-down {
                font-size: 10px;
              }
            }
          }
        }
        &:nth-last-of-type(-n + 2) {
          text-align: center;
        }
      }
    }
    &-tbody {
      & > tr {
        font-family: Open Sans, SemiBold;
        letter-spacing: 0.26px;
        color: ${secondaryTextColor};
        font-size: ${(props) => props.theme.manageClass.manageClassTdFontSize};
        cursor: pointer;
        border-bottom: 15px solid white;
        & > td {
          &.ant-table-column-sort {
            background: none;
          }
          font-weight: 550;
          padding: 10px 16px;
        }
        & > :nth-last-of-type(-n + 2) {
          text-align: center;
        }
        &:hover:not(.ant-table-expanded-row):not(.ant-table-row-selected) > td {
          background: #f2f3f2;
        }

        @media (max-width: ${smallDesktopWidth}) {
          font-size: 11px;
        }
      }
    }
  }
  .ant-table-pagination {
    padding-right: 55px;
  }
`

export const StyledSelect = styled(Select)`
  width: ${(props) => props.width || '100%'};
  .ant-select-selection {
    border-radius: 2px;
    border: 1px solid ${borderGrey};
    min-width: 100%;
    max-width: 100%;
    .ant-select-selection__choice {
      background: ${themeColor}33;
      border-radius: 5px;
      color: ${themeColor};
      font-weight: ${(props) => props.theme.semiBold};
      text-transform: uppercase;
      font-size: ${(props) => props.theme.tagFontSize};
      border: none;
      border-radius: 2px;
      i {
        color: ${themeColor};
      }
    }
  }
`

export const BannerDiv = styled.div`
  display: flex;
  width: 100%;
  margin-bottom: 10px;
  padding: 15px 15px;
  background-color: ${(props) =>
    props.syncClassLoading ? '#F5EE8B' : '#D3FEA6'};
  color: ${(props) => (props.syncClassLoading ? '#B5AA08' : '#77B833')};
  justify-content: center;
  border-radius: 10px;
`

export const FlexContainer = styled.div`
  display: flex;
  flex-direction: column;
`

export const Tags = styled.p`
  max-width: 120px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`

export const SubHeader = styled.div`
  display: flex;
  justify-content: flex-end;
  align-items: center;
`

export const ClassListModal = styled(ConfirmationModal)`
  min-width: 85%;
  .ant-modal-content {
    border-radius: 10px;
    padding: 30px 45px 45px 50px;
    .ant-modal-close {
      display: none;
    }
    .ant-modal-header {
      padding: 0px;
      margin-bottom: 40px;
      border: none;
      .ant-modal-title {
        > div {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 30px;
          span {
            color: ${greyThemeDark1};
            font-size: 22px;
            font-weight: 700;
            line-height: 30px;
          }
        }
        p {
          color: ${darkGrey2};
          font-size: 14px;
          font-weight: 600;
          line-height: 19px;
        }
      }
    }
    .ant-modal-body {
      min-height: 100px;
      border-radius: 10px;
      padding: 15px 10px 20px 10px;
      margin-bottom: 40px;
      .ant-spin {
        padding-top: 65px;
      }
    }
    .ant-modal-footer {
      padding: 0px;
      .ant-btn {
        width: 200px;
        height: 40px;
        border-radius: 4px;
        font-size: ${(props) => props.theme.linkFontSize};
      }
    }
  }

  @media (max-width: ${smallDesktopWidth}) {
    min-width: 90%;
  }
`

export const ModalClassListTable = styled(Table)`
  width: 100%;
  .ant-table {
    .ant-table-content {
      .ant-table-body {
        min-height: auto;
        table {
          border: none;
          .ant-table-thead {
            tr {
              background: ${white};
              th {
                border: none;
                background: ${white};
                padding: 5px 10px 25px 10px;
                .ant-table-column-title {
                  white-space: nowrap;
                  font-size: ${(props) => props.theme.smallFontSize};
                }
              }
            }
          }
          .ant-table-tbody {
            border-collapse: collapse;
            tr {
              border-bottom: 11px solid ${white};
              td {
                border: none;
                padding: 5px 10px;
                background: ${lightGreySecondary};
                &.ant-table-selection-column {
                  background: ${white};
                }
              }
              td:nth-child(2) {
                padding-left: 15px;
              }
              td:last-child {
                padding-right: 15px;
              }
              .ant-checkbox-checked.ant-checkbox-disabled {
                .ant-checkbox-inner {
                  background-color: ${lightFadedBlack};
                  &:after {
                    border-color: ${lightGreySecondary};
                  }
                }
              }
            }
          }
        }
      }
      .ant-table-placeholder {
        border: none;
      }
    }
  }

  @media (max-width: ${smallDesktopWidth}) {
    .ant-table {
      .ant-table-content {
        .ant-table-body {
          table {
            .ant-table-thead {
              th {
                .ant-table-column-title {
                  font-size: ${(props) => props.theme.linkFontSize};
                }
              }
            }
            .ant-table-tbody {
              tr {
                border-bottom: 10px solid ${white};
              }
              td {
                border: none;
                padding: 6px;
                background: ${lightGreySecondary};
                &.ant-table-selection-column {
                  background: ${white};
                }
              }
            }
          }
          .ant-input,
          .ant-select-selection {
            font-size: ${(props) => props.theme.linkFontSize};
            .ant-select-selection__choice {
              font-weight: ${(props) => props.theme.semiBold};
              font-size: ${(props) => props.theme.tagFontSize};
            }
          }
        }
      }
    }
  }
`

export const ClassStatusDropdown = styled(Dropdown)`
  height: 30px;
`

export const InstitutionSelectWrapper = styled.div`
  margin-top: 10px;
  > label {
    font-size: 15px;
    margin-right: 10px;
    display: inline-block;
  }
  .ant-select-selection {
    > .ant-select-arrow {
      font-size: unset !important;
    }
  }
`
export const IconWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  svg {
    margin: 0 8px;
  }
`
