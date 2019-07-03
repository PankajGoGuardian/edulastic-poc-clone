import React from "react";
import { Link } from "react-router-dom";
import { Row, Col, Tooltip } from "antd";
import { compose } from "redux";
import { withRouter } from "react-router-dom";
import { IconPlusCircle } from "@edulastic/icons";
import { lightBlue3 } from "@edulastic/colors";
import { CardText, Image, IconWrapper, OverlayText, RowWrapper, RowWrapper1, TextDiv, IconRightArrow } from "./styled";
import { TextWrapper } from "../../../../../styledComponents";
export const CardTextContent = ({ data, history }) => {
  const { totalAssignment, asgnStatus, asgnTitle, asgnId, _id, asgnThumbnail } = data;

  const gotoAssignedAssessment = () => {
    if (asgnId) history.push(`/author/classboard/${asgnId}/${_id}`);
  };

  return (
    <CardText>
      <RowWrapper>
        <Col span={6}>
          <Link to={"/author/assignments"}>
            <IconWrapper>
              <OverlayText>{totalAssignment || 0}</OverlayText>
            </IconWrapper>
          </Link>
        </Col>

        <Col span={15}>
          <Link to={"/author/assignments"}>
            <TextWrapper color="#30404F" size="14px">
              {totalAssignment > 1 ? "Assessments" : "Assessment"}
            </TextWrapper>
          </Link>
        </Col>

        {(!totalAssignment || totalAssignment === 0) && (
          <Col span={3}>
            <Link to={"/author/assignments/select"}>
              <IconPlusCircle color={lightBlue3} width={25} height={25} />
            </Link>
          </Col>
        )}
      </RowWrapper>
      <TextWrapper color="#30404F" size="10px">
        RECENT:
      </TextWrapper>
      <RowWrapper1 onClick={() => gotoAssignedAssessment()}>
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
        {asgnTitle && (
          <Col span={2}>
            <IconRightArrow type="right" />
          </Col>
        )}
      </RowWrapper1>
    </CardText>
  );
};

const enhance = compose(withRouter);
export default enhance(CardTextContent);
