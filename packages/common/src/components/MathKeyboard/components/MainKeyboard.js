import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import styled, { css } from "styled-components";
import chunk from "lodash/chunk";
import cloneDeep from "lodash/cloneDeep";
import { white, darkGrey } from "@edulastic/colors";

const limitButtons = 18;
const MainKeyboard = ({ btns, onInput, fullKeybord }) => {
  const [btnRows, updateRows] = useState([]);
  const [showMore, updateShowMore] = useState(false);
  const numOfKeys = btns.length;

  useEffect(() => {
    const keybuttons = cloneDeep(btns);

    let keysPerRow = 4;
    if (numOfKeys > 12 && numOfKeys <= 15) {
      keysPerRow = 5;
    }
    if (numOfKeys > 15) {
      keysPerRow = 6;
    }

    if (fullKeybord) {
      keysPerRow = 6;
    }

    if (numOfKeys > limitButtons && !showMore) {
      keybuttons.splice(limitButtons, numOfKeys - limitButtons + 1);
    }
    const rows = chunk(keybuttons, keysPerRow);
    updateRows(rows);
  }, [btns, showMore]);

  const handleExpend = () => {
    updateShowMore(!showMore);
  };

  const handleClick = (handler, command) => () => {
    if (handler && command) {
      onInput(handler, command);
    }
  };

  return (
    <Wrapper>
      {btnRows.map((row, rowIndex) => (
        <Row key={rowIndex} data-cy={`button-row-${rowIndex}`}>
          {row.map(({ label, handler, command = "cmd" }, i) => {
            let fontRate = 1;
            if (typeof label === "string" && label.length > 4) {
              fontRate = 4.5 / label.length;
            }

            return (
              <Button
                key={i}
                fontSizeRate={fontRate}
                onClick={handleClick(handler, command)}
                data-cy={`virtual-keyboard-${handler}`}
              >
                <Label>{label}</Label>
              </Button>
            );
          })}
        </Row>
      ))}
      {numOfKeys > limitButtons && <Row showMore={showMore} isExpendRow onClick={handleExpend} />}
    </Wrapper>
  );
};

MainKeyboard.propTypes = {
  btns: PropTypes.array.isRequired,
  onInput: PropTypes.func.isRequired,
  fullKeybord: PropTypes.bool
};

MainKeyboard.defaultProps = {
  fullKeybord: false
};

export default MainKeyboard;

const Wrapper = styled.div`
  display: flex;
  flex-wrap: wrap;
  flex-direction: column;
`;

const expendRowStyle = css`
  position: relative;
  cursor: pointer;
  min-height: 6px;
  background: transparent;

  &::after {
    content: "";
    position: absolute;
    border: 6px solid;
    border-right-color: transparent;
    border-left-color: transparent;
    left: calc(50% - 6px);

    ${({ showMore }) => {
      if (showMore) {
        return `
          border-top-color: transparent;
          border-bottom-color: ${darkGrey};
          top: -6px;    
        `;
      }
      return `
        border-top-color: ${darkGrey};
        border-bottom-color: transparent;
        top: 0px;
      `;
    }}
  }
`;

const Row = styled.div`
  display: flex;
  margin-bottom: 10px;
  ${({ isExpendRow }) => isExpendRow && expendRowStyle}
  &:last-child {
    margin-bottom: 0px;
  }
`;

const Button = styled.div`
  width: 50px;
  height: 50px;
  display: flex;
  justify-content: center;
  align-items: center;
  border: 1px solid #8d98a7;
  background: ${white};
  border-radius: 10px;
  margin-right: 10px;
  font-size: ${props => {
    const fontSize = parseInt(props.theme.mathKeyboard.numFontSize, 10) * props.fontSizeRate;
    return `${fontSize}px !important`;
  }};
  font-weight: ${props => props.theme.mathKeyboard.numFontWeight};
  box-shadow: 0px 1px 4px 0px rgba(0, 0, 0, 0.5);
  user-select: none;
  cursor: pointer;
  &:last-child {
    margin-right: 0px;
  }
  &:hover {
    background: rgba(0, 0, 0, 0.08);
  }
  &:active {
    box-shadow: none;
  }
`;

const Label = styled.span`
  white-space: nowrap;
  line-height: 1;
`;
