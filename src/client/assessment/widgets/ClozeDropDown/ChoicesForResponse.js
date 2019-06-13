import React, { Component } from "react";
import PropTypes from "prop-types";
import ReactDOM from "react-dom";
import uuid from "uuid/v4";
import { arrayMove } from "react-sortable-hoc";
import { compose } from "redux";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import "react-quill/dist/quill.snow.css";
import produce from "immer";

import { withNamespaces } from "@edulastic/localization";
import { updateVariables } from "../../utils/variables";
import { setQuestionDataAction } from "../../../author/QuestionEditor/ducks";

import SortableList from "../../components/SortableList/index";
import { Subtitle } from "../../styled/Subtitle";
import { Widget } from "../../styled/Widget";
import { AddNewChoiceBtn } from "../../styled/AddNewChoiceBtn";

class ChoicesForResponse extends Component {
  static propTypes = {
    t: PropTypes.func.isRequired,
    item: PropTypes.object.isRequired,
    setQuestionData: PropTypes.func.isRequired,
    index: PropTypes.number.isRequired,
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

  componentDidMount = () => {
    const { fillSections, t, index, item } = this.props;
    // eslint-disable-next-line react/no-find-dom-node
    const node = ReactDOM.findDOMNode(this);
    const deskHeight = item.ui_style.layout_height;

    fillSections(
      "main",
      `${t("component.cloze.dropDown.choicesforresponse")} ${index + 1}`,
      node.offsetTop,
      deskHeight ? node.scrollHeight + deskHeight : node.scrollHeight,
      deskHeight === true,
      deskHeight,
      this.state.sectionId
    );
  };

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

  onSortEnd = (index, { oldIndex, newIndex }) => {
    const { item, setQuestionData } = this.props;
    setQuestionData(
      produce(item, draft => {
        draft.options[index] = arrayMove(draft.options[index], oldIndex, newIndex);
      })
    );
  };

  remove = (index, itemIndex) => {
    const { item, setQuestionData } = this.props;
    setQuestionData(
      produce(item, draft => {
        draft.options[index].splice(itemIndex, 1);
        draft.validation.valid_response.value[index] = "";
        updateVariables(draft);
      })
    );
  };

  editOptions = (index, itemIndex, e) => {
    const { item, setQuestionData } = this.props;
    setQuestionData(
      produce(item, draft => {
        if (draft.options[index] === undefined) draft.options[index] = [];
        if (
          draft.validation.valid_response &&
          draft.validation.valid_response.value.length &&
          draft.options[index][itemIndex] === draft.validation.valid_response.value[index]
        ) {
          draft.validation.valid_response.value[index] = e.target.value;
        }
        draft.options[index][itemIndex] = e.target.value;
        let maxLength = 0;
        Object.keys(draft.options).forEach(option => {
          draft.options[option].forEach(opt => {
            maxLength = Math.max(maxLength, opt ? opt.length : 0);
          });
        });

        const finalWidth = 40 + maxLength * 7;
        draft.ui_style.widthpx = finalWidth < 140 ? 140 : finalWidth > 400 ? 400 : finalWidth;
        updateVariables(draft);
      })
    );
  };

  addNewChoiceBtn = index => {
    const { item, setQuestionData, t } = this.props;
    setQuestionData(
      produce(item, draft => {
        if (draft.options[index] === undefined) draft.options[index] = [];
        draft.options[index].push(t("component.cloze.dropDown.newChoice"));
      })
    );
  };

  render() {
    const { t, item, index } = this.props;

    return (
      <Widget data-cy={`choice-response-${index}`}>
        <Subtitle>{`${t("component.cloze.dropDown.choicesforresponse")} ${index + 1}`}</Subtitle>
        <SortableList
          items={item.options[index] || []}
          dirty={item.templateMarkUp}
          onSortEnd={params => this.onSortEnd(index, params)}
          useDragHandle
          onRemove={itemIndex => this.remove(index, itemIndex)}
          onChange={(itemIndex, e) => this.editOptions(index, itemIndex, e)}
        />
        <div>
          <AddNewChoiceBtn onClick={() => this.addNewChoiceBtn(index)}>
            {t("component.cloze.dropDown.addnewchoice")}
          </AddNewChoiceBtn>
        </div>
      </Widget>
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

export default enhance(ChoicesForResponse);
