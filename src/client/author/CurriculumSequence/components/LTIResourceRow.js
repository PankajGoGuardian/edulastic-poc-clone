import React from "react";
import { Row, Col, Button } from "antd";
import styled from "styled-components";
import { Tooltip } from "../../../common/utils/helpers";
import { themeColor } from "@edulastic/colors";
import { ModuleDataName, EllipticSpan, AssignmentButton, AssignmentIcon, CustomIcon } from "./CurriculumModuleRow";
import { IconTrash } from "@edulastic/icons";
import { connect } from "react-redux";
import { getUserRole } from "../../src/selectors/user";

const ResourceRow = ({ isStudent, data, mode, urlHasUseThis, deleteTest, moduleIndex, showResource }) => {
  if (mode === "embedded") {
    return (
      <Row type="flex" align="top" style={{ width: "calc(100%)" }}>
        <Col span={urlHasUseThis ? 7 : 10}>
          <ModuleDataName>{data.contentTitle}</ModuleDataName>
        </Col>
        <StyledCol span={urlHasUseThis ? 17 : 14}>
          <AssignmentButton>
            <Button onClick={() => showResource(data.contentId, data.data)}>VIEW</Button>
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
        <AssignmentButton style={!isStudent && urlHasUseThis ? { marginRight: "31px" } : null}>
          <Button onClick={() => showResource(data.contentId)} style={{ width: "124px" }}>
            VIEW
          </Button>
        </AssignmentButton>
      </StyledCol>
    </Row>
  );
};

const StyledCol = styled(Col)`
  display: flex;
  justify-content: flex-end;
`;

export const LTIResourceRow = connect(({ user }) => ({
  isStudent: getUserRole({ user }) === "student"
}))(ResourceRow);
