import React, { Component } from "react";
import PropTypes from "prop-types";
import ReactDOM from "react-dom";
import { arrayMove } from "react-sortable-hoc";
import { compose } from "redux";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import produce from "immer";
import "react-quill/dist/quill.snow.css";
import { withTheme } from "styled-components";

import { withNamespaces } from "@edulastic/localization";
import { PaddingDiv } from "@edulastic/common";

import { updateVariables } from "../../utils/variables";
import { setQuestionDataAction } from "../../../author/QuestionEditor/ducks";

import { Subtitle } from "../../styled/Subtitle";
import { AddNewChoiceBtn } from "../../styled/AddNewChoiceBtn";
import SortableList from "../../components/SortableList/index";
import { Widget } from "../../styled/Widget";
import { defaultOptions } from "../../constants/constantsForQuestions";

class Response extends Component {
  static propTypes = {
    t: PropTypes.func.isRequired,
    item: PropTypes.object.isRequired,
    index: PropTypes.number.isRequired,
    option: PropTypes.object.isRequired,
    setQuestionData: PropTypes.func.isRequired,
    fillSections: PropTypes.func,
    cleanSections: PropTypes.func
  };

  static defaultProps = {
    fillSections: () => {},
    cleanSections: () => {}
  };

  componentDidMount = () => {
    const { fillSections, t, index } = this.props;
    // eslint-disable-next-line react/no-find-dom-node
    const node = ReactDOM.findDOMNode(this);
    fillSections(
      "main",
      `${t("component.cloze.imageDropDown.response")} ${index + 1}`,
      node.offsetTop,
      node.scrollHeight,
      null,
      null,
      `cloze-image-dropdown-response-${index + 1}`
    );
  };

  componentWillUnmount() {
    const { cleanSections, index } = this.props;

    cleanSections(`cloze-image-dropdown-response-${index + 1}`);
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
        const oldOptionValue = draft.options[index][itemIndex];
        draft.options[index].splice(itemIndex, 1);
        if (oldOptionValue === draft.validation.valid_response.value[index]) {
          draft.validation.valid_response.value.splice(index, 1, "");
        }
        draft.validation.alt_responses = draft.validation.alt_responses.map(resp => {
          if (oldOptionValue === resp[index]) {
            resp.value.splice(index, 1, "");
          }
          return resp;
        });
        updateVariables(draft);
      })
    );
  };

  editOptions = (index, itemIndex, e) => {
    const { item, setQuestionData } = this.props;
    setQuestionData(
      produce(item, draft => {
        if (draft.options[index] === undefined) draft.options[index] = [];
        const oldOptionValue = draft.options[index][itemIndex];
        draft.options[index][itemIndex] = e.target.value;
        let maxLength = 0;
        draft.options.forEach(option => {
          option.forEach(opt => {
            maxLength = Math.max(maxLength, opt ? opt.length : 0);
          });
        });
        const finalWidth = 40 + maxLength * 7;
        if (!draft.ui_style) {
          draft.ui_style = { widthpx: 140 };
        }
        draft.ui_style.widthpx = finalWidth < 140 ? 140 : finalWidth > 400 ? 400 : finalWidth;
        if (draft.validation.valid_response.value[index] === oldOptionValue) {
          draft.validation.valid_response.value.splice(index, 1, e.target.value);
        }
        draft.validation.alt_responses = draft.validation.alt_responses.map(resp => {
          if (resp.value[index] === oldOptionValue) {
            resp.value.splice(index, 1, e.target.value);
          }
          return resp;
        });
        updateVariables(draft);
      })
    );
  };

  addNewChoiceBtn = index => {
    const { item, setQuestionData, t } = this.props;
    setQuestionData(
      produce(item, draft => {
        if (draft.options[index] === undefined) draft.options[index] = [];
        draft.options[index].push(t("component.cloze.imageDropDown.newChoice"));
      })
    );
  };

  render() {
    const { t, index, option } = this.props;

    return (
      <Widget data-cy={`choice-response-${index}`}>
        <Subtitle style={{ paddingTop: index > 0 ? "30px" : "0px" }}>
          {t("component.cloze.imageDropDown.response")} {index + 1}
        </Subtitle>
        <SortableList
          items={option || []}
          onSortEnd={params => this.onSortEnd(index, params)}
          defaultOptions={defaultOptions}
          useDragHandle
          onRemove={itemIndex => this.remove(index, itemIndex)}
          onChange={(itemIndex, e) => this.editOptions(index, itemIndex, e)}
        />
        <PaddingDiv top={6}>
          <AddNewChoiceBtn data-cy={`add-new-ch-res-${index}`} onClick={() => this.addNewChoiceBtn(index)}>
            {t("component.cloze.imageDropDown.addnewchoice")}
          </AddNewChoiceBtn>
        </PaddingDiv>
      </Widget>
    );
  }
}

const enhance = compose(
  withRouter,
  withNamespaces("assessment"),
  withTheme,
  connect(
    null,
    { setQuestionData: setQuestionDataAction }
  )
);

export default enhance(Response);
