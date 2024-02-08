import React from 'react'
import { FlexContainer } from '@edulastic/common'
import IconYoutube from '@edulastic/icons/src/IconYoutube'
import IconVimeo from '@edulastic/icons/src/IconVimeo'
import IconDailyMotion from '@edulastic/icons/src/IconDailyMotion'
import IconWistia from '@edulastic/icons/src/IconWistia'

import {
  FooterText,
  FooterWrapper,
  FormItem,
  SearchInput,
  StyledForm,
  StyledIcon,
  StyledSearchBoxContainer,
  SubHeader,
  VideoStreamingProviders,
} from '../styledComponents/searchBoxStyles'

const VideoLibrarySearchBox = ({
  linkValue,
  disableSearchInput,
  handleOnChange,
  handleOnSearch,
  hasError,
}) => {
  const errorMessage = () => {
    if (hasError) {
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
        <SubHeader>Search YouTube/ Paste Video URL</SubHeader>
        <VideoStreamingProviders justifyContent="flex-start">
          <FooterWrapper>
            <FlexContainer mr="0.5rem" alignItems="center">
              <FooterText>Support</FooterText>
            </FlexContainer>
            <FlexContainer mr="0.5rem" alignItems="center">
              <IconYoutube />
            </FlexContainer>
            <FlexContainer mr="0.5rem" alignItems="center">
              <IconVimeo />
            </FlexContainer>
            <FlexContainer mr="0.5rem" alignItems="center">
              <IconWistia />
            </FlexContainer>
            <FlexContainer mr="0.5rem" alignItems="center">
              <IconDailyMotion />
            </FlexContainer>
          </FooterWrapper>
        </VideoStreamingProviders>
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
              value={linkValue}
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
