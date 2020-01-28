import React, { PureComponent } from "react";
import { Row, Col, message } from "antd";
import PropTypes from "prop-types";
import { cloneDeep, get, uniq as _uniq, keyBy } from "lodash";
import { connect } from "react-redux";
import { compose } from "redux";
import { withRouter } from "react-router-dom";
import produce from "immer";
import { Paper, withWindowSizes, helpers } from "@edulastic/common";
import { test as testConstants } from "@edulastic/constants";
import PreviewModal from "../../../../../src/components/common/PreviewModal";
import HeaderBar from "../HeaderBar/HeaderBar";
import List from "../List/List";
import ItemsTable from "../ReviewItemsTable/ReviewItemsTable";
import { getItemsSubjectAndGradeSelector, setTestItemsAction } from "../../../AddItems/ducks";
import { getStandardsSelector } from "../../ducks";
import {
  setTestDataAction,
  previewCheckAnswerAction,
  previewShowAnswerAction,
  getDefaultThumbnailSelector,
  updateDefaultThumbnailAction,
  getCurrentGroupIndexSelector,
  getTestItemsSelector,
  addItemsToAutoselectGroupsRequestAction
} from "../../../../ducks";
import { clearAnswersAction } from "../../../../../src/actions/answers";
import { clearEvaluationAction } from "../../../../../../assessment/actions/evaluation";
import { getSummarySelector } from "../../../Summary/ducks";
import { getQuestionsSelectorForReview } from "../../../../../sharedDucks/questions";
import Breadcrumb from "../../../../../src/components/Breadcrumb";
import ReviewSummary from "../ReviewSummary/ReviewSummary";
import {
  SecondHeader,
  ReviewPageContainer,
  ReviewSummaryWrapper,
  ReviewContentWrapper,
  ReviewLeftContainer
} from "./styled";
import { clearDictAlignmentAction } from "../../../../../src/actions/dictionaries";
import { getCreateItemModalVisibleSelector } from "../../../../../src/selectors/testItem";
import { getUserFeatures } from "../../../../../src/selectors/user";
import TestPreviewModal from "../../../../../Assignments/components/Container/TestPreviewModal";
import { Content } from "../../../Container/styled";
// TODO rewrite into  class component and mobile view
class Review extends PureComponent {
  static propTypes = {
    test: PropTypes.object.isRequired,
    onChangeGrade: PropTypes.func.isRequired,
    onChangeSubjects: PropTypes.func.isRequired,
    rows: PropTypes.array.isRequired,
    setData: PropTypes.func.isRequired,
    standards: PropTypes.object.isRequired,
    summary: PropTypes.array.isRequired,
    current: PropTypes.string.isRequired,
    windowWidth: PropTypes.number.isRequired
  };

  secondHeaderRef = React.createRef();
  ContainerRef = React.createRef();

  state = {
    isCollapse: true,
    isShowSummary: true,
    isModalVisible: false,
    item: [],
    isTestPreviewModalVisible: false,
    currentTestId: "",
    hasStickyHeader: false
  };

  componentWillUnmount() {
    this.ContainerRef.current.removeEventListener("scroll", this.handleScroll);
  }

  componentDidMount() {
    this.ContainerRef?.current?.addEventListener("scroll", this.handleScroll);
    const { test, addItemsToAutoselectGroupsRequest } = this.props;
    const hasAutoSelectItems = test.itemGroups.some(g => g.type === testConstants.ITEM_GROUP_TYPES.AUTOSELECT);
    if (hasAutoSelectItems) {
      addItemsToAutoselectGroupsRequest(test);
    }
  }

  setSelected = values => {
    const { test, setData } = this.props;
    const newData = cloneDeep(test);
    newData.itemGroups = produce(newData.itemGroups, itemGroups => {
      itemGroups
        .flatMap(itemGroup => itemGroup.items || [])
        .map((item, i) => {
          if (values.includes(i)) {
            item.selected = true;
          } else {
            item.selected = false;
          }
        });
    });
    setData(newData);
  };

  handleSelectAll = e => {
    const { rows } = this.props;
    const { checked } = e.target;

    if (checked) {
      this.setSelected(rows.map((row, i) => i));
    } else {
      this.setSelected([]);
    }
  };

