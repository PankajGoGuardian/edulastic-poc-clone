import React, { Component } from "react";
import PropTypes from "prop-types";
import produce from "immer";
import ReactDOM from "react-dom";

import { withNamespaces } from "@edulastic/localization";
import { FlexContainer } from "@edulastic/common";

import { updateVariables } from "../../../utils/variables";

import { AdaptiveCheckbox } from "../styled/AdaptiveCheckbox";
import { Subtitle } from "../../../styled/Subtitle";
import { Widget } from "../../../styled/Widget";

class FormattingOptions extends Component {
  componentDidMount = () => {
    const { fillSections, t } = this.props;
    const node = ReactDOM.findDOMNode(this);

    fillSections("main", t("component.essayText.plain.formattingOptions"), node.offsetTop, node.scrollHeight);
  };

  componentWillUnmount = () => {
    const { cleanSections } = this.props;

    cleanSections();
  };

  render() {
    const { item, setQuestionData, t } = this.props;

    const handleItemChangeChange = (prop, uiStyle) => {
      setQuestionData(
        produce(item, draft => {
          draft[prop] = uiStyle;
          updateVariables(draft);
        })
      );
    };

    return (
      <Widget>
        <Subtitle>{t("component.essayText.plain.formattingOptions")}</Subtitle>
        <FlexContainer childMarginRight={100}>
          <AdaptiveCheckbox
            defaultChecked={item.show_copy}
            onChange={e => handleItemChangeChange("show_copy", e.target.checked)}
          >
            {t("component.essayText.copy")}
          </AdaptiveCheckbox>
          <AdaptiveCheckbox
            defaultChecked={item.show_cut}
            onChange={e => handleItemChangeChange("show_cut", e.target.checked)}
          >
            {t("component.essayText.cut")}
          </AdaptiveCheckbox>
          <AdaptiveCheckbox
            defaultChecked={item.show_paste}
            onChange={e => handleItemChangeChange("show_paste", e.target.checked)}
          >
            {t("component.essayText.paste")}
          </AdaptiveCheckbox>
        </FlexContainer>
      </Widget>
    );
  }
}

FormattingOptions.propTypes = {
  item: PropTypes.object.isRequired,
  setQuestionData: PropTypes.func.isRequired,
  t: PropTypes.func.isRequired,
  fillSections: PropTypes.func,
  cleanSections: PropTypes.func
};

FormattingOptions.defaultProps = {
  fillSections: () => {},
  cleanSections: () => {}
};

export default withNamespaces("assessment")(FormattingOptions);
