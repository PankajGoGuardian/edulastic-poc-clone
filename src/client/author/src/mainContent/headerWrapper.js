import React, { memo, Component, Fragment } from 'react'
import styled from 'styled-components'
import PropTypes from 'prop-types'
import {
  desktopWidth,
  mediumDesktopExactWidth,
  extraDesktopWidthMax,
} from '@edulastic/colors'
import Affix from "antd/es/affix";

class HeaderWrapper extends Component {
  render = () => {
    const { children, type, justify } = this.props

    return (
      <HeaderContainer type={type}>
        <Affix
          className="fixed-header"
          style={{ position: 'fixed', top: 0, right: 0 }}
        >
          <Container justify={justify} type={type}>
            {children}
          </Container>
        </Affix>
      </HeaderContainer>
    )
  }
}

HeaderWrapper.propTypes = {
  children: PropTypes.node.isRequired,
  type: PropTypes.string,
}

HeaderWrapper.defaultProps = {
  type: 'default',
}

export default memo(HeaderWrapper)

const HeaderContainer = styled.div`
  padding-top: ${(props) =>
    props.type === 'standard' ? '121' : props.theme.HeaderHeight.xs}px;

  @media (min-width: ${mediumDesktopExactWidth}) {
    padding-top: ${(props) => props.theme.HeaderHeight.md}px;
  }
  @media (min-width: ${extraDesktopWidthMax}) {
    padding-top: ${(props) => props.theme.HeaderHeight.xl}px;
  }
  @media print {
    padding-top: 0px;
  }
`

const Container = styled.div`
  height: ${(props) => props.theme.HeaderHeight.xs}px;
  padding: 0px 30px;
  background: ${(props) => props.theme.header.headerBgColor};
  display: flex;
  justify-content: ${({ justify }) => justify || 'space-between'};
  align-items: center;

  @media (min-width: ${mediumDesktopExactWidth}) {
    height: ${(props) => props.theme.HeaderHeight.md}px;
  }
  @media (min-width: ${extraDesktopWidthMax}) {
    height: ${(props) => props.theme.HeaderHeight.xl}px;
  }
  @media (max-width: ${desktopWidth}) {
    padding: 0px 20px;
  }
`
