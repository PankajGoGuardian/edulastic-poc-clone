import React, { Component, createRef } from "react";
import { v4 } from "uuid";
import PropTypes from "prop-types";
import produce from "immer";

import { withNamespaces } from "@edulastic/localization";
import { getFormattedAttrId } from "@edulastic/common/src/helpers";
import Annotation from "./Annotation";
import { Subtitle } from "../../styled/Subtitle";
import { CustomStyleBtn } from "../../styled/ButtonStyles";

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

  render() {
    const { question, editable, t } = this.props;
    const { handleUpdateAnnotation, handleRemoveAnnotation } = this;

    const annotations = question.annotations || [];

    return (
      <div ref={this.ref} data-cy="annotations-container">
        <Subtitle id={getFormattedAttrId(`${question?.title}-Annotations`)}>
          {t("common.annotation.annotations")}
        </Subtitle>

        {editable && (
          <div>
            <CustomStyleBtn data-cy="addAnnotation" margin="0px 0px 15px" onClick={this.handleClick} width="156px">
              {t("common.annotation.addAnnotation")}
            </CustomStyleBtn>
            {annotations.map(annotation => (
              <Annotation
                key={annotation.id}
                index={annotation.id}
                updateAnnotation={handleUpdateAnnotation}
                removeAnnotation={handleRemoveAnnotation}
                {...annotation}
              />
            ))}
          </div>
        )}
      </div>
    );
  }
}

Annotations.propTypes = {
  editable: PropTypes.bool,
  transformable: PropTypes.bool,
  t: PropTypes.func.isRequired,
  question: PropTypes.object.isRequired,
  setQuestionData: PropTypes.func.isRequired
};

Annotations.defaultProps = {
  editable: false,
  transformable: false
};

export default withNamespaces("assessment")(Annotations);
