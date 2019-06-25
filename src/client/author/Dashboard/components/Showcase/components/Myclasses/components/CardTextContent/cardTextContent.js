import React from "react";
import { Row, Col, Tooltip } from "antd";
import { compose } from "redux";
import { withRouter } from "react-router-dom";
import { CardText, Image, IconWrapper, OverlayText, RowWrapper, RowWrapper1, TextDiv, IconRightArrow } from "./styled";
import { TextWrapper } from "../../../../../styledComponents";
export const CardTextContent = ({ data, history }) => {
  const { totalAssignment, asgnStatus, asgnTitle, asgnId, _id, asgnThumbnail } = data;

  const gotoAssessment = () => {
    history.push("/author/assignments");
  };
  const gotoAssignedAssessment = () => {
    history.push(`/author/classboard/${asgnId}/${_id}`);
  };
  return (
    <CardText>
      <RowWrapper onClick={gotoAssessment}>
        <Col span={6}>
          <IconWrapper>
            <OverlayText>{totalAssignment || 0}</OverlayText>
          </IconWrapper>
        </Col>
        <Col span={18}>
          <TextWrapper color="#30404F" size="14px">
            {totalAssignment > 1 ? "Assessments" : "Assessment"}
          </TextWrapper>
        </Col>
      </RowWrapper>
      <TextWrapper color="#30404F" size="10px">
        RECENT:
      </TextWrapper>
      <RowWrapper1 onClick={asgnTitle ? gotoAssignedAssessment : ""}>
        {asgnTitle && (
          <Col span={5}>
            <Image src={asgnThumbnail} />
          </Col>
        )}

        <Col
          span={16}
          style={{
            marginLeft: "0.5rem"
          }}
        >
          <Row>
            <Tooltip title={asgnTitle || "No Recent Assignments"} placement="topLeft">
              <TextDiv>{asgnTitle ? asgnTitle : "No Recent Assignments"}</TextDiv>
            </Tooltip>
          </Row>
          <Row>
            <TextWrapper color="#AAAFB5" size="11px" fw="bold">
              {asgnStatus}
            </TextWrapper>
          </Row>
        </Col>
        <Col span={2}>{asgnTitle ? <IconRightArrow type="right" /> : ""}</Col>
      </RowWrapper1>
    </CardText>
  );
};

const enhance = compose(withRouter);
export default enhance(CardTextContent);
