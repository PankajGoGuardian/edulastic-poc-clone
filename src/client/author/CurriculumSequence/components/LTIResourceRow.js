import React from "react";
import { Row, Col, Button } from "antd";
import styled from "styled-components";
import { Tooltip } from "../../../common/utils/helpers";
import { lightGreen5, white, themeColor } from "@edulastic/colors";
import { ModuleDataName, EllipticSpan, AssignmentButton, AssignmentIcon, CustomIcon } from "./CurriculumModuleRow";
import { IconTrash } from "@edulastic/icons";

export const LTIResourceRow = ({ data, mode, urlHasUseThis, deleteTest, moduleIndex }) => {
  if (mode === "embedded") {
    return (
      <Row type="flex" align="top" style={{ width: "calc(100%)" }}>
        <Col span={urlHasUseThis ? 7 : 10}>
          <ModuleDataName>{data.contentTitle}</ModuleDataName>
        </Col>
        <StyledCol span={urlHasUseThis ? 17 : 14}>
          <AssignmentButton>
            <Button onClick={() => console.log("Pressed View Button")}>VIEW</Button>
          </AssignmentButton>
          <AssignmentIcon>
            <CustomIcon
              data-cy="assignmentDeleteOptionsIcon"
              onClick={e => {
                e.stopPropagation();
                deleteTest(moduleIndex, data.contentId);
              }}
            >
              <IconTrash color={themeColor} />
            </CustomIcon>
          </AssignmentIcon>
        </StyledCol>
      </Row>
    );
  }

  return (
    <Row type="flex" gutter={20} align="top" style={{ width: "calc(100% - 25px)" }}>
      <Col span={urlHasUseThis ? 7 : 10}>
        <ModuleDataName>
          <Tooltip placement="bottomLeft" title={data.contentTitle}>
            <EllipticSpan width="calc(100% - 30px)">{data.contentTitle}</EllipticSpan>
          </Tooltip>
        </ModuleDataName>
      </Col>
      <StyledCol span={urlHasUseThis ? 17 : 14}>
        <AssignmentButton style={{ marginRight: "40px" }}>
          <Button onClick={() => console.log("Pressed View Button")}>VIEW</Button>
        </AssignmentButton>
      </StyledCol>
    </Row>
  );
};

export const ViewButton = styled.div`
  float: right;
  min-width: 121px;
  .ant-btn {
    color: ${({ assigned }) => (assigned ? white : lightGreen5)};
    border: 1px solid ${lightGreen5};
    background-color: ${({ assigned }) => (assigned ? lightGreen5 : white)};
    min-width: 121px;
    max-height: 22px;
    display: flex;
    align-items: center;
    margin: ${({ margin }) => margin};

    svg {
      fill: ${({ assigned }) => (assigned ? white : lightGreen5)};
    }
    &:hover {
      background-color: ${({ assigned }) => (assigned ? white : lightGreen5)};
      color: ${({ assigned }) => (assigned ? lightGreen5 : white)};
      border-color: ${({ assigned }) => (assigned ? white : lightGreen5)};
      svg {
        fill: ${({ assigned }) => (assigned ? lightGreen5 : white)};
      }
    }
    i {
      position: absolute;
      position: absolute;
      left: 6px;
      display: flex;
      align-items: center;
    }
    span {
      margin-left: auto;
      margin-right: auto;
      font: 9px/13px Open Sans;
      letter-spacing: 0.17px;
      font-weight: 600;
    }
  }
`;

const StyledCol = styled(Col)`
  display: flex;
  justify-content: flex-end;
`;
