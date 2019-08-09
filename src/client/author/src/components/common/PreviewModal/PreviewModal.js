import PropTypes from "prop-types";
import React from "react";
import { compose } from "redux";
import { connect } from "react-redux";
import { get, keyBy, intersection, uniq } from "lodash";
import { Spin, Button, Modal, Select } from "antd";
import styled from "styled-components";
import { FlexContainer, EduButton } from "@edulastic/common";
import { withRouter } from "react-router-dom";

import { questionType } from "@edulastic/constants";
import { IconPencilEdit, IconDuplicate } from "@edulastic/icons";
import { testItemsApi, passageApi } from "@edulastic/api";
import { white, themeColor } from "@edulastic/colors";
import TestItemPreview from "../../../../../assessment/components/TestItemPreview";
import DragScrollContainer from "../../../../../assessment/components/DragScrollContainer";
import {
  getItemDetailSelectorForPreview,
  getPassageSelector,
  addPassageAction,
  setPrevewItemAction,
  setQuestionsForPassageAction,
  clearPreviewAction
} from "./ducks";
import { getCollectionsSelector } from "../../../selectors/user";
import { changePreviewAction } from "../../../actions/view";
import { clearAnswersAction } from "../../../actions/answers";
import {
  setItemFromPassageAction,
  getSelectedItemSelector,
  getTestItemsSelector
} from "../../../../TestPage/components/AddItems/ducks";
import { setTestDataAndUpdateAction, getTestSelector } from "../../../../TestPage/ducks";

