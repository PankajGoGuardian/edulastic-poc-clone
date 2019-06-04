import React, { Component } from "react";
import PropTypes from "prop-types";
import ReactDOM from "react-dom";
import produce from "immer";
import { compose } from "redux";
import { withTheme } from "styled-components";

import { withNamespaces } from "@edulastic/localization";

import { updateVariables } from "../../utils/variables";

import ShadesView from "./components/ShadesView";

import { Subtitle } from "../../styled/Subtitle";
import { Widget } from "../../styled/Widget";
import { StyledCheckbox } from "./styled/StyledCheckbox";

class ShadesSubtitle extends Component {
  componentDidMount = () => {
    const { fillSections, t } = this.props;
    const node = ReactDOM.findDOMNode(this);

    fillSections("main", t("component.shading.shadesSubtitle"), node.offsetTop, node.scrollHeight);
  };

  componentWillUnmount() {
    const { cleanSections } = this.props;

    cleanSections();
  }

  render() {
    const { item, setQuestionData, t } = this.props;

    const { canvas } = item;

    const cell_width = canvas ? canvas.cell_width : 1;
    const cell_height = canvas ? canvas.cell_height : 1;
    const row_count = canvas ? canvas.row_count : 1;
    const column_count = canvas ? canvas.column_count : 1;
    const shaded = canvas ? canvas.shaded : [];
    const read_only_author_cells = canvas ? canvas.read_only_author_cells : false;

    const handleCanvasOptionsChange = (prop, val) => {
      setQuestionData(
        produce(item, draft => {
          draft.canvas[prop] = val;

          if (prop === "column_count" || prop === "row_count") {
            draft.canvas.shaded = [];
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
      <Widget>
        <Subtitle>{t("component.shading.shadesSubtitle")}</Subtitle>

        <div>
          <ShadesView
            colCount={column_count || 1}
            rowCount={row_count || 1}
            cellHeight={cell_height || 1}
            cellWidth={cell_width || 1}
            onCellClick={handleOnCellClick}
            border={item.border}
            hover={item.hover}
            shaded={shaded}
          />
        </div>

        <StyledCheckbox
          onChange={() => handleCanvasOptionsChange("read_only_author_cells", !read_only_author_cells)}
          defaultChecked={read_only_author_cells}
        >
          {t("component.shading.lockShadedCells")}
        </StyledCheckbox>
      </Widget>
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