  handleRemoveSelected = () => {
    const { test, setData, setTestItems, currentGroupIndex } = this.props;
    const newData = cloneDeep(test);
    const itemsSelected = test.itemGroups
      .flatMap(itemGroup => itemGroup.items || [])
      .filter(item => item.selected)
      .map(item => item._id);
    if (!itemsSelected.length) {
      return message.warn("Please select at least one question to remove");
    }
    newData.itemGroups = newData.itemGroups.map(itemGroup => ({
      ...itemGroup,
      items: itemGroup.items.filter(testItem => {
        return !itemsSelected.includes(testItem._id);
      })
    }));

    newData.scoring.testItems = newData.scoring.testItems.filter(item => {
      const foundItem = newData.itemGroups
        .flatMap(itemGroup => itemGroup.items || [])
        .find(({ id }) => id === item._id);
      return !(foundItem && foundItem.selected);
    });
    const testItems = newData.itemGroups.flatMap(itemGroup => itemGroup.items || []);

    setTestItems(testItems.map(item => item._id));
    this.setSelected([]);
    setData(newData);
    message.success("Selected item(s) removed successfully");
  };

  handleCollapse = () => {
    const { isCollapse } = this.state;
    this.setState({
      isCollapse: !isCollapse
    });
  };

  toggleSummary = () => {
    const { isShowSummary } = this.state;
    this.setState({
      isShowSummary: !isShowSummary
    });
  };

  moveTestItems = ({ oldIndex, newIndex }) => {
    const { test, setData, currentGroupIndex } = this.props;
    const newData = cloneDeep(test);

    const [removed] = newData.itemGroups[currentGroupIndex].items.splice(oldIndex, 1);
    newData.itemGroups[currentGroupIndex].items.splice(newIndex, 0, removed);

    setData(newData);
  };

  handleMoveTo = newIndex => {
    const { test, currentGroupIndex } = this.props;
    const oldIndex = test.itemGroups[currentGroupIndex].items.findIndex(item => item.selected);
    this.moveTestItems({ oldIndex, newIndex });
  };

  handleChangePoints = (testItemId, value) => {
    /**
     * prevent zero or less
     */
    if (!(value > 0)) {
      return;
    }
    const { test, setData, currentGroupIndex } = this.props;
    const newData = cloneDeep(test);

    if (!newData.scoring) newData.scoring = {};
    newData.scoring[testItemId] = value;
    setData(newData);
  };

  setModalVisibility = value => {
    this.setState({
      isModalVisible: value
    });
  };

  handleDuplicateItem = duplicateTestItemId => {
    const {
      onSaveTestId,
      test: { title, _id: testId },
      clearDictAlignment,
      history
    } = this.props;
    if (!title) {
      return message.error("Name field cannot be empty");
    }
    clearDictAlignment();
    onSaveTestId();
    history.push(`/author/tests/${testId}/createItem/${duplicateTestItemId}`);
  };

  handlePreviewTestItem = data => {
    this.setState({
      item: { id: data }
    });
    this.setModalVisibility(true);
  };

  closeModal = () => {
    this.setModalVisibility(false);
    this.props.clearEvaluation();
  };

  // changing this
  handleChangeField = (field, value) => {
    const { setData, updateDefaultThumbnail } = this.props;
    if (field === "thumbnail") {
      updateDefaultThumbnail("");
    }
    setData({ [field]: value });
  };

  hidePreviewModal = () => {
    const { clearAnswer, clearEvaluation } = this.props;
    this.setState({ isTestPreviewModalVisible: false }, () => {
      clearAnswer();
      clearEvaluation();
    });
  };

  showTestPreviewModal = () => {
    const { test } = this.props;
    this.setState({ isTestPreviewModalVisible: true, currentTestId: test._id });
  };

  handleScroll = e => {
    const element = e.target;
    if (this.secondHeaderRef.current) {
      if (element.scrollTop > 50 && !this.state.hasStickyHeader) {
        this.secondHeaderRef.current.classList.add("fixed-second-header");
        this.setState({ hasStickyHeader: true });
      } else if (element.scrollTop <= 50 && this.state.hasStickyHeader) {
        this.secondHeaderRef.current.classList.remove("fixed-second-header");
        this.setState({ hasStickyHeader: false });
      }
    }
  };

