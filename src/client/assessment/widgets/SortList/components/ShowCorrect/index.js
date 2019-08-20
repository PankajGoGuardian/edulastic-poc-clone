import React, { Fragment } from "react";
import PropTypes from "prop-types";

import { CorrectAnswersContainer, Subtitle } from "@edulastic/common";
import { withNamespaces } from "@edulastic/localization";

import { FlexRow } from "./styled/FlexRow";
import { Item } from "./styled/Item";
import { Index } from "./styled/Index";
import { Content } from "./styled/Content";

const getStemNumeration = (i, uiStyle) => {
  if (uiStyle) {
    switch (uiStyle.validationStemNumeration) {
      case "upper-alpha":
        return String.fromCharCode(i + 65);
      case "lower-alpha":
        return String.fromCharCode(i + 65).toLowerCase();
      default:
        break;
    }
  }

  return i + 1;
};

const ShowCorrect = ({ list, altList, correctList, altResponses, source, t, item }) => (
  <CorrectAnswersContainer title={t("component.sortList.correctAnswers")}>
    <FlexRow>
      {list.map((ele, i) => (
        <Item key={i}>
          <Index>{getStemNumeration(i, item.uiStyle)}</Index>
          <Content dangerouslySetInnerHTML={{ __html: ele }} />
        </Item>
      ))}
    </FlexRow>

    {altResponses.map((ans, i) => (
      <Fragment key={i}>
        <Subtitle style={{ marginTop: 40 }}>{`${t("component.sortList.alternateAnswer")} ${i + 1}`}</Subtitle>
        <FlexRow>
          {ans.value.map((answer, index) => (
            <Item key={index}>
              <Index>{getStemNumeration(index, item.uiStyle)}</Index>
              <Content dangerouslySetInnerHTML={{ __html: altList[i][index] }} />
            </Item>
          ))}
        </FlexRow>
      </Fragment>
    ))}
  </CorrectAnswersContainer>
);

ShowCorrect.propTypes = {
  list: PropTypes.array.isRequired,
  altList: PropTypes.array.isRequired,
  altResponses: PropTypes.array.isRequired,
  correctList: PropTypes.array.isRequired,
  t: PropTypes.func.isRequired,
  source: PropTypes.array.isRequired,
  item: PropTypes.func.isRequired
};

export default withNamespaces("assessment")(ShowCorrect);
