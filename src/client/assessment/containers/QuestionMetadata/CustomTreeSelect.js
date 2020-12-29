import {
  extraDesktopWidthMax,
  greyThemeLight,
  greyThemeLighter,
} from '@edulastic/colors'
import PropTypes from 'prop-types'
import React, { useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import styled from 'styled-components'
import { SelectSuffixIcon } from './styled/SelectSuffixIcon'

const CustomTreeSelect = ({ bg, children, title, style }) => {
  const [dropdownStyle, setDropdownStyle] = useState(null)
  const wrapperRef = useRef()
  const titleRef = useRef()

  const handleClickOutside = (event) => {
    if (
      (event.target.className &&
        event.target.className.includes &&
        (event.target.className.includes('ant-select-dropdown-menu-item') ||
          event.target.className.includes('ant-select-dropdown-menu'))) ||
      (titleRef.current && titleRef.current.contains(event.target))
    ) {
      return
    }

    if (
      wrapperRef &&
      wrapperRef.current &&
      !wrapperRef.current.contains(event.target)
    ) {
      setDropdownStyle(null)
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }

  const handleClickTitle = () => {
    if (titleRef.current && !dropdownStyle) {
      const titleRect = titleRef.current.getBoundingClientRect()
      setDropdownStyle({
        width: titleRect.width,
        top: titleRect.top + titleRect.height,
        left: titleRect.left,
      })
      document.addEventListener('mousedown', handleClickOutside)
    } else if (dropdownStyle) {
      setDropdownStyle(null)
    }
  }

  return [
    <Title
      key="customTreeTitle"
      ref={titleRef}
      style={style}
      bg={bg}
      onClick={handleClickTitle}
    >
      <TextEllipsis title={title}>{title}</TextEllipsis>
      <SelectSuffixIcon type="caret-down" />
    </Title>,
    dropdownStyle &&
      createPortal(
        <DropdownWrapper ref={wrapperRef} key="customTreeDropdowns">
          <Main style={dropdownStyle}>{children}</Main>
        </DropdownWrapper>,
        document.body
      ),
  ]
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

const Title = styled.div`
  background: ${(props) => props.bg || greyThemeLighter};
  min-height: 40px;
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

const DropdownWrapper = styled.div`
  position: fixed;
  top: 0px;
  left: 0px;
  z-index: 1100;
`

const Main = styled.div`
  background: #fff;
  padding: 20px;
  border-radius: 5px;
  position: absolute;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);

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