  closeTestPreviewModal = () => {
    this.setState({ isTestPreviewModalVisible: false });
  };

  render() {
    const {
      test,
      current,
      windowWidth,
      rows,
      standards,
      onChangeGrade,
      onChangeSubjects,
      onChangeCollection,
      questions,
      owner,
      defaultThumbnail,
      isEditable = false,
      itemsSubjectAndGrade,
      checkAnswer,
      showAnswer,
      showCancelButton,
      userFeatures,
      testItems
    } = this.props;
    const {
      isCollapse,
      isShowSummary,
      isModalVisible,
      item,
      isTestPreviewModalVisible,
      currentTestId,
      hasStickyHeader
    } = this.state;

    const questionsCount = testItems.length;
    // when redirected from other pages, sometimes, test will only be having
    // ids in its testitems, which could create issues.
    if (test.itemGroups[0].items && test.itemGroups[0].items.some(i => typeof i === "string")) {
      return <div />;
    }

    const selected = test.itemGroups
      .flatMap(itemGroup => itemGroup.items || [])
      .reduce((acc, element, i) => {
        if (element.selected) {
          acc.push(i);
        }
        return acc;
      }, []);
    const breadcrumbData = [
      {
        title: showCancelButton ? "ASSIGNMENTS / EDIT TEST" : "TESTS LIBRARY",
        to: showCancelButton ? "/author/assignments" : "/author/tests"
      },
      {
        title: current,
        to: ""
      }
    ];

    const isSmallSize = windowWidth > 993 ? 1 : 0;
    const grades = _uniq([...test.grades, ...itemsSubjectAndGrade.grades]);
    const subjects = _uniq([...test.subjects, ...itemsSubjectAndGrade.subjects]);
    const collections = get(test, "collections", []);
    const passages = get(test, "passages", []);
    const passagesKeyed = keyBy(passages, "_id");
    return (
      <Content hideOverflow={isModalVisible || isTestPreviewModalVisible} ref={this.ContainerRef}>
        <ReviewPageContainer>
          <Row>
            <Col lg={24} xl={owner && isEditable ? 24 : 18}>
              <div ref={this.secondHeaderRef}>
                <SecondHeader>
                  <Breadcrumb data={breadcrumbData} style={{ position: "unset" }} hasStickyHeader={hasStickyHeader} />
                  <HeaderBar
                    onSelectAll={this.handleSelectAll}
                    itemTotal={testItems.length}
                    selectedItems={selected}
                    onRemoveSelected={this.handleRemoveSelected}
                    onCollapse={this.handleCollapse}
                    onMoveTo={this.handleMoveTo}
                    owner={owner}
                    isEditable={isEditable}
                    windowWidth={windowWidth}
                    setCollapse={isCollapse}
                    toggleSummary={this.toggleSummary}
                    isShowSummary={isShowSummary}
                    onShowTestPreview={this.showTestPreviewModal}
                    hasStickyHeader={hasStickyHeader}
                    itemGroups={test.itemGroups}
                  />
                </SecondHeader>
              </div>
            </Col>
          </Row>
          <ReviewContentWrapper>
            <ReviewLeftContainer lg={24} xl={18}>
              <Paper padding="15px" style={{ overflow: "hidden" }}>
                {isCollapse ? (
                  <ItemsTable
                    items={testItems}
                    setSelected={this.setSelected}
                    selected={selected}
                    isEditable={isEditable}
                    owner={owner}
                    scoring={test.scoring}
                    questions={questions}
                    rows={rows}
                    mobile={!isSmallSize}
                    onChangePoints={this.handleChangePoints}
                    handlePreview={this.handlePreviewTestItem}
                    isCollapse={isCollapse}
                    passagesKeyed={passagesKeyed}
                    gradingRubricsFeature={userFeatures.gradingrubrics}
                  />
                ) : (
                  <List
                    onChangePoints={this.handleChangePoints}
                    onPreview={this.handlePreviewTestItem}
                    testItems={testItems}
                    rows={rows}
                    standards={standards}
                    selected={selected}
                    setSelected={this.setSelected}
                    onSortEnd={this.moveTestItems}
                    shouldCancelStart={() => {}}
                    owner={owner}
                    isEditable={isEditable}
                    scoring={test.scoring}
                    questions={questions}
                    mobile={!isSmallSize}
                    passagesKeyed={passagesKeyed}
                    useDragHandle
                    isCollapse={isCollapse}
                    gradingRubricsFeature={userFeatures.gradingrubrics}
                  />
                )}
              </Paper>
            </ReviewLeftContainer>
            {isShowSummary && (
              <ReviewSummaryWrapper lg={24} xl={6}>
                <ReviewSummary
                  grades={grades}
                  subjects={subjects}
                  collections={collections}
                  owner={owner}
                  isEditable={isEditable}
                  onChangeField={this.handleChangeField}
                  thumbnail={defaultThumbnail || test.thumbnail}
                  onChangeGrade={onChangeGrade}
                  onChangeSubjects={onChangeSubjects}
                  onChangeCollection={onChangeCollection}
                  windowWidth={windowWidth}
                />
              </ReviewSummaryWrapper>
            )}
          </ReviewContentWrapper>
          {isModalVisible && (
            <PreviewModal
              testId={get(this.props, "match.params.id", false)}
              isTest={!!test}
              isVisible={isModalVisible}
              onClose={this.closeModal}
              showModal
              isEditable={isEditable}
              owner={owner}
              addDuplicate={this.handleDuplicateItem}
              page="review"
              data={item}
              questions={questions}
              checkAnswer={() => checkAnswer(item)}
              showAnswer={() => showAnswer(item)}
              showEvaluationButtons
            />
          )}
          <TestPreviewModal
            isModalVisible={isTestPreviewModalVisible}
            testId={currentTestId}
            test={test}
            closeTestPreviewModal={this.hidePreviewModal}
          />
        </ReviewPageContainer>
      </Content>
    );
  }
}

