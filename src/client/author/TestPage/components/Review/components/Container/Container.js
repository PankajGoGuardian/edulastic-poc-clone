import React, { PureComponent } from "react";
import { Row, Col, message } from "antd";
import PropTypes from "prop-types";
import { cloneDeep, get, uniq as _uniq, flatMap, map, uniqBy } from "lodash";
import { connect } from "react-redux";
import { compose } from "redux";
import { withRouter } from "react-router-dom";
import { Paper, withWindowSizes, helpers } from "@edulastic/common";
import PreviewModal from "../../../../../src/components/common/PreviewModal";
import HeaderBar from "../HeaderBar/HeaderBar";
import List from "../List/List";
import ItemsTable from "../ReviewItemsTable/ReviewItemsTable";
import { getItemsSubjectAndGradeSelector } from "../../../AddItems/ducks";
import { getStandardsSelector } from "../../ducks";
import {
  setTestDataAction,
  previewCheckAnswerAction,
  previewShowAnswerAction,
  getDefaultThumbnailSelector,
  updateDefaultThumbnailAction
} from "../../../../ducks";
import { clearAnswersAction } from "../../../../../src/actions/answers";
import { getSummarySelector } from "../../../Summary/ducks";
import { getQuestionsSelectorForReview } from "../../../../../sharedDucks/questions";
import Breadcrumb from "../../../../../src/components/Breadcrumb";
import ReviewSummary from "../ReviewSummary/ReviewSummary";
import { SecondHeader, ReviewPageContainer, ReviewSummaryWrapper } from "./styled";
import { clearDictAlignmentAction } from "../../../../../src/actions/dictionaries";
import { getCreateItemModalVisibleSelector } from "../../../../../src/selectors/testItem";
import TestPreviewModal from "../../../../../Assignments/components/Container/TestPreviewModal";

const getTotalScore = ({ testItems, scoring }) =>
  testItems.map(item => scoring[item._id] || helpers.getPoints(item)).reduce((total, s) => total + s, 0);

const getStandardWiseSummary = (question, point) => {
  let standardSummary;
  if (question) {
    const points = point;
    const alignment = get(question, "alignment", []);
    standardSummary = flatMap(alignment, ({ domains, isEquivalentStandard = false, curriculumId }) =>
      flatMap(domains, ({ standards }) =>
        map(standards, ({ name }) => ({
          curriculumId: `${curriculumId}`,
          identifier: name,
          totalPoints: points,
          totalQuestions: 1,
          isEquivalentStandard
        }))
      )
    );
  }
  return standardSummary;
};

