import React from "react";
import { Link, withRouter } from "react-router-dom";
import { Row, Col, Tooltip } from "antd";
import { IconPlusCircle, IconGraphRightArrow } from "@edulastic/icons";
import { themeColorLight, cardTitleColor, themeColor } from "@edulastic/colors";
import {
  CardText,
  Image,
  IconWrapper,
  OverlayText,
  RowWrapper,
  RowWrapper1,
  LeftCol,
  CenterCol,
  RightCol,
  AssignmentStatusText,
  AssignmentTitle,
  AssignmentCount
} from "./styled";
import { TextWrapper } from "../../../../../styledComponents";

export const CardTextContent = ({ data, history }) => {
  const { totalAssignment, asgnStatus, asgnTitle, asgnId, _id, asgnThumbnail } = data;

  const gotoAssignedAssessment = () => {
    if (asgnId) history.push(`/author/classboard/${asgnId}/${_id}`);
  };

  return (
    <CardText>
      <RowWrapper>
        <LeftCol>
          <Link to="/author/assignments">
            <IconWrapper>
              <OverlayText data-cy="totalAssignment">{totalAssignment || 0}</OverlayText>
            </IconWrapper>
          </Link>
        </LeftCol>

        <CenterCol>
          <Link to="/author/assignments">
            <AssignmentCount>{totalAssignment > 1 ? "Assignments" : "Assignment"}</AssignmentCount>
          </Link>
        </CenterCol>

        {(!totalAssignment || totalAssignment === 0) && (
          <RightCol>
            <Tooltip title="Create New Assignment" placement="topLeft">
              <Link to="/author/assignments/select">
                <IconPlusCircle color={themeColorLight} width={25} height={25} />
              </Link>
            </Tooltip>
          </RightCol>
        )}
      </RowWrapper>
      <RowWrapper1 onClick={() => gotoAssignedAssessment()}>
        {asgnTitle ? (
          <>
            <LeftCol>
              <Image src={asgnThumbnail} />
            </LeftCol>
            <CenterCol>
              <Tooltip title={asgnTitle} placement="topLeft">
                <AssignmentTitle data-cy="assignmentTitle">{asgnTitle}</AssignmentTitle>
              </Tooltip>
              <AssignmentStatusText data-cy="assignmentStatus">{asgnStatus}</AssignmentStatusText>
            </CenterCol>
            <RightCol height="auto">
              <IconGraphRightArrow color={themeColor} />
            </RightCol>
          </>
        ) : (
          <Col span={16} style={{ cursor: "default" }}>
            <Row>
              <TextWrapper data-cy="assignmentTitle" color={cardTitleColor} size="12px" mb="22px">
                No Recent Assignments
              </TextWrapper>
            </Row>
          </Col>
        )}
      </RowWrapper1>
    </CardText>
  );
};

export default withRouter(CardTextContent);
