import React, { Component } from "react";
import PropTypes from "prop-types";
import ReactDOM from "react-dom";
import uuid from "uuid/v4";
import { arrayMove } from "react-sortable-hoc";
import { compose } from "redux";
import { find, cloneDeep, forEach } from "lodash";
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
    response: PropTypes.object.isRequired,
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

  componentDidMount = () => {
    const { fillSections, t, item, response } = this.props;
    const { sectionId } = this.state;
    // eslint-disable-next-line react/no-find-dom-node
    const node = ReactDOM.findDOMNode(this);
    const deskHeight = item.ui_style.layout_height;

    if (node) {
      fillSections(
        "main",
        `${t("component.cloze.dropDown.choicesforresponse")} ${response.index + 1}`,
        node.offsetTop,
        deskHeight ? node.scrollHeight + deskHeight : node.scrollHeight,
        deskHeight === true,
        deskHeight,
        sectionId
      );
    }
  };

  componentWillUnmount() {
    const { cleanSections } = this.props;
    const { sectionId } = this.state;

    cleanSections(sectionId);
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

  onSortEnd = (responseId, { oldIndex, newIndex }) => {
    const { item, setQuestionData } = this.props;
    setQuestionData(
      produce(item, draft => {
        draft.options[responseId] = arrayMove(draft.options[responseId], oldIndex, newIndex);
      })
    );
  };

  remove = (responseId, itemIndex) => {
    const { item, setQuestionData } = this.props;
    setQuestionData(
      produce(item, draft => {
        draft.options[responseId].splice(itemIndex, 1);

        const validAnswers = cloneDeep(draft.validation.valid_response.value);
        forEach(validAnswers, answer => {
          if (answer.id === responseId) {
            answer.value = "";
          }
        });

        draft.validation.valid_response.value = validAnswers;
        updateVariables(draft);
      })
    );
  };

  editOptions = (responseId, itemIndex, e) => {
    const { item, setQuestionData } = this.props;
    setQuestionData(
      produce(item, draft => {
        if (draft.options[responseId] === undefined) draft.options[responseId] = [];

        const correctAnswer = find(draft.validation.valid_response.value, answer => answer.id === responseId);
        if (correctAnswer && correctAnswer.value === draft.options[responseId][itemIndex]) {
          correctAnswer.value = e.target.value;
        }

        draft.options[responseId][itemIndex] = e.target.value;
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

  addNewChoiceBtn = responseId => {
    const { item, setQuestionData, t } = this.props;
    setQuestionData(
      produce(item, draft => {
        if (draft.options[responseId] === undefined) draft.options[responseId] = [];
        draft.options[responseId].push(t("component.cloze.dropDown.newChoice"));
      })
    );
  };

  render() {
    const { t, item, response } = this.props;
    const { options, templateMarkUp } = item;
    return (
      <Widget data-cy={`choice-response-${response.index}`}>
        <Subtitle>{`${t("component.cloze.dropDown.choicesforresponse")} ${response.index + 1}`}</Subtitle>
        <SortableList
          items={options[response.id] || []}
          dirty={templateMarkUp}
          onSortEnd={params => this.onSortEnd(response.id, params)}
          useDragHandle
          onRemove={itemIndex => this.remove(response.id, itemIndex)}
          onChange={(itemIndex, e) => this.editOptions(response.id, itemIndex, e)}
        />
        <div>
          <AddNewChoiceBtn onClick={() => this.addNewChoiceBtn(response.id)}>
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
