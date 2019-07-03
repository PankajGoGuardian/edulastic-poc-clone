import React, { Fragment } from "react";
import PropTypes from "prop-types";

import { CorrectAnswersContainer, Subtitle } from "@edulastic/common";
import { withNamespaces } from "@edulastic/localization";

import { FlexRow } from "./styled/FlexRow";
import { Item } from "./styled/Item";
import { Index } from "./styled/Index";
import { Content } from "./styled/Content";

const ShowCorrect = ({ list, correctList, altResponses, source, t }) => (
  <CorrectAnswersContainer title={t("component.sortList.correctAnswers")}>
    <FlexRow>
      {list.map((item, i) => (
        <Item key={i}>
          <Index>{correctList.indexOf(source.indexOf(item)) + 1}</Index>
          <Content dangerouslySetInnerHTML={{ __html: item }} />
        </Item>
      ))}
    </FlexRow>

    {altResponses.map((ans, i) => (
      <Fragment key={i}>
        <Subtitle style={{ marginTop: 40 }}>{`${t("component.sortList.alternateAnswer")} ${i + 1}`}</Subtitle>
        <FlexRow>
          {ans.value.map((answer, index) => (
            <Item key={index}>
              <Index>{answer + 1}</Index>
              <Content dangerouslySetInnerHTML={{ __html: list[index] }} />
            </Item>
          ))}
        </FlexRow>
      </Fragment>
    ))}
  </CorrectAnswersContainer>
);

ShowCorrect.propTypes = {
  list: PropTypes.array.isRequired,
  altResponses: PropTypes.array.isRequired,
  correctList: PropTypes.array.isRequired,
  t: PropTypes.func.isRequired,
  source: PropTypes.array.isRequired
};

export default withNamespaces("assessment")(ShowCorrect);
