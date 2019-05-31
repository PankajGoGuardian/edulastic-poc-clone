import React, { Component, createRef } from "react";
import { v4 } from "uuid";
import { EduButton } from "@edulastic/common";
import { compose } from "redux";
import { withNamespaces } from "@edulastic/localization";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import produce from "immer";
import { Subtitle } from "../common/styled_components";
import { setQuestionDataAction, getQuestionDataSelector } from "../../../../author/QuestionEditor/ducks";
import Annotation from "./Annotation";
import { EditAnnotationsContainer } from "./styled/EditAnnotationsContainer";
import { AnnotationsStyle } from "./styled/styled_components";

class Annotations extends Component {
  ref = createRef();

  handleClick = evt => {
    const { setQuestionData, question } = this.props;

    const newQuestion = produce(question, draft => {
      const oldAnnotations = question.annotations || [];

      const position = { x: oldAnnotations.length * 50, y: 0 };

      const annotations = [
        ...oldAnnotations,
        {
          id: v4(),
          type: evt.key,
          value: "",
          position,
          size: {
            width: 120,
            height: 80
          }
        }
      ];
      draft.annotations = annotations;
    });

    setQuestionData(newQuestion);
  };

  handleUpdateAnnotation = (value, annotationIndex) => {
    const { setQuestionData, question } = this.props;

    setQuestionData(
      produce(question, draft => {
        const oldAnnotations = question.annotations || [];
        draft.annotations = oldAnnotations.map(annotation => {
          if (annotationIndex === annotation.id) {
            const modifiedAnnotation = { ...annotation };
            modifiedAnnotation.value = value;
            return modifiedAnnotation;
          }

          return annotation;
        });
      })
    );
  };

  handleRemoveAnnotation = annotationIndex => {
    const { setQuestionData, question } = this.props;

    setQuestionData(
      produce(question, draft => {
        const oldAnnotations = question.annotations || [];

        draft.annotations = oldAnnotations.filter(annotation => {
          if (annotationIndex === annotation.id) {
            return false;
          }

          return true;
        });
      })
    );
  };

  componentDidUpdate(prevProps, prevState) {
    // TODO: focus on last added field
  }

  render() {
    const { question, editable } = this.props;
    const { handleUpdateAnnotation, handleRemoveAnnotation } = this;

    const annotations = question.annotations || [];

    return (
      <AnnotationsStyle ref={this.ref}>
        <Subtitle>Annotations</Subtitle>

        {editable && (
          <EditAnnotationsContainer>
            <EduButton
              type="primary"
              style={{
                marginBottom: "30px",
                minWidth: 227,
                minHeight: 40,
                marginRight: "0.7em",
                borderRadius: "4px"
              }}
              onClick={this.handleClick}
            >
              ADD NEW ANNOTATION
            </EduButton>

            {annotations.map((annotation, i) => (
              <Annotation
                index={annotation.id}
                updateAnnotation={handleUpdateAnnotation}
                removeAnnotation={handleRemoveAnnotation}
                {...annotation}
              />
            ))}
          </EditAnnotationsContainer>
        )}
      </AnnotationsStyle>
    );
  }
}

Annotations.propTypes = {
  editable: PropTypes.bool,
  transformable: PropTypes.bool,
  question: PropTypes.object.isRequired,
  setQuestionData: PropTypes.func.isRequired
};

Annotations.defaultProps = {
  editable: false,
  transformable: false
};

const enhance = compose(
  withNamespaces("assessment"),
  connect(
    (state, ownProps) => ({
      question: getQuestionDataSelector(state),
      edit: ownProps.editable
    }),
    { setQuestionData: setQuestionDataAction }
  )
);

export default enhance(Annotations);
