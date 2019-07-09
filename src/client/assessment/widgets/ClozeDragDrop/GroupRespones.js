import React from "react";
import PropTypes from "prop-types";
import { compose } from "redux";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import { withTheme } from "styled-components";
import produce from "immer";
import uuid from "uuid/v4";
import { arrayMove } from "react-sortable-hoc";
import { Button, Icon, Input, Checkbox } from "antd";
import { withNamespaces } from "@edulastic/localization";
import { PaddingDiv } from "@edulastic/common";

import { setQuestionDataAction } from "../../../author/QuestionEditor/ducks";
import QuillSortableList from "../../components/QuillSortableList/index";

import { updateVariables } from "../../utils/variables";
import { Subtitle } from "../../styled/Subtitle";
import { AddNewChoiceBtn } from "../../styled/AddNewChoiceBtn";
import { ActionWrapper } from "./styled/ActionWrapper";
import { CheckContainer } from "./styled/CheckContainer";

class GroupResponses extends React.Component {
  static propTypes = {
    t: PropTypes.func.isRequired,
    item: PropTypes.object.isRequired,
    setQuestionData: PropTypes.func.isRequired,
    theme: PropTypes.object.isRequired,
    cleanSections: PropTypes.func,
    fillSections: PropTypes.func
  };

  static defaultProps = {
    cleanSections: () => null,
    fillSections: () => null
  };

  constructor(props) {
    super(props);

    this.containerRef = React.createRef();
  }

  componentDidMount = () => {
    const { fillSections, t } = this.props;
    if (this.containerRef.current) {
      fillSections(
        "main",
        t("component.cloze.dragDrop.choicesforresponse"),
        this.containerRef.current.offsetTop,
        this.containerRef.current.scrollHeight
      );
    }
  };

  componentWillUnmount() {
    const { cleanSections } = this.props;

    cleanSections();
  }

  onSortEnd = ({ oldIndex, newIndex }) => {
    const { item, setQuestionData } = this.props;
    setQuestionData(
      produce(item, draft => {
        draft.options = arrayMove(draft.options, oldIndex, newIndex);
      })
    );
  };

  remove = index => {
    const { item, setQuestionData } = this.props;
    setQuestionData(
      produce(item, draft => {
        draft.options.splice(index, 1);
        updateVariables(draft);
      })
    );
  };

  editOptions = (index, value) => {
    const { item, setQuestionData } = this.props;
    setQuestionData(
      produce(item, draft => {
        draft.options[index].label = value;
        const maxLength = 0;
        // draft.options.forEach(option => {
        //   maxLength = Math.max(maxLength, option ? option.label.length : 0);
        // });

        /**
         * causes issues while re rendering after coming back from preview
         * always defaulting width to 140 because of below logic
         */

        // const finalWidth = 40 + maxLength * 7;
        // draft.ui_style.widthpx = finalWidth < 140 ? 140 : finalWidth > 400 ? 400 : finalWidth;
        updateVariables(draft);
      })
    );
  };

  addNewChoiceBtn = () => {
    const { item, setQuestionData } = this.props;
    setQuestionData(
      produce(item, draft => {
        draft.options.push({ value: uuid(), label: "" });
      })
    );
  };

  groupResponsesHandler = e => {
    const { item, setQuestionData } = this.props;
    const hasGroupResponses = e.target.checked;

    setQuestionData(
      produce(item, draft => {
        draft.hasGroupResponses = hasGroupResponses;
        updateVariables(draft);
      })
    );
  };

  addGroup = () => {
    const {
      item: { groupResponses = [] }
    } = this.props;

    groupResponses.push({ title: "", options: [{ value: uuid(), label: "" }] });
    const newGroupResponses = groupResponses.slice();

    const { item, setQuestionData } = this.props;
    setQuestionData(
      produce(item, draft => {
        draft.groupResponses = newGroupResponses;
        updateVariables(draft);
      })
    );
  };

  removeGroup = index => {
    const {
      item: { groupResponses = [] }
    } = this.props;
    groupResponses.splice(index, 1);
    const newGroupResponses = groupResponses.slice();

    const { item, setQuestionData } = this.props;
    setQuestionData(
      produce(item, draft => {
        draft.groupResponses = newGroupResponses;
        updateVariables(draft);
      })
    );
  };

  changeGroupRespTitle = (index, e) => {
    const {
      item: { groupResponses = [] }
    } = this.props;
    const newGroupResponses = groupResponses.slice();
    newGroupResponses[index].title = e.target.value;

    const { item, setQuestionData } = this.props;
    setQuestionData(
      produce(item, draft => {
        draft.groupResponses = newGroupResponses;
        updateVariables(draft);
      })
    );
  };

  addNewGroupOption = index => {
    const {
      item: { groupResponses = [] }
    } = this.props;
    const newGroupResponses = groupResponses.slice();
    newGroupResponses[index].options.push({ value: uuid(), label: "" });

    const { item, setQuestionData } = this.props;
    setQuestionData(
      produce(item, draft => {
        draft.groupResponses = newGroupResponses;
        updateVariables(draft);
      })
    );
  };

