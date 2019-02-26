import React, { Fragment } from "react";
import PropTypes from "prop-types";
import { compose } from "redux";
import { withNamespaces } from "@edulastic/localization";
import QuadrantsMoreOptions from "./QuadrantsMoreOptions";
import { ScoreSettings, ControlsSettings, AnnotationSettings, QuestionSection } from "../..";

const GraphQuadrantsOptions = ({
  graphData,
  fontSizeList,
  stemNumerationList,
  setOptions,
  setBgImg,
  setBgShapes,
  setControls,
  setAnnotation,
  setValidation,
  fillSections,
  cleanSections
}) => {
  return (
    <Fragment>
      <QuadrantsMoreOptions
        graphData={graphData}
        stemNumerationList={stemNumerationList}
        fontSizeList={fontSizeList}
        setOptions={setOptions}
        setBgImg={setBgImg}
        setBgShapes={setBgShapes}
        fillSections={fillSections}
        cleanSections={cleanSections}
      />
      <QuestionSection section="advanced" label="SCORING" cleanSections={cleanSections} fillSections={fillSections}>
        <ScoreSettings setValidation={setValidation} graphData={graphData} />
      </QuestionSection>
      <QuestionSection section="advanced" label="CONTROLS" cleanSections={cleanSections} fillSections={fillSections}>
        <ControlsSettings onChange={setControls} controlbar={graphData.controlbar} />
      </QuestionSection>
      <QuestionSection
        section="advanced"
        label="ANNOTATION"
        cleanSections={cleanSections}
        fillSections={fillSections}
        marginLast="0"
      >
        <AnnotationSettings annotation={graphData.annotation} setAnnotation={setAnnotation} />
      </QuestionSection>
    </Fragment>
  );
};

GraphQuadrantsOptions.propTypes = {
  t: PropTypes.func.isRequired,
  cleanSections: PropTypes.func.isRequired,
  fillSections: PropTypes.func.isRequired,
  setControls: PropTypes.func.isRequired,
  setValidation: PropTypes.func.isRequired,
  graphData: PropTypes.object.isRequired,
  stemNumerationList: PropTypes.array.isRequired,
  fontSizeList: PropTypes.array.isRequired,
  setOptions: PropTypes.func.isRequired,
  setBgImg: PropTypes.func.isRequired,
  setBgShapes: PropTypes.func.isRequired,
  setAnnotation: PropTypes.func.isRequired
};

const enhance = compose(withNamespaces("assessment"));

export default enhance(GraphQuadrantsOptions);
