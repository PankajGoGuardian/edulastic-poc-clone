import {
  extraDesktopWidthMax,
  mediumDesktopExactWidth,
  tabletWidth,
  smallDesktopWidth,
  mobileWidthLarge,
  middleMobileWidth,
  smallMobileWidth,
  mobileWidthMax,
  extraDesktopWidth,
} from '@edulastic/colors'
import { MenuIcon, TextInputOnFocusStyled } from '@edulastic/common'
import { Affix } from 'antd'
import { PropTypes } from 'prop-types'
import React, { useState } from 'react'
import { connect } from 'react-redux'
import { compose } from 'redux'
import styled, { css } from 'styled-components'
import { IconPencilEdit } from '@edulastic/icons'
import { toggleSideBarAction } from '../../../../src/client/author/src/actions/toggleMenu'

const MainHeader = ({
  children,
  headingText,
  titleText,
  Icon,
  toggleSideBar,
  titleMarginTop,
  containerClassName,
  headerLeftClassName,
  hasTestId,
  isInModal,
  isEditable = false,
  onTitleChange,
  ...restProps
}) => {
  const title = titleText || headingText
  const [showPencil, setShowPencil] = useState(true)

  return (
    <HeaderWrapper hasTestId={hasTestId} {...restProps}>
      <Affix
        className="fixed-header"
        style={{ position: isInModal ? 'absolute' : 'fixed', top: 0, right: 0 }}
      >
        <Container
          className={containerClassName}
          isInModal={isInModal}
          {...restProps}
        >
          <MenuIcon className="hamburger" onClick={() => toggleSideBar()} />
          {(isEditable || headingText) && (
            <HeaderLeftContainer
              className={headerLeftClassName}
              headingText={headingText}
              {...restProps}
              mt={titleMarginTop}
              data-cy="header-left-container"
            >
              {Icon && (
                <TitleIcon>
                  <Icon />
                </TitleIcon>
              )}
              {isEditable ? (
                <EditableTitleWrapper>
                  <EditableSizedWrapper length={title?.length || 0}>
                    <TextInputOnFocusStyled
                      showArrow
                      value={title}
                      data-cy="testname-header"
                      onChange={(e) => onTitleChange(e.target.value)}
                      size="large"
                      placeholder="Untitled Test"
                      margin="0px"
                      fontSize="18px"
                      onFocus={(event) => {
                        event.target.select()
                        setShowPencil(false)
                      }}
                      onBlur={() => setShowPencil(true)}
                      style={{
                        padding: '6px 12px',
                      }}
                    />
                  </EditableSizedWrapper>
                  {showPencil && <IconPencilEdit />}
                  {restProps.headingSubContent}
                </EditableTitleWrapper>
              ) : (
                <>
                  <TitleWrapper {...restProps} title={title} data-cy="title">
                    {headingText}
                  </TitleWrapper>
                  {restProps.headingSubContent}
                </>
              )}
            </HeaderLeftContainer>
          )}
          {children}
        </Container>
      </Affix>
    </HeaderWrapper>
  )
}

MainHeader.propTypes = {
  children: PropTypes.any.isRequired,
  toggleSideBar: PropTypes.func.isRequired,
  headingText: PropTypes.string.isRequired,
  Icon: PropTypes.any.isRequired,
  t: PropTypes.any.isRequired,
}

const enhance = compose(
  connect(null, {
    toggleSideBar: toggleSideBarAction,
  })
)

export default enhance(MainHeader)

const HeaderWrapper = styled.div`
  padding-top: ${(props) => props.height || props.theme.HeaderHeight?.md}px;

  .ant-dropdown {
    /* the div hiding this has z-index 999 */
    z-index: 1000;
  }
  .fixed-header {
    position: fixed;
    top: 0;
    right: 0;
    left: ${({ hideSideMenu }) => (hideSideMenu ? '0' : '70px')};
    z-index: 999;
  }
  .tabAlignment {
    & > div {
      flex: ${(props) => (props.hasTestId ? '' : 1)};
    }
  }
  @media (max-width: ${mobileWidthLarge}) {
    .fixed-header {
      left: 0;
    }
  }

  @media (min-width: ${mediumDesktopExactWidth}) {
    padding-top: ${(props) => props.height || props.theme.HeaderHeight?.md}px;
  }
  @media (min-width: ${extraDesktopWidthMax}) {
    padding-top: ${(props) => props.height || props.theme.HeaderHeight?.xl}px;
  }
  @media (max-width: ${smallDesktopWidth}) {
    padding-top: ${(props) => props.theme.HeaderHeight?.sd}px;
  }
  @media (max-width: ${mobileWidthLarge}) {
    height: ${(props) => props.theme.HeaderHeight?.xs}px;
    flex-wrap: wrap;
  }
  @media print {
    padding-top: 0px;
  }
`