const { duplicateTestItem } = testItemsApi;
class PreviewModal extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      flag: false,
      scrollElement: null,
      passageLoading: false
    };
  }

  componentDidMount() {
    const { item, addPassage } = this.props;
    if (!!item.passageId) {
      this.setState({ passageLoading: true });
      try {
        passageApi.getById(item.passageId).then(response => {
          addPassage(response.data.result);
          this.setState({ passageLoading: false });
        });
      } catch (e) {
        this.setState({ passageLoading: false });
      }
    }
  }

  componentWillReceiveProps(nextProps) {
    const { flag } = this.state;
    const { isVisible } = nextProps;
    if (isVisible && !flag) {
      this.setState({ flag: true });
    }
  }

  closeModal = () => {
    const { onClose, changeView, clearAnswers, clearPreview } = this.props;
    this.setState({ flag: false });
    clearPreview();
    changeView("clear");
    onClose();
    clearAnswers();
  };

  handleDuplicateTestItem = async () => {
    const { data, testId, history } = this.props;
    const itemId = data.id;
    this.closeModal();
    const duplicatedItem = await duplicateTestItem(itemId);
    if (testId) {
      history.push(`/author/tests/${testId}/createItem/${duplicatedItem._id}`);
    } else {
      history.push(`/author/items/${duplicatedItem._id}/item-detail`);
    }
  };

  editTestItem = () => {
    const { data, history, testId } = this.props;
    const itemId = data.id;
    if (testId) {
      history.push(`/author/tests/${testId}/createItem/${itemId}`);
    } else {
      history.push(`/author/items/${itemId}/item-detail`);
    }
  };

  clearView = () => {
    const { changeView, clearAnswers } = this.props;
    changeView("clear");
    clearAnswers();
  };

  mountedQuestion = node => {
    if (node) {
      this.setState({ scrollElement: node });
    }
  };

  goToItem = itemId => {
    const { setQuestionsForPassage, setPrevewItem, item, testItemPreviewData } = this.props;
    if (!(testItemPreviewData && testItemPreviewData.data)) {
      setPrevewItem(item);
    }
    testItemsApi.getById(itemId).then(response => {
      setQuestionsForPassage(response);
    });
  };

  handleSelection = row => {
    const { setDataAndSave, selectedRows, testItemsList, test, gotoSummary, item, setItemFromPassage } = this.props;
    if (!test.title) {
      gotoSummary();
      return message.error("Name field cannot be empty");
    }
    let keys = [];
    if (test.safeBrowser && !test.sebPassword) {
      return message.error("Please add a valid password");
    }
    if (selectedRows !== undefined) {
      selectedRows.data.forEach((selectedRow, index) => {
        keys[index] = selectedRow;
      });
    }
    if (!keys.includes(row.id)) {
      keys[keys.length] = row.id;
      const item = testItemsList.find(el => row.id === el._id);
      setDataAndSave({ addToTest: true, item });
    } else {
      keys = keys.filter(item => item !== row.id);
      setDataAndSave({ addToTest: false, item: { _id: row.id } });
    }
    setItemFromPassage(item);
  };

  render() {
    const {
      isVisible,
      collections,
      loading,
      item = { rows: [], data: {}, authors: [] },
      currentAuthorId,
      isEditable = false,
      checkAnswer,
      showAnswer,
      preview,
      showEvaluationButtons,
      passage
    } = this.props;

    const { scrollElement, passageLoading } = this.state;
    const questions = keyBy(get(item, "data.questions", []), "id");
    const resources = keyBy(get(item, "data.resources", []), "id");

    let allWidgets = { ...questions, ...resources };
    const { authors = [], rows, data = {} } = item;
    const questionsType = data.questions && uniq(data.questions.map(question => question.type));
    const intersectionCount = intersection(questionsType, questionType.manuallyGradableQn).length;
    const isAnswerBtnVisible = questionsType && intersectionCount < questionsType.length;

    const getAuthorsId = authors.map(author => author._id);
    const authorHasPermission = getAuthorsId.includes(currentAuthorId);
    const { allowDuplicate } = collections.find(o => o._id === item.collectionName) || { allowDuplicate: true };
    const allRows = !!item.passageId && !!passage ? [passage.structure, ...rows] : rows;
    const passageTestItems = get(passage, "testItems", []);
    const isPassage = passage && passageTestItems.length;
    if (!!item.passageId && !!passage) {
      allWidgets = { ...allWidgets, ...keyBy(passage.data, "id") };
    }
    return (
      <PreviewModalWrapper
        bodyStyle={{ padding: 20 }}
        width="60%"
        visible={isVisible}
        onCancel={this.closeModal}
        footer={null}
      >
        <HeadingWrapper>
          <Title>Preview</Title>
          {isPassage && (
            <ButtonsWrapper>
              {/* TODO right logic for showing add or remove  */}
              <Button style={{ marginRight: "20px" }} onClick={this.handleSelection}>
                ADD
              </Button>
            </ButtonsWrapper>
          )}
        </HeadingWrapper>
        <ModalContentArea>
          {showEvaluationButtons && (
            <ButtonsContainer>
              <ButtonsWrapper>
                {allowDuplicate && (
                  <EduButton
                    title="Duplicate"
                    style={{ width: 42, padding: 0, borderColor: themeColor }}
                    size="large"
                    onClick={this.handleDuplicateTestItem}
                  >
                    <IconDuplicate color={themeColor} />
                  </EduButton>
                )}
                {authorHasPermission && isEditable && (
                  <EduButton
                    title="Edit item"
                    style={{ width: 42, padding: 0, borderColor: themeColor }}
                    size="large"
                    onClick={this.editTestItem}
                  >
                    <IconPencilEdit color={themeColor} />
                  </EduButton>
                )}
                {isPassage ? (
                  <ItemsListDropDown
                    value={item._id}
                    showArrow={false}
                    optionLabelProp={"children"}
                    onChange={v => {
                      this.goToItem(v);
                    }}
                  >
                    {passageTestItems.map((v, ind) => (
                      <Select.Option value={v}>{ind + 1}</Select.Option>
                    ))}
                  </ItemsListDropDown>
                ) : (
                  ""
                )}
              </ButtonsWrapper>
              <ButtonsWrapper>
                {isAnswerBtnVisible && (
                  <>
                    <Button
                      onClick={checkAnswer}
                      style={{ fontSize: "11px", height: "28px", borderColor: themeColor, color: themeColor }}
                    >
                      {" "}
                      Check Answer{" "}
                    </Button>
                    <Button
                      onClick={showAnswer}
                      style={{ fontSize: "11px", height: "28px", borderColor: themeColor, color: themeColor }}
                    >
                      {" "}
                      Show Answer{" "}
                    </Button>
                  </>
                )}
                <Button
                  onClick={this.clearView}
                  style={{ fontSize: "11px", height: "28px", borderColor: themeColor, color: themeColor }}
                >
                  {" "}
                  Clear{" "}
                </Button>
              </ButtonsWrapper>
            </ButtonsContainer>
          )}
          {scrollElement && <DragScrollContainer scrollWrraper={scrollElement} height={50} />}
          <QuestionWrapper padding="0px" innerRef={this.mountedQuestion}>
            {loading || item === null || passageLoading ? (
              <ProgressContainer>
                <Spin tip="" />
              </ProgressContainer>
            ) : (
              <TestItemPreview
                cols={allRows}
                preview={preview}
                previewTab={preview}
                verticalDivider={item.verticalDivider}
                scrolling={item.scrolling}
                style={{ width: "100%" }}
                questions={allWidgets}
                showCollapseBtn
              />
            )}
          </QuestionWrapper>
        </ModalContentArea>
      </PreviewModalWrapper>
    );
  }
}

