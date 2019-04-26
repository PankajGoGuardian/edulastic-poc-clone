import React, { Component } from "react";
import PropTypes from "prop-types";
import { arrayMove } from "react-sortable-hoc";
import { compose } from "redux";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import "react-quill/dist/quill.snow.css";
import produce from "immer";

import { withNamespaces } from "@edulastic/localization";
import { updateVariables } from "../../utils/variables";
import { setQuestionDataAction } from "../../../author/QuestionEditor/ducks";

import ComposeQuestion from "./ComposeQuestion";
import TemplateMarkup from "./TemplateMarkup";
import ChoicesForResponse from "./ChoicesForResponse";

const defaultTemplateMarkup =
  '<p>Risus </p><p class="response-btn" contenteditable="false"><span class="index">1</span><span class="text">Response</span></p><p>, et tincidunt turpis facilisis. Curabitur eu nulla justo. Curabitur vulputate ut nisl et bibendum. Nunc diam enim, porta sed eros vitae. </p><p class="response-btn" contenteditable="false"><span class="index">1</span><span class="text">Response</span></p><p> dignissim, et tincidunt turpis facilisis. Curabitur eu nulla justo. Curabitur vulputate ut nisl et bibendum.</p>';

class ClozeDropDownAuthoring extends Component {
  static propTypes = {
    t: PropTypes.func.isRequired,
    item: PropTypes.object.isRequired,
    setQuestionData: PropTypes.func.isRequired,
    fillSections: PropTypes.func,
    cleanSections: PropTypes.func
  };

  static defaultProps = {
    fillSections: () => {},
    cleanSections: () => {}
  };

  state = {
    responseContainersCount: 2
  };

  componentWillReceiveProps(nextProps) {
    const { item } = nextProps;
    const { responseContainersCount } = this.getTemplateParts(item);
    this.setState({ responseContainersCount });
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
        updateVariables(draft);
      })
    );
  };

  getTemplateParts = props => {
    const { templateMarkUp } = props;
    let templateMarkUpStr = templateMarkUp;
    if (!templateMarkUpStr) {
      templateMarkUpStr = defaultTemplateMarkup;
    }
    const templateParts = templateMarkUpStr.match(/(<p.*?<\/p>)|(<span.*?><\/span>)/g);
    const responseParts = templateMarkUpStr.match(/<p class="response-btn.*?<\/p>/g);
    const responseContainersCount = responseParts !== null ? responseParts.length : 0;
    return { templateParts, responseContainersCount };
  };

  render() {
    const { item, fillSections, cleanSections } = this.props;
    const { responseContainersCount } = this.state;
    const responseContainers = new Array(responseContainersCount).fill(true);

    return (
      <div>
        <ComposeQuestion item={item} fillSections={fillSections} cleanSections={cleanSections} />
        <TemplateMarkup item={item} fillSections={fillSections} cleanSections={cleanSections} />
        {responseContainers.map((resp, index) => (
          <ChoicesForResponse item={item} index={index} fillSections={fillSections} cleanSections={cleanSections} />
        ))}
      </div>
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

export default enhance(ClozeDropDownAuthoring);
