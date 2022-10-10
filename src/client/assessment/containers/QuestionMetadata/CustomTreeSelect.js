import {
  extraDesktopWidthMax,
  greyThemeLight,
  greyThemeLighter,
} from '@edulastic/colors'
import PropTypes from 'prop-types'
import React, { useEffect, useRef, useState } from 'react'
import styled from 'styled-components'
import { SelectSuffixIcon } from './styled/SelectSuffixIcon'

const CustomTreeSelect = ({ bg, children, title, style }) => {
  const [show, setShow] = useState(false)
  const wrapperRef = useRef()

  const handleClickOutside = (event) => {
    if (
      event.target.className &&
      event.target.className.includes &&
      (event.target.className.includes('ant-select-dropdown-menu-item') ||
        event.target.className.includes('ant-select-dropdown-menu'))
    ) {
      return
    }

    if (
      wrapperRef &&
      wrapperRef.current &&
      !wrapperRef.current.contains(event.target)
    ) {
      setShow(false)
    }
  }

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside)

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  return (
    <div ref={wrapperRef}>
      <Wrapper data-cy="selectStandards" style={style}>
        <Title bg={bg} onClick={() => setShow(!show)}>
          <TextEllipsis title={title}>{title}</TextEllipsis>
          <SelectSuffixIcon type="caret-down" aria-hidden="true" />
        </Title>
        {show && <Main>{children}</Main>}
      </Wrapper>
    </div>
  )
}

CustomTreeSelect.propTypes = {
  children: PropTypes.any.isRequired,
  title: PropTypes.string,
  style: PropTypes.object,
}

CustomTreeSelect.defaultProps = {
  title: '',
  style: {},
}

export default CustomTreeSelect

const Wrapper = styled.div`
  position: relative;
`

const Title = styled.div`
  background: ${(props) => props.bg || greyThemeLighter};
  min-height: 36px;
  border-radius: 2px;
  cursor: pointer;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 10px;
  border: 1px solid ${greyThemeLight};

  span {
    font-size: ${(props) => props.theme.smallFontSize};

    @media (min-width: ${extraDesktopWidthMax}) {
      font-size: ${(props) => props.theme.widgetOptions.labelFontSize};
    }
  }
`

const TextEllipsis = styled.span`
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  max-width: 100%;
`

const Main = styled.div`
  background: #fff;
  padding: 20px;
  border-radius: 5px;
  position: absolute;
  left: 0;
  top: 101%;
  width: 100%;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
  z-index: 1000;

  .ant-select-selection {
    color: ${(props) => props.theme.questionMetadata.textColor};
    background: ${(props) => props.theme.questionMetadata.containerBackground};
    border: 0;
    padding: 5px;
  }

  .select-label {
    margin-bottom: 5px;
  }
`
