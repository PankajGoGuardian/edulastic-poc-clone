import React, { Component } from "react";
import PropTypes from "prop-types";
import produce from "immer";
import { compose } from "redux";
import { withTheme } from "styled-components";

import { withNamespaces } from "@edulastic/localization";
import { getFormattedAttrId } from "@edulastic/common/src/helpers";

import { updateVariables } from "../../utils/variables";

import ShadesView from "./components/ShadesView";

import { Subtitle } from "../../styled/Subtitle";
import Question from "../../components/Question";
import { CheckboxLabel } from "../../styled/CheckboxWithLabel";

class ShadesSubtitle extends Component {
  render() {
    const { item, setQuestionData, t, fillSections, cleanSections } = this.props;

    const { canvas } = item;

    const cell_width = canvas ? canvas.cell_width : 1;
    const cell_height = canvas ? canvas.cell_height : 1;
    const rowCount = canvas ? canvas.rowCount : 1;
    const columnCount = canvas ? canvas.columnCount : 1;
    const shaded = canvas ? canvas.shaded : [];
    const read_only_author_cells = canvas ? canvas.read_only_author_cells : false;

    const handleCanvasOptionsChange = (prop, val) => {
      setQuestionData(
        produce(item, draft => {
          draft.canvas[prop] = val;

          if (prop === "columnCount" || prop === "rowCount") {
            draft.canvas.shaded = [];
          }

          draft.validation.validResponse.value = [];
          if (draft.validation.altResponses) {
            draft.validation.altResponses.forEach(altResponse => {
              altResponse.value = [];
            });
          }

          updateVariables(draft);
        })
      );
    };

    const handleOnCellClick = (rowNumber, colNumber) => () => {
      setQuestionData(
        produce(item, draft => {
          const indexOfSameShade = draft.canvas.shaded.findIndex(
            shade => shade[0] === rowNumber && shade[1] === colNumber
          );

          if (indexOfSameShade === -1) {
            draft.canvas.shaded.push([rowNumber, colNumber]);
          } else {
            draft.canvas.shaded.splice(indexOfSameShade, 1);
          }

          updateVariables(draft);
        })
      );
    };

    return (
      <Question
        section="main"
        label={t("component.shading.shadesSubtitle")}
        fillSections={fillSections}
        cleanSections={cleanSections}
      >
        <Subtitle id={getFormattedAttrId(`${item?.title}-${t("component.shading.shadesSubtitle")}`)}>
          {t("component.shading.shadesSubtitle")}
        </Subtitle>

        <div>
          <ShadesView
            colCount={columnCount || 1}
            rowCount={rowCount || 1}
            cellHeight={cell_height || 1}
            cellWidth={cell_width || 1}
            onCellClick={handleOnCellClick}
            border={item.border}
            hover={item.hover}
            shaded={shaded}
            marginTop="20"
          />
        </div>

        <CheckboxLabel
          onChange={() => handleCanvasOptionsChange("read_only_author_cells", !read_only_author_cells)}
          defaultChecked={read_only_author_cells}
          mt="20px"
        >
          {t("component.shading.lockShadedCells")}
        </CheckboxLabel>
      </Question>
    );
  }
}

ShadesSubtitle.propTypes = {
  item: PropTypes.object.isRequired,
  setQuestionData: PropTypes.func.isRequired,
  t: PropTypes.func.isRequired,
  fillSections: PropTypes.func,
  cleanSections: PropTypes.func
};

ShadesSubtitle.defaultProps = {
  fillSections: () => {},
  cleanSections: () => {}
};

const enhance = compose(
  withNamespaces("assessment"),
  withTheme
);

export default enhance(ShadesSubtitle);
