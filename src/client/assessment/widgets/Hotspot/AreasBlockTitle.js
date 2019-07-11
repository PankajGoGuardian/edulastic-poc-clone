import React, { Component } from "react";
import PropTypes from "prop-types";
import { compose } from "redux";
import { withTheme } from "styled-components";

import { withNamespaces } from "@edulastic/localization";
import { Subtitle } from "../../styled/Subtitle";
import Question from "../../components/Question";

import AreasContainer from "./AreasContainer";

class AreasBlockTitle extends Component {
  render() {
    const { item, t, fillSections, cleanSections } = this.props;

    const { image, areas } = item;

    const width = image ? image.width : 900;
    const height = image ? image.height : 470;
    const file = image ? image.source : "";

    return (
      <Question
        section="main"
        label={t("component.hotspot.areasBlockTitle")}
        fillSections={fillSections}
        cleanSections={cleanSections}
      >
        <Subtitle>{t("component.hotspot.areasBlockTitle")}</Subtitle>

        <AreasContainer areas={areas} itemData={item} width={+width} height={+height} imageSrc={file} />
      </Question>
    );
  }
}

AreasBlockTitle.propTypes = {
  item: PropTypes.object.isRequired,
  t: PropTypes.func.isRequired,
  fillSections: PropTypes.func,
  cleanSections: PropTypes.func
};

AreasBlockTitle.defaultProps = {
  fillSections: () => {},
  cleanSections: () => {}
};

const enhance = compose(
  withNamespaces("assessment"),
  withTheme
);

export default enhance(AreasBlockTitle);