export const createSummaryData = (items, scoring) => {
  const summary = {
    totalPoints: 0,
    totalQuestions: 0,
    standards: []
  };
  for (const item of items) {
    const { itemLevelScoring, maxScore, itemLevelScore, _id } = item;
    const itemPoints = (itemLevelScoring === true && itemLevelScore) || maxScore;
    const questions = get(item, "data.questions", []);
    const itemTotalQuestions = questions.length;
    const questionWisePoints = helpers.getQuestionLevelScore(questions, helpers.getPoints(item), scoring[_id]);
    for (const question of questions) {
      const standardSummary = getStandardWiseSummary(question, questionWisePoints[question.id]);
      if (standardSummary) {
        summary.standards.push(...standardSummary);
      }
    }
    summary.standards = uniqBy(summary.standards, "identifier");
    summary.totalPoints += itemPoints;
    summary.totalQuestions += itemTotalQuestions;
  }
  return summary;
};
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

  state = {
    isCollapse: true,
    isModalVisible: false,
    item: [],
    isTestPreviewModalVisible: false,
    currentTestId: ""
  };

  componentWillUnmount() {
    window.removeEventListener("scroll", this.handleScroll);
  }

  componentDidMount() {
    window.addEventListener("scroll", this.handleScroll);
  }

  setSelected = values => {
    const { test, setData } = this.props;
    const newData = cloneDeep(test);

    newData.testItems = newData.testItems.map((item, i) => {
      if (values.includes(i)) {
        item.selected = true;
      } else {
        item.selected = false;
      }
      return item;
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
    const { test, setData } = this.props;
    const newData = cloneDeep(test);
    const itemsSelected = test.testItems.find(item => item.selected);
    if (!itemsSelected) {
      return message.warn("Please select at least one question to remove");
    }
    newData.testItems = test.testItems.filter(item => !item.selected);

    newData.scoring.testItems = test.scoring.testItems.filter(item => {
      const foundItem = test.testItems.find(({ id }) => id === item._id);
      return !(foundItem && foundItem.selected);
    });
    newData.summary = createSummaryData(newData.testItems, newData.scoring);
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

  moveTestItems = ({ oldIndex, newIndex }) => {
    const { test, setData } = this.props;
    const newData = cloneDeep(test);

    const [removed] = newData.testItems.splice(oldIndex, 1);
    newData.testItems.splice(newIndex, 0, removed);

    setData(newData);
  };

  handleMoveTo = newIndex => {
    const { test } = this.props;
    const oldIndex = test.testItems.findIndex(item => item.selected);
    this.moveTestItems({ oldIndex, newIndex });
  };

  handleChangePoints = (testItemId, value) => {
    /**
     * prevent zero or less
     */
    if (!(value > 0)) {
      return;
    }
    const { test, setData } = this.props;
    const newData = cloneDeep(test);

    if (!newData.scoring) newData.scoring = {};

    newData.scoring[testItemId] = value;
    newData.summary = createSummaryData(newData.testItems, newData.scoring);
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
  };

  get tableData() {
    const { summary } = this.props;
    return summary.map(data => ({
      key: data.standard,
      standard: data.standard,
      qs: data.questionsCount,
      points: data.score || 0
    }));
  }

  handleChangeField = (field, value) => {
    const { setData, updateDefaultThumbnail } = this.props;
    if (field === "thumbnail") {
      updateDefaultThumbnail("");
    }
    setData({ [field]: value });
  };

  hidePreviewModal = () => {
    const { clearAnswer } = this.props;
    this.setState({ isTestPreviewModalVisible: false }, () => clearAnswer());
  };

  showTestPreviewModal = () => {
    const { test } = this.props;
    this.setState({ isTestPreviewModalVisible: true, currentTestId: test._id });
  };

  handleScroll = e => {
    if (this.secondHeaderRef.current) {
      if (window.scrollY > 50) {
        this.secondHeaderRef.current.classList.add("fixed-second-header");
      } else {
        this.secondHeaderRef.current.classList.remove("fixed-second-header");
      }
    }
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
      questions,
      owner,
      defaultThumbnail,
      isEditable = false,
      itemsSubjectAndGrade,
      checkAnswer,
      showAnswer
    } = this.props;
    const { isCollapse, isModalVisible, item, isTestPreviewModalVisible, currentTestId } = this.state;

    const questionsCount = test.testItems.length;

    // when redirected from other pages, sometimes, test will only be having
    // ids in its testitems, which could create issues.
    if (test.testItem && test.testItems.some(i => typeof i === "string")) {
      return <div />;
    }

    const selected = test.testItems.reduce((acc, element, i) => {
      if (element.selected) {
        acc.push(i);
      }
      return acc;
    }, []);

    const breadcrumbData = [
      {
        title: "TESTS LIBRARY",
        to: "/author/tests"
      },
      {
        title: current,
        to: ""
      }
    ];

    const isSmallSize = windowWidth > 993 ? 1 : 0;
    const isMobileSize = windowWidth > 468 ? 1 : 0;
    const grades = _uniq([...test.grades, ...itemsSubjectAndGrade.grades]);
    const subjects = _uniq([...test.subjects, ...itemsSubjectAndGrade.subjects]);
    return (
      <ReviewPageContainer>
        <Row>
          <Col span={owner && isEditable ? 24 : 18}>
            <div ref={this.secondHeaderRef}>
              <SecondHeader isMobileSize={isMobileSize}>
                <Breadcrumb data={breadcrumbData} style={{ position: "unset" }} />
                <HeaderBar
                  onSelectAll={this.handleSelectAll}
                  itemTotal={test.testItems.length}
                  selectedItems={selected}
                  onRemoveSelected={this.handleRemoveSelected}
                  onCollapse={this.handleCollapse}
                  onMoveTo={this.handleMoveTo}
                  owner={owner}
                  isEditable={isEditable}
                  windowWidth={windowWidth}
                  setCollapse={isCollapse}
                  onShowTestPreview={this.showTestPreviewModal}
                />
              </SecondHeader>
            </div>
          </Col>
          <Col span={isSmallSize ? 18 : 24}>
            <Paper padding="15px">
              {isCollapse ? (
                <ItemsTable
                  items={test.testItems}
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
                />
              ) : (
                <List
                  onChangePoints={this.handleChangePoints}
                  onPreview={this.handlePreviewTestItem}
                  testItems={test.testItems}
                  rows={rows}
                  standards={standards}
                  selected={selected}
                  setSelected={this.setSelected}
                  onSortEnd={this.moveTestItems}
                  owner={owner}
                  isEditable={isEditable}
                  scoring={test.scoring}
                  questions={questions}
                  mobile={!isSmallSize}
                  useDragHandle
                />
              )}
            </Paper>
          </Col>
          <ReviewSummaryWrapper span={isSmallSize ? 6 : 24}>
            <ReviewSummary
              tableData={this.tableData}
              questionsCount={questionsCount}
              grades={grades}
              subjects={subjects}
              owner={owner}
              isEditable={isEditable}
              summary={test.summary || {}}
              onChangeField={this.handleChangeField}
              thumbnail={defaultThumbnail || test.thumbnail}
              totalPoints={getTotalScore(test)}
              onChangeGrade={onChangeGrade}
              onChangeSubjects={onChangeSubjects}
            />
          </ReviewSummaryWrapper>
        </Row>
        {isModalVisible && (
          <PreviewModal
            testId={get(this.props, "match.params.id", false)}
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
          hideModal={this.hidePreviewModal}
        />
      </ReviewPageContainer>
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
      itemsSubjectAndGrade: getItemsSubjectAndGradeSelector(state)
    }),
    {
      setData: setTestDataAction,
      updateDefaultThumbnail: updateDefaultThumbnailAction,
      clearDictAlignment: clearDictAlignmentAction,
      checkAnswer: previewCheckAnswerAction,
      showAnswer: previewShowAnswerAction,
      clearAnswer: clearAnswersAction
    }
  )
);

export default enhance(Review);
