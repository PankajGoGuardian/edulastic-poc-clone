import React, { Component } from "react";
import ReactDOM from "react-dom";
import PropTypes from "prop-types";
import { arrayMove } from "react-sortable-hoc";
import { compose } from "redux";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import produce from "immer";
import "froala-editor/js/froala_editor.pkgd.min.js";
import "froala-editor/css/froala_style.min.css";
import "froala-editor/css/froala_editor.pkgd.min.css";
import "font-awesome/css/font-awesome.css";
import FroalaEditor from "react-froala-wysiwyg";

import { withNamespaces } from "@edulastic/localization";

import { setQuestionDataAction } from "../../../../author/QuestionEditor/ducks";

import { Subtitle } from "../../../styled/Subtitle";
import { Widget } from "../../../styled/Widget";
import { updateVariables } from "../../../utils/variables";

const toolbarConfig = {
  tableResizerOffset: 10,
  tableResizingLimit: 50
};

class ComposeQuestion extends Component {
  static propTypes = {
    t: PropTypes.func.isRequired,
    item: PropTypes.object.isRequired,
    fillSections: PropTypes.func,
    cleanSections: PropTypes.func,
    setQuestionData: PropTypes.func.isRequired
  };

  static defaultProps = {
    fillSections: () => {},
    cleanSections: () => {}
  };

  componentDidMount = () => {
    const { fillSections, t } = this.props;
    const node = ReactDOM.findDOMNode(this);

    fillSections("main", t("component.multiplechoice.composequestion"), node.offsetTop);
  };

  componentWillUnmount() {
    const { cleanSections } = this.props;

    cleanSections();
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

  onSortEnd = ({ oldIndex, newIndex }) => {
    const { item, setQuestionData } = this.props;
    setQuestionData(
      produce(item, draft => {
        // reorder the options and sort the key based on index
        // editing is based on on index!
        draft.options = arrayMove(draft.options, oldIndex, newIndex).map(({ label }, index) => ({
          value: index,
          label
        }));

        let idx = item.validation.valid_response.value.findIndex(val => val === oldIndex);
        if (idx !== -1) {
          draft.validation.valid_response.value[idx] = newIndex;
        }

        idx = item.validation.valid_response.value.findIndex(val => val === newIndex);
        if (idx !== -1) {
          draft.validation.valid_response.value[idx] = oldIndex;
        }

        if (draft.validation.alt_responses) {
          for (let i = 0; i < item.validation.alt_responses; i++) {
            const altResponse = draft.validation.alt_responses[i];
            idx = item.validation.alt_responses[i].value.findIndex(val => val === oldIndex);
            if (idx !== -1) {
              altResponse.value[idx] = newIndex;
            }

            idx = item.validation.alt_responses[i].value.findIndex(val => val === newIndex);
            if (idx !== -1) {
              altResponse.value[idx] = oldIndex;
            }
            return altResponse;
          }
        }

        updateVariables(draft);
      })
    );
  };

  remove = index => {
    const { item, setQuestionData } = this.props;
    setQuestionData(
      produce(item, draft => {
        draft.options.splice(index, 1);
        for (let i = index + 1; i < draft.options.length; i++) {
          if (draft.variable) {
            draft.variable.variableStatus[`option-${index - 1}`] = draft.variable.variableStatus[`option-${index}`];
          }
        }
        updateVariables(draft);
      })
    );
  };

  render() {
    const { t, item } = this.props;

    return (
      <Widget questionTextArea>
        <Subtitle>{t("component.multiplechoice.composequestion")}</Subtitle>

        <FroalaEditor
          tag="textarea"
          model={item.stimulus}
          onModelChange={this.onChangeQuestion}
          config={toolbarConfig}
        />
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

export default enhance(ComposeQuestion);
