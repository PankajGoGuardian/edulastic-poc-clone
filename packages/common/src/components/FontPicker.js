import React, { useState, useEffect, useRef } from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import { List, Popover, Input } from "antd";
import { isEqual } from "lodash";
import { white, themeColor } from "@edulastic/colors";
import { IconSearch } from "@edulastic/icons";

const { Item } = List;

export const fonts = [
  { fontFamily: "'Roboto', sans-serif", name: "Roboto" },
  { fontFamily: "'Roboto Mono', monospace", name: "Roboto Mono" },
  { fontFamily: "'Roboto Slab', serif", name: "Roboto Slab" },
  { fontFamily: "'Lato', sans-serif", name: "Lato" },
  { fontFamily: "'Montserrat', sans-serif", name: "Montserrat" },
  { fontFamily: "'Kaushan Script', cursive", name: "Kaushan Script" },
  { fontFamily: "'Roboto Condensed', sans-serif", name: "Roboto Condensed" },
  { fontFamily: "'Oswald', sans-serif", name: "Oswald" },
  { fontFamily: "'Raleway', sans-serif", name: "Raleway" },
  { fontFamily: "'Great Vibes', cursive", name: "Great Vibes" },
  { fontFamily: "'Poppins', sans-serif", name: "Poppins" },
  { fontFamily: "'Caveat', cursive", name: "Caveat" },
  { fontFamily: "'Alfa Slab One', cursive", name: "Alfa Slab One" },
  { fontFamily: "'Noto Sans', sans-serif", name: "Noto Sans" },
  { fontFamily: "'Merriweather', serif", name: "Merriweather" },
  { fontFamily: "'PT Sans', sans-serif", name: "PT Sans" },
  { fontFamily: "'Ubuntu', sans-serif", name: "Ubuntu" },
  { fontFamily: "'Parisienne', cursive", name: "Parisienne" },
  { fontFamily: "'Playfair Display', serif", name: "Playfair Display" },
  { fontFamily: "'Muli', sans-serif", name: "Muli" },
  { fontFamily: "'Shadows Into Light', cursive", name: "Shadows Into Light" },
  { fontFamily: "'PT Serif', serif", name: "PT Serif" },
  { fontFamily: "'Lora', serif", name: "Lora" },
  { fontFamily: "'Satisfy', cursive", name: "Satisfy" },
  { fontFamily: "'Sacramento', cursive", name: "Sacramento" },
  { fontFamily: "'Dancing Script', cursive", name: "Dancing Script" },
  { fontFamily: "'Nunito', sans-serif", name: "Nunito" },
  { fontFamily: "'Slabo 27px', serif", name: "Slabo 27px" },
  { fontFamily: "'Fira Sans', sans-serif", name: "Fira Sans" },
  { fontFamily: "'Noto Sans JP', sans-serif", name: "Noto Sans JP" },
  { fontFamily: "'Rubik', sans-serif", name: "Rubik" },
  { fontFamily: "'Titillium Web', sans-serif", name: "Titillium Web" },
  { fontFamily: "'Noto Serif', serif", name: "Noto Serif" },
  { fontFamily: "'Work Sans', sans-serif", name: "Work Sans" },
  { fontFamily: "'Nanum Gothic', sans-serif", name: "Nanum Gothic" },
  { fontFamily: "'Noto Sans KR', sans-serif", name: "Noto Sans KR" },
  { fontFamily: "'Pacifico', cursive", name: "Pacifico" },
  { fontFamily: "'Arimo', sans-serif", name: "Arimo" },
  { fontFamily: "'PT Sans Narrow', sans-serif", name: "PT Sans Narrow" },
  { fontFamily: "'Anton', sans-serif", name: "Anton" }
];

const FontPicker = ({ onChange, currentFont }) => {
  const [open, toggleOpen] = useState(false);
  const [activeItem, setActiveItem] = useState({});
  const [fontName, setFontName] = useState("");
  const containerRef = useRef();

  const toggleFontPickerContent = () => toggleOpen(!open);

  const clickOutside = ({ target }) => {
    if (containerRef.current && !containerRef.current.contains(target)) {
      toggleOpen(false);
    }
  };

  const onClickItem = item => () => {
    onChange(item.fontFamily);
    toggleFontPickerContent();
  };

  const searchFont = e => {
    setFontName(e.target.value);
  };

  const fitlerd = fonts.filter(item => item.name.search(new RegExp(fontName, "gi")) !== -1);

  const buttonLabel = activeItem?.name?.charAt(0) || "t";

  const handleKeyUp = e => {
    if (e.key === "Enter") {
      onChange(fitlerd[0]?.fontFamily);
      toggleFontPickerContent();
    }
  };

  const fontItem = item => (
    <Item onClick={onClickItem(item)} className={isEqual(item, activeItem) ? "active-list-item" : ""}>
      <span style={{ fontFamily: item.fontFamily }}>{item.name}</span>
    </Item>
  );

  const content = (
    <FontPickerContent>
      <SearchBox
        autoFocus
        value={fontName}
        onChange={searchFont}
        onKeyUp={handleKeyUp}
        suffix={<IconSearch color={themeColor} />}
        placeholder="Search a font"
      />
      <FontList size="small" dataSource={fitlerd} renderItem={fontItem} />
    </FontPickerContent>
  );

  useEffect(() => {
    if (open) {
      document.addEventListener("mousedown", clickOutside);
    } else {
      document.removeEventListener("mousedown", clickOutside);
    }
  }, [open]);

  useEffect(() => {
    if (currentFont) {
      setActiveItem(fonts.find(ite => ite.fontFamily === currentFont) || {});
    }
  }, [currentFont]);

  return (
    <Block>
      <Label>Font</Label>
      <PopoverContainer ref={containerRef}>
        <Popover
          placement="rightTop"
          content={content}
          visible={open}
          getPopupContainer={triggerNode => triggerNode.parentNode}
        >
          <FontButton
            style={{ fontFamily: activeItem ? activeItem.fontFamily : null }}
            onClick={toggleFontPickerContent}
          >
            {buttonLabel}
          </FontButton>
        </Popover>
      </PopoverContainer>
    </Block>
  );
};

FontPicker.propTypes = {
  onChange: PropTypes.func.isRequired,
  currentFont: PropTypes.string.isRequired
};

export default FontPicker;

const PopoverContainer = styled.div`
  & .ant-popover-content {
    margin-top: 0px;
  }
  & .ant-popover-arrow {
    display: block;
  }
  & .ant-popover-inner-content {
    padding: 0px;
  }
`;

const FontButton = styled.div`
  width: 30px;
  height: 30px;
  border-radius: 4px;
  background-color: ${white};
  font-weight: 600;
  font-size: large;
  display: flex;
  justify-content: center;
  align-items: center;
  text-transform: uppercase;
  cursor: pointer;
`;

const FontPickerContent = styled.div`
  width: 300px;
`;

const SearchBox = styled(Input)`
  & .ant-input {
    width: 100%;
    border: 0px;
    height: 38px;
  }
`;

const FontList = styled(List)`
  width: 100%;
  height: 232px;
  overflow-x: hidden;
  overflow-y: auto;
  & .ant-list-item {
    border: 0px;
    padding: 8px 16px;
    font-weight: 700;
    user-select: none;

    &.active-list-item,
    :hover {
      background-color: ${themeColor};
      color: ${white};
    }
  }
`;

const Block = styled.div`
  margin-bottom: 4px;
`;

const Label = styled.div`
  font-weight: 600;
  font-size: 11px;
  color: ${white};
  margin-bottom: 4px;
  text-align: center;
  white-space: nowrap;
`;
