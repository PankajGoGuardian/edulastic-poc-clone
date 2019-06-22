import React, { useState, useEffect, useRef } from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import { SelectSuffixIcon } from "./styled/SelectSuffixIcon";

const CustomTreeSelect = ({ children, title, style }) => {
  const [show, setShow] = useState(false);
  const wrapperRef = useRef();

  const handleClickOutside = event => {
    if (
      event.target.className &&
      event.target.className.includes &&
      (event.target.className.includes("ant-select-dropdown-menu-item") ||
        event.target.className.includes("ant-select-dropdown-menu"))
    ) {
      return;
    }

    if (wrapperRef && wrapperRef.current && !wrapperRef.current.contains(event.target)) {
      setShow(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div ref={wrapperRef}>
      <Wrapper style={style}>
        <Title onClick={() => setShow(!show)}>
          <span>{title}</span>
          <SelectSuffixIcon type="caret-down" />
        </Title>
        {show && <Main>{children}</Main>}
      </Wrapper>
    </div>
  );
};

CustomTreeSelect.propTypes = {
  children: PropTypes.any.isRequired,
  title: PropTypes.string,
  style: PropTypes.object
};

CustomTreeSelect.defaultProps = {
  title: "",
  style: {}
};

export default CustomTreeSelect;

const Wrapper = styled.div`
  position: relative;
`;

const Title = styled.div`
  background: #fff;
  min-height: 40px;
  border-radius: 5px;
  cursor: pointer;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 10px;
`;

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
    color: ${props => props.theme.questionMetadata.textColor};
    background: ${props => props.theme.questionMetadata.containerBackground};
    border: 0;
    padding: 5px;
  }

  .select-label {
    margin-bottom: 5px;
  }
`;