  editGroupOptions = (index, itemIndex, val) => {
    const {
      item: { groupResponses = [] }
    } = this.props;

    const newGroupResponses = groupResponses.slice();
    newGroupResponses[index].options[itemIndex].label = val;

    const { item, setQuestionData } = this.props;
    setQuestionData(
      produce(item, draft => {
        draft.groupResponses = newGroupResponses;
        updateVariables(draft);
      })
    );
  };

  removeGroupOptions = (index, itemIndex) => {
    const {
      item: { groupResponses = [] }
    } = this.props;
    const newGroupResponses = groupResponses.slice();
    newGroupResponses[index].options.splice(itemIndex, 1);

    const { item, setQuestionData } = this.props;
    setQuestionData(
      produce(item, draft => {
        draft.groupResponses = newGroupResponses;
        updateVariables(draft);
      })
    );
  };

  onSortEndGroupOptions = (groupIndex, params) => {
    const { oldIndex, newIndex } = params;
    const {
      item: { groupResponses = [] }
    } = this.props;
    const newGroupResponses = groupResponses.slice();
    const responseToMove = newGroupResponses[groupIndex].options.splice(oldIndex, 1)[0];
    newGroupResponses[groupIndex].options.splice(newIndex, 0, responseToMove);

    const { item, setQuestionData } = this.props;
    setQuestionData(
      produce(item, draft => {
        draft.groupResponses = newGroupResponses;
        updateVariables(draft);
      })
    );
  };

  groupResponseOption = () => {
    const { t, item } = this.props;
    return (
      <CheckContainer>
        <Checkbox
          data-cy="drag-drop-aria-check"
          checked={item.hasGroupResponses}
          onChange={e => this.groupResponsesHandler(e)}
        >
          {t("component.cloze.dragDrop.grouppossibleresponses")}
        </Checkbox>
      </CheckContainer>
    );
  };

  render() {
    const { t, item, theme } = this.props;
    return (
      <div ref={this.containerRef}>
        <Subtitle>{t("component.cloze.dragDrop.choicesforresponse")}</Subtitle>

        {!item.hasGroupResponses && (
          <PaddingDiv>
            <QuillSortableList
              items={item.options.map(o => o.label)}
              onSortEnd={this.onSortEnd}
              useDragHandle
              onRemove={this.remove}
              onChange={this.editOptions}
            />
            <ActionWrapper>
              <AddNewChoiceBtn onClick={this.addNewChoiceBtn}>
                {t("component.cloze.dragDrop.addnewchoice")}
              </AddNewChoiceBtn>
              {this.groupResponseOption()}
            </ActionWrapper>
          </PaddingDiv>
        )}
        {item.hasGroupResponses &&
          item.groupResponses &&
          item.groupResponses.length > 0 &&
          item.groupResponses.map((group, index) => (
            <div key={index}>
              <fieldset
                style={{
                  borderColor: theme.widgets.clozeDragDrop.groupResponseFieldsetBorderColor,
                  borderRadius: 2,
                  padding: "0 20px",
                  marginBottom: 15,
                  border: "solid 1px"
                }}
              >
                <legend style={{ padding: "0 20px", width: "auto" }}>
                  {t("component.cloze.dragDrop.group")} {index + 1}
                </legend>
                <div style={{ float: "right" }}>
                  <Button onClick={() => this.removeGroup(index)} size="small" type="button">
                    <Icon type="close" />
                  </Button>
                </div>
                <PaddingDiv top={10} bottom={10}>
                  <div>{t("component.cloze.dragDrop.title")}</div>
                </PaddingDiv>
                <div>
                  <Input
                    size="large"
                    style={{ width: "100%" }}
                    onChange={e => this.changeGroupRespTitle(index, e)}
                    value={group.title}
                  />
                </div>
                <PaddingDiv top={20} bottom={10}>
                  <div>{t("component.cloze.dragDrop.choicesforresponse")}</div>
                  {group.options.length > 0 && (
                    <QuillSortableList
                      prefix={`group_${index}`}
                      items={group.options.map(o => o.label)}
                      onSortEnd={params => this.onSortEndGroupOptions(index, params)}
                      useDragHandle
                      onRemove={itemIndex => this.removeGroupOptions(index, itemIndex)}
                      onChange={(itemIndex, e) => this.editGroupOptions(index, itemIndex, e)}
                    />
                  )}
                  <PaddingDiv top={10} bottom={10}>
                    <AddNewChoiceBtn onClick={() => this.addNewGroupOption(index)}>
                      {t("component.cloze.dragDrop.addnewchoice")}
                    </AddNewChoiceBtn>
                  </PaddingDiv>
                </PaddingDiv>
              </fieldset>
            </div>
          ))}
        {item.hasGroupResponses && (
          <ActionWrapper>
            <AddNewChoiceBtn onClick={this.addGroup}>{t("component.cloze.dragDrop.addgroup")}</AddNewChoiceBtn>
            {this.groupResponseOption()}
          </ActionWrapper>
        )}
      </div>
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

export default enhance(GroupResponses);
