import React, { Fragment } from "react";
import PropTypes from "prop-types";
import { Col } from "antd";
import { connect } from "react-redux";
import { compose } from "redux";
import { withNamespaces } from "react-i18next";
import { get } from "lodash";
import { setQuestionDataAction, getQuestionDataSelector } from "../../../author/QuestionEditor/ducks";

import SortableList from "../../components/SortableList";
import withAddButton from "../../components/HOC/withAddButton";

import { change, remove, add, sort } from "./helpers";
import { StyledRow } from "./styled/StyledRow";
import { Widget } from "../../styled/Widget";
import { Subtitle } from "../../styled/Subtitle";

const SortableListWithAddButton = withAddButton(SortableList);

const Distractors = ({ t, setQuestionData, item }) => {
  const prop = "distractor_rationale_response_level";

  const _change = change({ item, setQuestionData, prop });
  const _remove = remove({ item, setQuestionData, prop });
  const _add = add({ item, setQuestionData, prop });
  const _sort = sort({ item, setQuestionData, prop });

  return (
    <Widget>
      <Fragment>
        <Subtitle>{t("component.options.distractorTitle")}</Subtitle>
        <StyledRow gutter={60}>
          <Col data-cy="distractorList" md={24}>
            <SortableListWithAddButton
              buttonText={t("component.options.add")}
              useDragHandle
              label={t("component.options.distractor")}
              items={get(item, `metadata.${prop}`, [])}
              onSortEnd={_sort}
              prefix="distractors"
              onAdd={_add}
              onRemove={_remove}
              onChange={(index, e) => _change(`metadata.${prop}[${index}]`, e.target.value)}
            />
          </Col>
        </StyledRow>
      </Fragment>
    </Widget>
  );
};

Distractors.propTypes = {
  t: PropTypes.func.isRequired,
  setQuestionData: PropTypes.func.isRequired,
  item: PropTypes.object.isRequired
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

export default enhance(Distractors);
