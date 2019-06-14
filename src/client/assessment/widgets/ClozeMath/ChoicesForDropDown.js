import React, { Component } from "react";
import PropTypes from "prop-types";
import ReactDOM from "react-dom";
import { arrayMove } from "react-sortable-hoc";
import { compose } from "redux";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { forEach, cloneDeep } from "lodash";
import "react-quill/dist/quill.snow.css";
import produce from "immer";
import uuid from "uuid/v4";

import { withNamespaces } from "@edulastic/localization";
import { updateVariables } from "../../utils/variables";
import { setQuestionDataAction } from "../../../author/QuestionEditor/ducks";

import SortableList from "../../components/SortableList/index";
import { Subtitle } from "../../styled/Subtitle";
import { WidgetWrapper, Widget } from "../../styled/Widget";
import { AddNewChoiceBtn } from "../../styled/AddNewChoiceBtn";

import { response } from "@edulastic/constants";

class ChoicesForDropDown extends Component {
  static propTypes = {
    t: PropTypes.func.isRequired,
    item: PropTypes.object.isRequired,
    setQuestionData: PropTypes.func.isRequired,
    fillSections: PropTypes.func,
    cleanSections: PropTypes.func
  };

  state = {
    sectionId: uuid()
  };

  static defaultProps = {
    fillSections: () => {},
    cleanSections: () => {}
  };

  componentDidUpdate(prevProps) {
    const { item: prevItem } = prevProps;
    const { item, fillSections, cleanSections } = this.props;
    const {
      response_ids: { dropDowns: current = [] }
    } = item;
    const {
      response_ids: { dropDowns: prev = [] }
    } = prevItem;

    // eslint-disable-next-line react/no-find-dom-node
    if (current.length === 0) {
      return cleanSections(this.state.sectionId);
    }

    const node = ReactDOM.findDOMNode(this);
    if (current.length === 1 && prev.length !== 1) {
      fillSections(
        "main",
        "Choices for Dropdown(s)",
        node.offsetTop,
        node.scrollHeight,
        undefined,
        undefined,
        this.state.sectionId
      );
    }
  }

  componentWillUnmount() {
    const { cleanSections } = this.props;

    cleanSections(this.state.sectionId);
  }

  onChangeQuestion = stimulus => {
    const { item, setQuestionData } = this.props;
    setQuestionData(
      produce(item, draft => {
        draft.stimulus = stimulus;
        updateVariables(draft);
      })
    );
  };

  onSortEnd = (dropDownId, { oldIndex, newIndex }) => {
    const { item, setQuestionData } = this.props;
    setQuestionData(
      produce(item, draft => {
        draft.options[dropDownId] = arrayMove(draft.options[dropDownId], oldIndex, newIndex);
      })
    );
  };

  remove = (dropDownId, itemIndex) => {
    const { item, setQuestionData } = this.props;
    setQuestionData(
      produce(item, draft => {
        draft.options[dropDownId].splice(itemIndex, 1);
        const validDropDown = cloneDeep(draft.validation.valid_dropdown.value);
        forEach(validDropDown, answer => {
          if (answer.id === dropDownId) {
            answer.value = "";
          }
        });
        draft.validation.valid_dropdown.value = validDropDown;
        updateVariables(draft);
      })
    );
  };

  editOptions = (dropDownId, itemIndex, e) => {
    const { item, setQuestionData } = this.props;
    setQuestionData(
      produce(item, draft => {
        if (draft.options[dropDownId] === undefined) draft.options[dropDownId] = [];
        draft.options[dropDownId][itemIndex] = e.target.value;
        draft.ui_style["widthpx"] = Math.min(e.target.value.split("").length * 14, response.maxWidth);
        updateVariables(draft);
      })
    );
  };

  addNewChoiceBtn = dropDownId => {
    const { item, setQuestionData, t } = this.props;
    setQuestionData(
      produce(item, draft => {
        if (draft.options[dropDownId] === undefined) draft.options[dropDownId] = [];
        draft.options[dropDownId].push(t("component.cloze.dropDown.newChoice"));
      })
    );
  };

  render() {
    const { t, item } = this.props;
    const {
      response_ids: { dropDowns = [] },
      options,
      template
    } = item;

    return (
      <WidgetWrapper>
        {dropDowns.map(dropdown => (
          <Widget data-cy={`choice-dropdown-${dropdown.index}`}>
            <Subtitle>{`${t("component.math.choicesfordropdown")} ${dropdown.index + 1}`}</Subtitle>
            <SortableList
              items={options[dropdown.id] || []}
              dirty={template}
              onSortEnd={params => this.onSortEnd(dropdown.id, params)}
              useDragHandle
              onRemove={itemIndex => this.remove(dropdown.id, itemIndex)}
              onChange={(itemIndex, e) => this.editOptions(dropdown.id, itemIndex, e)}
            />

            <div>
              <AddNewChoiceBtn onClick={() => this.addNewChoiceBtn(dropdown.id)}>
                {t("component.cloze.dropDown.addnewchoice")}
              </AddNewChoiceBtn>
            </div>
          </Widget>
        ))}
      </WidgetWrapper>
    );
  }
}

const enhance = compose(
  withRouter,
  withNamespaces("assessment"),
  connect(
    null,
    { setQuestionData: setQuestionDataAction }
  )
);

export default enhance(ChoicesForDropDown);
