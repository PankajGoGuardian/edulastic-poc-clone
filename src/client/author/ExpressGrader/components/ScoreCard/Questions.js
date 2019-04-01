import React from "react";
import PropTypes from "prop-types";
import {
  StyledDivMid,
  StudentsCardRow,
  ViewDetails,
  IconExpand,
  QuestionContainer,
  QuestionRow,
  QuestionLabel
} from "./styled";

export default class Questions extends React.Component {
  static propTypes = {
    student: PropTypes.object
  };

  static defaultProps = {
    student: {}
  };

  state = {
    isDetail: false
  };

  toggleDetailView = () => {
    const { isDetail } = this.state;
    this.setState({ isDetail: !isDetail });
  };

  render() {
    const { student } = this.props;
    const { isDetail } = this.state;
    return (
      <React.Fragment>
        {isDetail && (
          <QuestionContainer>
            {student.questionActivities.map((question, i) => (
              <QuestionRow key={i}>
                <QuestionLabel>{`Question ${i + 1}`}</QuestionLabel>
                <QuestionLabel>{question.score ? question.score : "-"}</QuestionLabel>
              </QuestionRow>
            ))}
          </QuestionContainer>
        )}
        <StudentsCardRow>
          <StyledDivMid onClick={this.toggleDetailView}>
            <ViewDetails>questions details</ViewDetails>
            <IconExpand up={isDetail} />
          </StyledDivMid>
        </StudentsCardRow>
      </React.Fragment>
    );
  }
}
