import React, { Fragment } from "react";
import PropTypes from "prop-types";
import { Popover } from "antd";
import { getFormattedAttrId } from "@edulastic/common/src/helpers";
import { CorrectAnswersContainer, Subtitle } from "@edulastic/common";
import { withNamespaces } from "@edulastic/localization";
import { getStemNumeration } from "../../../../utils/helpers";
import { FlexRow } from "./styled/FlexRow";
import { Item } from "./styled/Item";
import { Index } from "./styled/Index";
import { Content } from "./styled/Content";

const ShowCorrect = ({ list, altList, altResponses, t, stemNumeration, itemStyle, item }) => (
  <CorrectAnswersContainer title={t("component.sortList.correctAnswers")}>
    <FlexRow>
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
    </FlexRow>

    {altResponses.map((ans, i) => (
      <Fragment key={i}>
        <Subtitle
          id={getFormattedAttrId(
            `${item?.title}-${t("component.sortList.alternateAnswer")} ${i + 1}`
          )}
          style={{ marginTop: 40 }}
        >
          {`${t("component.sortList.alternateAnswer")} ${i + 1}`}
        </Subtitle>
        <FlexRow>
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
        </FlexRow>
      </Fragment>
    ))}
  </CorrectAnswersContainer>
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