PreviewModal.propTypes = {
  isVisible: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  data: PropTypes.object.isRequired,
  isEditable: PropTypes.bool,
  item: PropTypes.object.isRequired,
  preview: PropTypes.any.isRequired,
  currentAuthorId: PropTypes.string.isRequired,
  collections: PropTypes.any.isRequired,
  loading: PropTypes.bool,
  checkAnswer: PropTypes.func,
  showAnswer: PropTypes.func,
  clearAnswers: PropTypes.func.isRequired,
  changeView: PropTypes.func.isRequired,
  showEvaluationButtons: PropTypes.bool,
  testId: PropTypes.string.isRequired,
  history: PropTypes.any.isRequired
};

PreviewModal.defaultProps = {
  checkAnswer: () => {},
  showAnswer: () => {},
  gotoSummary: () => {},
  loading: false,
  isEditable: false,
  showEvaluationButtons: false
};

const enhance = compose(
  withRouter,
  connect(
    (state, ownProps) => {
      const itemId = (ownProps.data || {}).id;
      return {
        item: getItemDetailSelectorForPreview(state, itemId, ownProps.page),
        collections: getCollectionsSelector(state),
        passage: getPassageSelector(state),
        preview: get(state, ["view", "preview"]),
        currentAuthorId: get(state, ["user", "user", "_id"]),
        testItemPreviewData: get(state, ["testItemPreview", "item"], {}),
        selectedRows: getSelectedItemSelector(state),
        test: getTestSelector(state),
        testItemsList: getTestItemsSelector(state)
      };
    },
    {
      changeView: changePreviewAction,
      clearAnswers: clearAnswersAction,
      addPassage: addPassageAction,
      setPrevewItem: setPrevewItemAction,
      setQuestionsForPassage: setQuestionsForPassageAction,
      clearPreview: clearPreviewAction,
      setItemFromPassage: setItemFromPassageAction,
      setDataAndSave: setTestDataAndUpdateAction
    }
  )
);

export default enhance(PreviewModal);

const ProgressContainer = styled.div`
  min-width: 250px;
  min-height: 150px;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const PreviewModalWrapper = styled(Modal)`
  border-radius: 5px;
  background: #f7f7f7;
  top: 30px;
  padding: 0px;
  .ant-modal-content {
    background: transparent;
    box-shadow: none;
  }
`;

const HeadingWrapper = styled.div`
  display: flex;
  align-items: center;
  padding: 10px;
  justify-content: space-between;
  margin-top: -15px;
`;

const Title = styled.div`
  font-weight: bold;
  font-size: 20px;
`;

const ModalContentArea = styled.div`
  box-shadow: 0 3px 10px 0 rgba(0, 0, 0, 0.1);
`;

const ButtonsContainer = styled(FlexContainer)`
  background: ${white};
  padding: 15px 15px 0px 35px;
  justify-content: space-between;
  flex-basis: 400px;
  border-radius: 10px 10px 0px 0px;
`;

const ButtonsWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  * {
    margin: 0 10px;
  }
`;

const QuestionWrapper = styled.div`
  border-radius: 0px 0px 10px 10px;
  height: calc(100vh - 180px);
  background: ${white};
  padding: ${props => (props.padding ? props.padding : "20px")};
  overflow: auto;
`;

const ItemsListDropDown = styled(Select)`
  .ant-select-selection {
    margin: 0;
    border: 1px solid ${themeColor};
    color: ${themeColor};
  }
  .ant-select-selection-selected-value {
    padding: 5px 8px;
    margin: 0;
  }
`;
