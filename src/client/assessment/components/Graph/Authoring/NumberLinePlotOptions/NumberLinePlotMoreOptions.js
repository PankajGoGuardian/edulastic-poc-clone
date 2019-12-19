import React, { Component, Fragment } from "react";
import PropTypes from "prop-types";
import { withNamespaces } from "@edulastic/localization";

import Extras from "../../../../containers/Extras";
import { Subtitle } from "../../../../styled/Subtitle";

import { ScoreSettings } from "..";
import Tools from "../../common/Tools";
import DisplayOptions from "./DisplayOption";
import Question from "../../../Question";
import { getFormattedAttrId } from "@edulastic/common/src/helpers";

class NumberLinePlotMoreOptions extends Component {
  allControls = ["undo", "redo", "clear", "trash"];

  scoringTypes = [
    { label: "Exact match", value: "exactMatch" },
    { label: "Partial match", value: "partialMatch" }
    // { label: "Partial match per response", value: "partialMatchV2" }
  ];

  onSelectControl = control => {
    const { graphData, setControls } = this.props;
    const { controlbar } = graphData;

    let newControls = [...controlbar.controls];
    if (newControls.includes(control)) {
      newControls = newControls.filter(item => item !== control);
    } else {
      newControls.push(control);
    }

    setControls({
      ...controlbar,
      controls: [...this.allControls.filter(item => newControls.includes(item))]
    });
  };

  render() {
    const {
      t,
      fontSizeList,
      fillSections,
      cleanSections,
      setValidation,
      graphData,
      advancedAreOpen,
      setOptions,
      setNumberline,
      setCanvas
    } = this.props;

    const { canvas, uiStyle, numberlineAxis, controlbar } = graphData;

    return (
      <Fragment>
        <Question
          section="advanced"
          label={t("component.graphing.graphControls")}
          cleanSections={cleanSections}
          fillSections={fillSections}
          advancedAreOpen={advancedAreOpen}
        >
          <Subtitle id={getFormattedAttrId(`${graphData?.title}-${t("component.graphing.graphControls")}`)}>
            {t("component.graphing.graphControls")}
          </Subtitle>
          <Tools
            toolsAreVisible={false}
            selected={controlbar.controls}
            controls={this.allControls}
            onSelectControl={this.onSelectControl}
          />
        </Question>

        <ScoreSettings
          scoringTypes={this.scoringTypes}
          setValidation={setValidation}
          graphData={graphData}
          advancedAreOpen={advancedAreOpen}
          cleanSections={cleanSections}
          fillSections={fillSections}
        />

        <Question
          section="advanced"
          label={t("component.graphing.display")}
          cleanSections={cleanSections}
          fillSections={fillSections}
          advancedAreOpen={advancedAreOpen}
        >
          <Subtitle id={getFormattedAttrId(`${graphData?.title}-${t("component.graphing.display")}`)}>
            {t("component.graphing.display")}
          </Subtitle>
          <DisplayOptions
            uiStyle={uiStyle}
            canvas={canvas}
            fontSizeList={fontSizeList}
            numberlineAxis={numberlineAxis}
            setOptions={setOptions}
            setNumberline={setNumberline}
            setCanvas={setCanvas}
          />
        </Question>

        <Extras
          isSection={false}
          cleanSections={cleanSections}
          fillSections={fillSections}
          advancedAreOpen={advancedAreOpen}
          item={graphData}
        >
          <Extras.Distractors />
          <Extras.Hints />
        </Extras>
      </Fragment>
    );
  }
}

NumberLinePlotMoreOptions.propTypes = {
  t: PropTypes.func.isRequired,
  cleanSections: PropTypes.func.isRequired,
  fillSections: PropTypes.func.isRequired,
  setCanvas: PropTypes.func.isRequired,
  setNumberline: PropTypes.func.isRequired,
  setOptions: PropTypes.func.isRequired,
  fontSizeList: PropTypes.array.isRequired,
  setValidation: PropTypes.func.isRequired,
  graphData: PropTypes.object.isRequired,
  setControls: PropTypes.func.isRequired,
  advancedAreOpen: PropTypes.bool
};

NumberLinePlotMoreOptions.defaultProps = {
  advancedAreOpen: false
};

export default withNamespaces("assessment")(NumberLinePlotMoreOptions);
