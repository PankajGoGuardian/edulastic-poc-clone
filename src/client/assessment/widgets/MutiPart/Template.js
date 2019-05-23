/* eslint-disable no-unused-vars */
import React, { Component } from "react";
import PropTypes from "prop-types";
import ReactDOM from "react-dom";
import produce from "immer";
import { withNamespaces } from "react-i18next";
import { Quill } from "react-quill";
import { CustomQuillComponent } from "@edulastic/common";

import { Subtitle } from "../../styled/Subtitle";
import { Widget } from "../../styled/Widget";

const Embed = Quill.import("blots/block/embed");

class QuestionBlot extends Embed {
  static create(params) {
    const node = super.create();
    const { html, id, type } = params;
    node.innerHTML = html;
    node.type = type;
    node.id = id;
    return node;
  }

  static value(node) {
    return node.innerHTML;
  }
}

QuestionBlot.blotName = "question-blot";
QuestionBlot.className = "question-blot";
QuestionBlot.tagName = "question-blot";

Quill.register(QuestionBlot, true);
class Template extends Component {
  componentDidMount = () => {
    const { fillSections, t, item } = this.props;
    // eslint-disable-next-line react/no-find-dom-node
    const node = ReactDOM.findDOMNode(this);

    if (item.templateDisplay) {
      fillSections("main", t("component.multipart.content"), node.offsetTop);
    }
  };

  componentWillUnmount() {
    const { cleanSections } = this.props;

    cleanSections();
  }

  extraToolbar = () => (
    <span className="ql-formats">
      <button className="ql-insertBlot" type="button">
        W
      </button>
    </span>
  );

  insertBlot() {
    const cursorPosition = this.quill.getSelection().index;
    this.quill.insertEmbed(cursorPosition, "question-blot", {
      id: "5bd1047beab99410c69d86f5",
      type: "multipleChoice",
      html: "<strong>Test Bolt</strong>"
    });
    this.quill.setSelection(cursorPosition + 2);
  }

  render() {
    const { t, item, setQuestionData } = this.props;

    const _updateTemplate = val => {
      const newItem = produce(item, draft => {
        draft.content = val;
      });
      setQuestionData(newItem);
    };

    return (
      <Widget>
        <Subtitle data-cy="content">{t("component.multipart.content")}</Subtitle>
        <CustomQuillComponent
          inputId="contentInput"
          toolbarId="content"
          onChange={_updateTemplate}
          value={item.content}
          showResponseBtn={false}
          data-cy="contentBox"
          extraToolbar={this.extraToolbar}
          extraHandlers={{ insertBlot: this.insertBlot }}
        />
      </Widget>
    );
  }
}

Template.propTypes = {
  t: PropTypes.func.isRequired,
  setQuestionData: PropTypes.func.isRequired,
  item: PropTypes.object,
  fillSections: PropTypes.func,
  cleanSections: PropTypes.func
};

Template.defaultProps = {
  item: {},
  fillSections: () => {},
  cleanSections: () => {}
};

export default withNamespaces("assessment")(Template);
