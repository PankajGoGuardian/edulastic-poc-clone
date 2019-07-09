import React, { Component } from "react";
import PropTypes from "prop-types";
import { compose } from "redux";
import { withTheme } from "styled-components";
import { cloneDeep, findIndex } from "lodash";

import { withNamespaces } from "@edulastic/localization";
import { evaluationType, questionType } from "@edulastic/constants";

import Layout from "./Layout";
import ResponseContainers from "./ResponseContainers";
import TextBlocks from "./TextBlocks";

import WidgetOptions from "../../../containers/WidgetOptions";
import Extras from "../../../containers/Extras";
import KeyPadOptions from "../../../components/KeyPadOptions";

class MathFormulaOptions extends Component {
  render() {
    const {
      onChange,
      uiStyle,
      t,
      responseContainers,
      textBlocks,
      item,
      fillSections,
      cleanSections,
      advancedAreOpen
    } = this.props;

    const changeResponseContainers = ({ index, prop, value }) => {
      const newContainers = cloneDeep(responseContainers);
      const ind = findIndex(newContainers, cont => cont.index === index);
      if (ind !== -1) {
        newContainers[ind][prop] = value;
        onChange("response_containers", newContainers);
      }
    };

    const addResponseContainer = () => {
      const { response_ids: responseIds } = item;
      const ind = responseContainers.length;
      let obj = {};
      outerLoop: if (!!responseIds) {
        for (const key in responseIds) {
          const responses = responseIds[key];
          for (const response of responses) {
            if (response.index === ind) {
              obj = { ...response };
              break outerLoop;
            }
          }
        }
      }
      onChange("response_containers", [...responseContainers, obj]);
    };

    const deleteResponseContainer = index => {
      const newContainers = cloneDeep(responseContainers);
      newContainers.splice(index, 1);
      onChange("response_containers", newContainers);
    };

    const changeTextBlock = ({ index, value }) => {
      const newBlocks = cloneDeep(textBlocks);
      newBlocks[index] = value;
      onChange("text_blocks", newBlocks);
    };

    const addTextBlock = () => {
      onChange("text_blocks", [...textBlocks, ""]);
    };

    const deleteTextBlock = index => {
      const newBlocks = cloneDeep(textBlocks);
      newBlocks.splice(index, 1);
      onChange("text_blocks", newBlocks);
    };

    const scoringTypes = [
      {
        value: evaluationType.EXACT_MATCH,
        label: t("component.math.exactMatch")
      }
    ];

    if (item && item.type === questionType.EXPRESSION_MULTIPART) {
      scoringTypes.push({
        value: evaluationType.PARTIAL_MATCH,
        label: t("component.math.partialMatch")
      });
    }

    return (
      <WidgetOptions
        scoringTypes={scoringTypes}
        advancedAreOpen={advancedAreOpen}
        fillSections={fillSections}
        cleanSections={cleanSections}
      >
        <Layout
          onChange={onChange}
          uiStyle={uiStyle}
          responseContainers={responseContainers}
          textBlocks={textBlocks}
          item={item}
          advancedAreOpen={advancedAreOpen}
          fillSections={fillSections}
          cleanSections={cleanSections}
        />

        <ResponseContainers
          containers={responseContainers}
          onChange={changeResponseContainers}
          onAdd={addResponseContainer}
          onDelete={deleteResponseContainer}
          advancedAreOpen={advancedAreOpen}
          fillSections={fillSections}
          cleanSections={cleanSections}
        />

        <KeyPadOptions
          onChange={onChange}
          item={item}
          advancedAreOpen={advancedAreOpen}
          fillSections={fillSections}
          cleanSections={cleanSections}
        />

        <TextBlocks
          blocks={textBlocks}
          onChange={changeTextBlock}
          onAdd={addTextBlock}
          onDelete={deleteTextBlock}
          advancedAreOpen={advancedAreOpen}
          fillSections={fillSections}
          cleanSections={cleanSections}
        />

        <Extras advancedAreOpen={advancedAreOpen} fillSections={fillSections} cleanSections={cleanSections}>
          <Extras.Distractors />
          <Extras.Hints />
        </Extras>
      </WidgetOptions>
    );
  }
}

MathFormulaOptions.propTypes = {
  onChange: PropTypes.func.isRequired,
  item: PropTypes.object.isRequired,
  responseContainers: PropTypes.array,
  t: PropTypes.func.isRequired,
  textBlocks: PropTypes.array,
  uiStyle: PropTypes.object,
  advancedAreOpen: PropTypes.bool,
  fillSections: PropTypes.func,
  cleanSections: PropTypes.func
};

MathFormulaOptions.defaultProps = {
  responseContainers: [],
  textBlocks: [],
  uiStyle: {
    type: "standard",
    fontsize: "normal",
    columns: 0,
    orientation: "horizontal",
    choice_label: "number"
  },
  advancedAreOpen: false,
  fillSections: () => {},
  cleanSections: () => {}
};

const enhance = compose(
  withNamespaces("assessment"),
  withTheme
);

export default enhance(MathFormulaOptions);