Review.propTypes = {
  test: PropTypes.object.isRequired,
  onChangeGrade: PropTypes.func.isRequired,
  onChangeSubjects: PropTypes.func.isRequired,
  rows: PropTypes.array.isRequired,
  setData: PropTypes.func.isRequired,
  standards: PropTypes.object.isRequired,
  summary: PropTypes.array.isRequired,
  clearDictAlignment: PropTypes.func.isRequired,
  owner: PropTypes.bool,
  onSaveTestId: PropTypes.func,
  current: PropTypes.string.isRequired,
  history: PropTypes.any.isRequired,
  clearAnswer: PropTypes.func.isRequired,
  checkAnswer: PropTypes.func.isRequired,
  showAnswer: PropTypes.func.isRequired,
  windowWidth: PropTypes.number.isRequired,
  questions: PropTypes.object.isRequired,
  itemsSubjectAndGrade: PropTypes.any.isRequired,
  isEditable: PropTypes.bool.isRequired,
  defaultThumbnail: PropTypes.any.isRequired
};

Review.defaultProps = {
  owner: false,
  onSaveTestId: () => {}
};

const enhance = compose(
  withRouter,
  withWindowSizes,
  connect(
    state => ({
      standards: getStandardsSelector(state),
      summary: getSummarySelector(state),
      createTestItemModalVisible: getCreateItemModalVisibleSelector(state),
      questions: getQuestionsSelectorForReview(state),
      defaultThumbnail: getDefaultThumbnailSelector(state),
      itemsSubjectAndGrade: getItemsSubjectAndGradeSelector(state),
      userFeatures: getUserFeatures(state),
      currentGroupIndex: getCurrentGroupIndexSelector(state),
      testItems: getTestItemsSelector(state)
    }),
    {
      setData: setTestDataAction,
      updateDefaultThumbnail: updateDefaultThumbnailAction,
      clearDictAlignment: clearDictAlignmentAction,
      checkAnswer: previewCheckAnswerAction,
      showAnswer: previewShowAnswerAction,
      clearAnswer: clearAnswersAction,
      clearEvaluation: clearEvaluationAction,
      setTestItems: setTestItemsAction,
      addItemsToAutoselectGroupsRequest: addItemsToAutoselectGroupsRequestAction
    }
  )
);

export default enhance(Review);
