import styled from 'styled-components'
import Input from "antd/es/Input";
import Select from "antd/es/Select";
import { IconUsers, IconEdit } from '@edulastic/icons'
import {
  darkGrey,
  themeColor,
  lightGreySecondary,
  inputBorder,
  white,
} from '@edulastic/colors'

export const UsersIcon = styled(IconUsers)`
  height: 25px;
  width: 28px;
`

export const EditIcon = styled(IconEdit)`
  height: 16px;
  width: 16px;
`
export const EditIconWrapper = styled.span`
  margin-left: 10px;
  cursor: pointer;
  svg {
    fill: ${themeColor};
  }
`

export const Wrapper = styled.div`
  padding: 15px;
  tr {
    .member-name {
      > span {
        display: inline-block;
        &:first-child {
          width: 60%;
        }
      }
      .admin-tag {
        background: ${themeColor};
        color: ${white};
        font-size: 11px;
        padding: 3px 5px;
        border-radius: 5px;
        text-transform: uppercase;
        font-weight: 500;
      }
    }
    .table-action {
      display: none;
    }
    &:hover {
      .table-action {
        display: block;
        svg {
          fill: ${themeColor};
        }
      }
    }
  }
`

export const ActionsContainer = styled.div`
  display: flex;
`

export const Search = styled(Input.Search)`
  margin-right: 15px;
  > input {
    background: ${lightGreySecondary};
    ::placeholder {
      color: ${darkGrey};
    }
  }
`

export const StyledSelect = styled(Select)`
  width: ${({ width }) => width};
  .ant-select-selection {
    background: ${lightGreySecondary};
  }
  .ant-select-selection__rendered {
    line-height: 34px;
    .ant-select-selection__placeholder {
      color: ${darkGrey};
    }
  }
`
export const ModalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  > span {
    margin-right: 20px;
    &:first-child {
      font-weight: 600;
    }
    &:last-child {
      color: ${darkGrey};
      > span {
        color: ${themeColor};
        font-weight: 600;
      }
    }
  }
`
export const FiltersContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  > div {
    display: flex;
    flex-direction: column;
    margin-right: 10px;
    > label {
      font-size: 12px;
      font-weight: 600;
    }
  }
  > span {
    align-items: center;
    line-height: 35px;
    margin-top: 18px;
    cursor: pointer;
    color: ${themeColor};
  }
`
export const UsersContainer = styled.div`
  margin: 10px 0px;
  > div {
    &:last-child {
      max-height: 250px;
      min-height: 150px;
      overflow: auto;
      margin: 10px 0px;
      background: ${lightGreySecondary};
      border: 1px solid ${inputBorder};
      border-radius: 4px;
      position: relative;
      &::-webkit-scrollbar {
        width: 8px;
      }

      &::-webkit-scrollbar-track + {
        border-radius: 4px;
      }

      &::-webkit-scrollbar-thumb {
        border-radius: 4px;
        background: ${inputBorder};
        &:hover {
          background: ${darkGrey};
          cursor: pointer;
        }
      }
      .ant-checkbox-wrapper {
        display: block;
        margin: 10px;
      }
    }
  }
`

export const ModalFooter = styled.div`
  display: flex;
  justify-content: flex-end;
`

export const GroupsContainer = styled.div`
  .ant-table-body {
    overflow-y: auto;
    max-height: 200px;

    &::-webkit-scrollbar {
      width: 8px;
    }

    &::-webkit-scrollbar-track + {
      border-radius: 4px;
    }

    &::-webkit-scrollbar-thumb {
      border-radius: 4px;
      background: ${inputBorder};
      &:hover {
        background: ${darkGrey};
        cursor: pointer;
      }
    }
  }
  .ant-table-hide-scrollbar {
    margin-bottom: -20px !important;
    background: ${white};
  }
`
