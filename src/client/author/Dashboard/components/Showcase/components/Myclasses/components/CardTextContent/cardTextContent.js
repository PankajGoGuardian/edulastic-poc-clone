import React from "react";
import { Row, Col, Icon } from "antd";
import { compose } from "redux";
import { withRouter } from "react-router-dom";
import { CardText, Image, IconWrapper, OverlayText, RowWrapper, RowWrapper1 } from "./styled";
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
            <OverlayText>{totalAssignment}</OverlayText>
          </IconWrapper>
        </Col>
        <Col span={18}>
          <TextWrapper color="#30404F" size="14px">
            Assessment
          </TextWrapper>
        </Col>
      </RowWrapper>
      <RowWrapper1 onClick={gotoAssignedAssessment}>
        <Col span={7}>
          <Image src={asgnThumbnail} />
        </Col>
        <Col span={15}>
          <Row>
            <TextWrapper color="#434B5D" size="12px">
              {asgnTitle}
            </TextWrapper>
          </Row>
          <Row>
            <TextWrapper color="#AAAFB5" size="9px">
              {asgnStatus}
            </TextWrapper>
          </Row>
        </Col>
        <Col span={2}>
          <Icon type="right" />
        </Col>
      </RowWrapper1>
    </CardText>
  );
};

const enhance = compose(withRouter);
export default enhance(CardTextContent);
