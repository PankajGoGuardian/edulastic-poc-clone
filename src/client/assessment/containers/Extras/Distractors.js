import React, { Fragment } from "react";
import PropTypes from "prop-types";
import { Col } from "antd";
import { connect } from "react-redux";
import { compose } from "redux";
import { withNamespaces } from "react-i18next";
import { get } from "lodash";

import { getQuestionDataSelector } from "../../../author/src/selectors/question";
import { setQuestionDataAction } from "../../../author/src/actions/question";

import SortableList from "../../components/SortableList";
import withAddButton from "../../components/HOC/withAddButton";

import { change, removeDistractor, addDistractor, sortDistractors } from "./helpers";
import { StyledRow } from "./styled/StyledRow";

const SortableListWithAddButton = withAddButton(SortableList);

const Distractors = ({ item, setQuestionData, t }) => {
  const _change = change({ item, setQuestionData });
  const _remove = removeDistractor({ item, setQuestionData });
  const _add = addDistractor({ item, setQuestionData });
  const _sort = sortDistractors({ item, setQuestionData });

  return (
    <Fragment>
      <StyledRow gutter={36}>
        <Col span={24}>{t("component.options.distractorRationalePerResponse")}</Col>
      </StyledRow>
      <StyledRow gutter={36}>
        <Col span={24}>
          <SortableListWithAddButton
            buttonText={t("component.options.add")}
            useDragHandle
            label={t("component.options.distractor")}
            items={get(item, "metadata.distractor_rationale_response_level", [])}
            onSortEnd={_sort}
            prefix="distractors"
            onAdd={_add}
            onRemove={_remove}
            onChange={(index, e) => _change(`metadata.distractor_rationale_response_level[${index}]`, e.target.value)}
          />
        </Col>
      </StyledRow>
    </Fragment>
  );
};

Distractors.propTypes = {
  setQuestionData: PropTypes.func.isRequired,
  t: PropTypes.func.isRequired,
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
