import React from 'react'
import { FlexContainer } from '@edulastic/common'
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
  hasError,
}) => {
  const errorMessage = () => {
    if (searchString && hasError) {
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
        maxWidth="400px"
        padding="28px 0px"
        height="108px"
      >
        <SubHeader>Search or Paste Youtube URL</SubHeader>
      </FlexContainer>
      <FlexContainer
        width="100%"
        justifyContent="flex-start"
        alignItems="center"
        height="108px"
      >
        <StyledForm colon={false}>
          <FormItem
            validateStatus={hasError ? 'error' : 'success'}
            help={errorMessage()}
          >
            <SearchInput
              allowClear
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

export default VideoLibrarySearchBox