const Container = styled.div`
  padding: 0px 30px;
  background: ${(props) => props.theme.header?.headerBgColor};
  display: ${(props) => props.display || 'flex'};
  justify-content: ${(props) => props.justify || 'space-between'};
  align-items: ${(props) => props.align || 'center'};
  border-bottom: 1px solid #2f4151;
  height: ${(props) => props.height || props.theme.HeaderHeight?.md}px;
  border-radius: ${({ isInModal }) => (isInModal ? '10px 10px 0px 0px' : '')};

  @media (min-width: ${extraDesktopWidthMax}) {
    height: ${(props) => props.height || props.theme.HeaderHeight?.xl}px;
  }
  @media (min-width: ${mediumDesktopExactWidth}) {
    height: ${(props) => props.height || props.theme.HeaderHeight?.md}px;
  }
  @media (max-width: ${smallDesktopWidth}) {
    height: ${(props) => props.theme.HeaderHeight?.sd}px;
  }
  @media (max-width: ${mobileWidthLarge}) {
    height: ${(props) =>
      props.mobileHeaderHeight || props.theme.HeaderHeight?.xs}px;
    flex-wrap: wrap;
  }
`

export const HeaderLeftContainer = styled.div`
  display: ${(props) => props.display || 'flex'};
  align-items: ${(props) => props.alignItems || 'center'};
  &:not(.headerLeftWrapper) {
    justify-content: ${(props) => props.justifyContent || 'space-evenly'};
  }
  flex-direction: ${(props) => props.flexDirection || 'row'};
  flex-wrap: ${(props) => props.flexWrap || ''};
  width: ${(props) => props.width || 'auto'};
  margin-top: ${({ mt }) => mt};

  @media (max-width: ${tabletWidth}) {
    margin-left: 8px;
    display: ${(props) => (!props.headingText ? 'none' : '')};
  }
`

export const TitleWrapper = styled.h1`
  font-size: 18px;
  color: ${(props) => props.theme.header?.headerTitleTextColor};
  font-weight: bold;
  line-height: normal;
  min-width: auto;
  margin: 0px;
  white-space: nowrap;
  max-width: ${(props) =>
    props.noEllipsis ? 'unset' : props.titleMaxWidth || '352px'};
  overflow: hidden;
  letter-spacing: 0.9px;
  text-overflow: ellipsis;

  @media (min-width: ${mediumDesktopExactWidth}) {
    font-size: ${(props) => props.theme.header?.headerTitleFontSize};
    min-width: ${(props) => props.titleMinWidth || '200px'};
  }
  @media (max-width: ${smallDesktopWidth}) {
    font-size: 14px;
    max-width: 14rem;
  }
  @media (max-width: ${middleMobileWidth}) {
    max-width: 10rem;
  }
  @media (max-width: ${smallMobileWidth}) {
    max-width: 7rem;
  }
  ${(props) =>
    props.hasSections &&
    css`
      min-width: auto !important;
      max-width: 16rem;
      @media (max-width: ${extraDesktopWidthMax}) {
        max-width: 8rem;
      }
      @media (max-width: ${extraDesktopWidth}) {
        max-width: 4rem;
      }
      @media (max-width: ${smallDesktopWidth}) {
        max-width: 8rem;
      }
    `}
`

const TitleIcon = styled.span`
  display: flex;
  align-items: center;
  margin-right: 15px;
  svg {
    fill: ${(props) => props.theme.header?.headerTitleTextColor};
  }

  @media (max-width: ${smallDesktopWidth}) {
    svg {
      width: 16px;
      height: 16px;
    }
  }

  @media (max-width: ${tabletWidth}) {
    display: none;
  }
`

export const HeaderMidContainer = styled.div`
  align-self: flex-end;
  @media (max-width: ${mobileWidthMax}) {
    display: none;
  }
`

const EditableTitleWrapper = styled.div`
  width: 300px;
  display: flex;
  align-items: center;
  fontsize: 18px;
`

const EditableSizedWrapper = styled.div`
  width: calc(${(props) => (props.length || 0) + 1}ch + 32px);
  min-width: calc(${'Untitled Test'.length}ch + 32px);
  margin-right: 8px;
  box-sizing: border-box;
`
