import React, { Fragment } from "react";
import PropTypes from "prop-types";
import { Col } from "antd";
import { connect } from "react-redux";
import { compose } from "redux";
import { withNamespaces } from "react-i18next";
import { get } from "lodash";
import { setQuestionDataAction, getQuestionDataSelector } from "../../../author/QuestionEditor/ducks";

import withAddButton from "../../components/HOC/withAddButton";
import { change, remove, add, sort } from "./helpers";
import { StyledRow } from "./styled/StyledRow";
import QuillSortableList from "../../components/QuillSortableList";
import { Widget } from "../../styled/Widget";
import { Subtitle } from "../../styled/Subtitle";
import Question from "../../components/Question";

const SortableListWithAddButton = withAddButton(QuillSortableList);

const Hints = ({ t, item, setQuestionData, fillSections, cleanSections, advancedAreOpen }) => {
  const prop = "hints";

  const _change = change({ item, setQuestionData, prop });
  const _remove = remove({ item, setQuestionData, prop });
  const _add = add({ item, setQuestionData, prop });
  const _sort = sort({ item, setQuestionData, prop });

  return (
    <Question
      section="advanced"
      label={t("component.options.hint")}
      fillSections={fillSections}
      cleanSections={cleanSections}
      advancedAreOpen={advancedAreOpen}
    >
      <Fragment>
        <Subtitle>{t("component.options.hint")}</Subtitle>
        <StyledRow gutter={60}>
          <Col data-cy="hintsList" md={24}>
            <SortableListWithAddButton
              buttonText={t("component.options.add")}
              useDragHandle
              items={get(item, `metadata.${prop}`, [])}
              onSortEnd={_sort}
              prefix="hints"
              onAdd={_add}
              onRemove={_remove}
              onChange={(index, value) => _change(`metadata.${prop}[${index}]`, value)}
            />
          </Col>
        </StyledRow>
      </Fragment>
    </Question>
  );
};

Hints.propTypes = {
  t: PropTypes.func.isRequired,
  setQuestionData: PropTypes.func.isRequired,
  item: PropTypes.object.isRequired,
  fillSections: PropTypes.func,
  cleanSections: PropTypes.func,
  advancedAreOpen: PropTypes.bool
};

Hints.defaultProps = {
  fillSections: () => {},
  cleanSections: () => {},
  advancedAreOpen: false
};

const enhance = compose(
  withNamespaces("assessment"),
  connect(
    state => ({
      item: getQuestionDataSelector(state)
    }),
    {
      setQuestionData: setQuestionDataAction
    }
  )
);

export default enhance(Hints);
