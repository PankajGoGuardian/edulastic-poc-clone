import React, { Component } from "react";
import PropTypes from "prop-types";
import produce from "immer";
import ReactDOM from "react-dom";

import { withNamespaces } from "@edulastic/localization";

import { Subtitle } from "../../../styled/Subtitle";
import { Widget } from "../../../styled/Widget";
import withAddButton from "../../../components/HOC/withAddButton";

import ColorPickers from "./ColorPickers";

const LineColors = withAddButton(ColorPickers);

class LineColorOptionsSubtitle extends Component {
  componentDidMount = () => {
    const { fillSections, t } = this.props;
    const node = ReactDOM.findDOMNode(this);

    fillSections("main", t("component.highlightImage.lineColorOptionsSubtitle"), node.offsetTop, node.scrollHeight);
  };

  componentWillUnmount() {
    const { cleanSections } = this.props;

    cleanSections();
  }

  render() {
    const { item, setQuestionData, line_color, t } = this.props;

    const hexToRGB = (hex, alpha) => {
      const r = parseInt(hex.slice(1, 3), 16);

      const g = parseInt(hex.slice(3, 5), 16);

      const b = parseInt(hex.slice(5, 7), 16);

      if (alpha) {
        return `rgba(${r}, ${g}, ${b}, ${alpha})`;
      }
      return `rgb(${r}, ${g}, ${b})`;
    };

    const colorChange = i => obj => {
      setQuestionData(
        produce(item, draft => {
          draft.line_color[i] = hexToRGB(obj.color, (obj.alpha ? obj.alpha : 1) / 100);
        })
      );
    };

    const handleAddLineColor = () => {
      setQuestionData(
        produce(item, draft => {
          draft.line_color.push("#000000");
        })
      );
    };

    const handleRemove = i => () => {
      setQuestionData(
        produce(item, draft => {
          draft.line_color.splice(i, 1);
        })
      );
    };

    return (
      <Widget>
        <Subtitle>{t("component.highlightImage.lineColorOptionsSubtitle")}</Subtitle>

        <LineColors
          onRemove={line_color.length > 1 ? handleRemove : undefined}
          changeHandler={colorChange}
          colors={line_color}
          buttonText={t("component.highlightImage.addButtonText")}
          onAdd={handleAddLineColor}
        />
      </Widget>
    );
  }
}

LineColorOptionsSubtitle.propTypes = {
  line_color: PropTypes.object.isRequired,
  item: PropTypes.object.isRequired,
  setQuestionData: PropTypes.func.isRequired,
  t: PropTypes.func.isRequired,
  fillSections: PropTypes.func,
  cleanSections: PropTypes.func
};

LineColorOptionsSubtitle.defaultProps = {
  fillSections: () => {},
  cleanSections: () => {}
};

export default withNamespaces("assessment")(LineColorOptionsSubtitle);
