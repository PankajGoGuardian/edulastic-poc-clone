/* eslint-disable react/prop-types */
import React from "react";
import PropTypes from "prop-types";
import { compose } from "redux";
import { connect } from "react-redux";
import { ThemeProvider } from "styled-components";
import { isEmpty, sortBy } from "lodash";

import { withNamespaces } from "@edulastic/localization";

import { Container } from "../common";
import SubmitConfirmation from "../common/SubmitConfirmation";
import PlayerHeader from "../AssessmentPlayerSimple/PlayerHeader";
import { themes } from "../../../theme";
import assessmentPlayerTheme from "../AssessmentPlayerSimple/themeStyle";
import Worksheet from "../../../author/AssessmentPage/components/Worksheet/Worksheet";
import { changeViewAction } from "../../../author/src/actions/view";
import { questionType } from "@edulastic/constants";
import { testLoadingSelector } from "../../selectors/test";
import { getZoomedTheme } from "../../../student/zoomTheme";
import { playersZoomTheme } from "../assessmentPlayersTheme";

class AssessmentPlayerDocBased extends React.Component {
  static propTypes = {
    docUrl: PropTypes.string,
    annotations: PropTypes.array,
    theme: PropTypes.object,
    pageStructure: PropTypes.array.isRequired,
    history: PropTypes.object.isRequired,
    changeView: PropTypes.func.isRequired,
    questionsById: PropTypes.object.isRequired,
    answers: PropTypes.array.isRequired,
    saveProgress: PropTypes.func.isRequired,
    answersById: PropTypes.object.isRequired,
    loading: PropTypes.bool.isRequired,
    gotoSummary: PropTypes.func.isRequired
  };

  static defaultProps = {
    docUrl: "",
    annotations: [],
    theme: themes
  };

  state = {
    showExitPopup: false
  };

  componentDidMount() {
    const { changeView } = this.props;
    changeView("review");
  }

  openExitPopup = () => {
    this.setState({ showExitPopup: true });
  };

  hideExitPopup = () => {
    this.setState({ showExitPopup: false });
  };

  finishTest = () => {
    const { history } = this.props;
    history.push("/home/assignments");
  };

  handlePause = () => {
    this.handleSaveProgress();
    this.finishTest();
  };

  handleSaveProgress = () => {
    const { saveProgress } = this.props;
    saveProgress();
  };

  assessmentQuestions() {
    const { items } = this.props;
    const itemData = items[0].data;
    if (isEmpty(itemData)) return;
    const questionsWithSections = itemData.questions.concat(itemData.resources);
    return sortBy(questionsWithSections, item => item.qIndex);
  }

  render() {
    const { showExitPopup } = this.state;
    const {
      theme,
      items,
      t,
      docUrl,
      annotations,
      questionsById,
      answers,
      answersById,
      loading,
      pageStructure = [],
      freeFormNotes,
      gotoSummary,
      zoomLevel,
      selectedTheme
    } = this.props;

    const dropdownOptions = items[0].data.questions
      .filter(q => q.type !== questionType.SECTION_LABEL)
      .map((item, index) => index);
    const currentItem = answers.filter(answer => !isEmpty(answer)).length - 1;
    const questions = this.assessmentQuestions();

    let themeToPass = theme[selectedTheme] || theme.default;

    themeToPass = { ...themeToPass, ...assessmentPlayerTheme };
    themeToPass = getZoomedTheme(themeToPass, zoomLevel);
    themeToPass = playersZoomTheme(themeToPass);

    return (
      <ThemeProvider theme={themeToPass}>
        <Container style={{ paddingTop: "80px" }}>
          <PlayerHeader
            {...this.props}
            theme={themeToPass}
            dropdownOptions={dropdownOptions}
            onOpenExitPopup={this.openExitPopup}
            currentItem={currentItem}
            onPause={this.handlePause}
            onSaveProgress={this.handleSaveProgress}
            onSubmit={gotoSummary}
            showSubmit
            t={t}
          />
          {!loading && (
            <Worksheet
              docUrl={docUrl}
              annotations={annotations}
              questions={questions}
              freeFormNotes={freeFormNotes}
              questionsById={questionsById}
              pageStructure={pageStructure}
              answersById={answersById}
              viewMode="review"
              review
              noCheck
            />
          )}
          <SubmitConfirmation isVisible={showExitPopup} onClose={this.hideExitPopup} finishTest={this.finishTest} />
        </Container>
      </ThemeProvider>
    );
  }
}

const enhance = compose(
  withNamespaces("common"),
  connect(
    state => ({
      loading: testLoadingSelector(state),
      zoomLevel: state.ui.zoomLevel,
      selectedTheme: state.ui.selectedTheme
    }),
    {
      changeView: changeViewAction
    }
  )
);

export default enhance(AssessmentPlayerDocBased);
