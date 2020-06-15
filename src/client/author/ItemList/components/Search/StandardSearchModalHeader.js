import React, { useRef, useState, useLayoutEffect } from "react";
import { Tag, Popover } from "antd";
import styled, { css } from "styled-components";

const StandardSearchModalHeader = ({ standards, selectedCurriculam }) => {
  const containerRef = useRef(null);
  const curriculamRef = useRef(null);
  const [containerWidthSetting, setContainerWidthSetting] = useState({});

  const getWidthOfTag = tagTitle => tagTitle.length * 7 + 28;

  useLayoutEffect(() => {
    const containerWidth =
      containerRef?.current?.offsetWidth - curriculamRef?.current?.offsetWidth - getWidthOfTag("+20");
    const containerWidthObj = {
      totalWidth: containerWidth,
      remainingWidth: containerWidth
    };
    setContainerWidthSetting(containerWidthObj);
  }, [containerRef]);

  const getTag = (tagTitle, bodyArr, popOverArray, containerWidthObj) => {
    const widthOfTag = getWidthOfTag(tagTitle);
    if (widthOfTag <= containerWidthObj.remainingWidth) {
      containerWidthObj.remainingWidth -= widthOfTag;
      bodyArr.push(<Tag>{tagTitle}</Tag>);
    } else {
      popOverArray.push(<StyledPopupTag>{tagTitle}</StyledPopupTag>);
    }
  };

  const getFilters = () => {
    const bodyArr = [];
    const popOverArray = [];
    const containerWidthObj = {
      ...containerWidthSetting
    };
    for (let i = 0; i < standards.length; i++) {
      getTag(standards[i]?.identifier, bodyArr, popOverArray, containerWidthObj);
    }

    return (
      <>
        {bodyArr?.length > 0 && bodyArr.map(e => e)}
        {popOverArray?.length > 0 && (
          <Popover
            placement="bottom"
            content={<PopoverContentWrapper>{popOverArray.map(e => e)}</PopoverContentWrapper>}
          >
            <Tag>{`+${popOverArray.length}`}</Tag>
          </Popover>
        )}
      </>
    );
  };

  return (
    <FiltersWrapper ref={containerRef}>
      <div ref={curriculamRef} style={{ paddingRight: "10px" }}>
        {selectedCurriculam?.text} |{" "}
      </div>
      {getFilters()}
    </FiltersWrapper>
  );
};

export default StandardSearchModalHeader;

const TagsStyle = css`
  color: #686f75;
  background: #bac3ca;
  padding: 2px 10px;
  border: none;
  font-weight: bold;
  border-radius: 6px;
  margin-bottom: 5px;
`;

const StyledPopupTag = styled(Tag)`
  ${TagsStyle};
`;

export const FiltersWrapper = styled.div`
  width: 100%;
  display: flex;
  justify-self: center;
  margin-right: auto;
  margin-left: 10px;
  justify-content: flex-start;
  flex-wrap: wrap;
  align-items: center;
  .ant-tag {
    ${TagsStyle};
    margin-top: 7px;
  }
`;

const PopoverContentWrapper = styled.div`
  max-width: 250px;
`;
