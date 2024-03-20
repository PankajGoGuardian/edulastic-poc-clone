import React from 'react'
import { FlexContainer } from '@edulastic/common'
import styled from 'styled-components'
import {
  FormItem,
  SearchInput,
  StyledForm,
  StyledIcon,
  StyledSearchBoxContainer,
  SubHeader,
} from '../styledComponents/searchBoxStyles'

const VideoLibrarySearchBox = ({
  searchString,
  disableSearchInput,
  handleOnSearch,
  handleOnChange,
  handleOnClear,
  hasError,
  isInvalidUrl,
}) => {
  const showErrorMessage = [hasError, isInvalidUrl].some((x) => x)
  const errorMessage = () => {
    if (searchString && showErrorMessage) {
      return `This link can't be played.`
    }
  }

  return (
    <StyledSearchBoxContainer>
      <FlexContainer
        marginLeft="130px"
        flexDirection="column"
        justifyContent="center"
        width="100%"
        maxWidth="320px"
        padding="28px 0px"
        height="108px"
      >
        <SubHeader>Search or Paste YouTube URL</SubHeader>
      </FlexContainer>
      <FlexContainer
        width="100%"
        justifyContent="flex-start"
        alignItems="center"
        height="108px"
      >
        <StyledForm colon={false}>
          <FormItem
            validateStatus={showErrorMessage ? 'error' : 'success'}
            help={errorMessage()}
          >
            <StyledSearchInput
              suffix={
                searchString?.length ? (
                  <StyledIcon
                    fontSize="16px"
                    style={{ fontSize: '16px', color: '#999999' }}
                    type="close-circle"
                    onClick={handleOnClear}
                    theme="filled"
                  />
                ) : null
              }
              placeholder="For Eg: Algebra"
              onChange={(e) => handleOnChange(e.target.value)}
              onPressEnter={(e) => handleOnSearch(e.target.value)}
              value={searchString}
              disabled={disableSearchInput}
              prefix={
                <StyledIcon
                  fontSize="16px"
                  style={{ fontSize: '16px', color: '#999999' }}
                  type="search"
                />
              }
            />
          </FormItem>
        </StyledForm>
      </FlexContainer>
    </StyledSearchBoxContainer>
  )
}

const StyledSearchInput = styled(SearchInput)`
  input::placeholder {
    padding-left: 8px;
    font-weight: bold;
    color: #999999;
  }
`

export default VideoLibrarySearchBox
