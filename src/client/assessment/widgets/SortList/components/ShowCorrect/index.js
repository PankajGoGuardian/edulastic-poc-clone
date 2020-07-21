import React, { Fragment } from "react";
import PropTypes from "prop-types";
import { Popover } from "antd";
import { CorrectAnswersContainer, FlexContainer } from "@edulastic/common";
import { withNamespaces } from "@edulastic/localization";
import { getStemNumeration } from "../../../../utils/helpers";
import { Item } from "./styled/Item";
import { Index } from "./styled/Index";
import { Content } from "./styled/Content";

const ShowCorrect = ({ list, altList, altResponses, t, stemNumeration, itemStyle }) => (
  <Fragment>
    <CorrectAnswersContainer minHeight="auto" title={t("component.sortList.correctAnswers")}>
      <FlexContainer marginLeft="20px">
        {list.map((ele, i) => {
          const content = <Content dangerouslySetInnerHTML={{ __html: ele }} />;
          return (
            <Popover content={content}>
              <Item key={i} style={itemStyle}>
                <Index>{getStemNumeration(stemNumeration, i)}</Index>
                {content}
              </Item>
            </Popover>
          );
        })}
      </FlexContainer>
    </CorrectAnswersContainer>

    {altResponses.map((ans, i) => (
      <CorrectAnswersContainer key={i} title={`${t("component.sortList.alternateAnswer")} ${i + 1}`} minHeight="auto">
        <FlexContainer marginLeft="20px">
          {ans.value.map((answer, index) => {
            const content = <Content dangerouslySetInnerHTML={{ __html: altList[i][index] }} />;
            return (
              <Popover content={content}>
                <Item key={index} style={itemStyle}>
                  <Index>{getStemNumeration(stemNumeration, index)}</Index>
                  {content}
                </Item>
              </Popover>
            );
          })}
        </FlexContainer>
      </CorrectAnswersContainer>
    ))}
  </Fragment>
);

ShowCorrect.propTypes = {
  list: PropTypes.array.isRequired,
  altList: PropTypes.array.isRequired,
  altResponses: PropTypes.array.isRequired,
  t: PropTypes.func.isRequired,
  itemStyle: PropTypes.object.isRequired,
  stemNumeration: PropTypes.string.isRequired
};

export default withNamespaces("assessment")(ShowCorrect);
