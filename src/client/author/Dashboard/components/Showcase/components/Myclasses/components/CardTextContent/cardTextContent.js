import React from "react";
import { Link, withRouter } from "react-router-dom";
import { Row, Col, Tooltip } from "antd";
import { compose } from "redux";
import { IconPlusCircle } from "@edulastic/icons";
import { themeColorLight, titleColor, cardTitleColor } from "@edulastic/colors";
import {
  CardText,
  Image,
  IconWrapper,
  OverlayText,
  RowWrapper,
  RowWrapper1,
  TextDiv,
  IconRightArrow,
  LeftCol,
  CenterCol,
  RightCol
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
            <TextWrapper color={titleColor} size="14px">
              {totalAssignment > 1 ? "Assignments" : "Assignment"}
            </TextWrapper>
          </Link>
        </CenterCol>

        {(!totalAssignment || totalAssignment === 0) && (
          <RightCol>
            <Tooltip title="Create new assignment" placement="topLeft">
              <Link to="/author/assignments/select">
                <IconPlusCircle color={themeColorLight} width={25} height={25} />
              </Link>
            </Tooltip>
          </RightCol>
        )}
      </RowWrapper>
      <TextWrapper color={titleColor} size="10px">
        RECENT:
      </TextWrapper>
      <RowWrapper1 onClick={() => gotoAssignedAssessment()}>
        {asgnTitle ? (
          <>
            <LeftCol height="auto">
              <Image src={asgnThumbnail} />
            </LeftCol>
            <CenterCol>
              <Row>
                <Tooltip title={asgnTitle} placement="topLeft">
                  <TextDiv data-cy="assignmentTitle">{asgnTitle}</TextDiv>
                </Tooltip>
              </Row>
              <Row>
                <TextWrapper data-cy="assignmentStatus" color={cardTitleColor} size="11px" fw="bold">
                  {asgnStatus}
                </TextWrapper>
              </Row>
            </CenterCol>
            <RightCol height="auto">
              <IconRightArrow type="right" />
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

const enhance = compose(withRouter);
export default enhance(CardTextContent);
