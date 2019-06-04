import React, { Component } from "react";
import PropTypes from "prop-types";
import ReactDOM from "react-dom";
import { compose } from "redux";
import { withTheme } from "styled-components";

import { withNamespaces } from "@edulastic/localization";
import { Subtitle } from "../../styled/Subtitle";
import { Widget } from "../../styled/Widget";

import AreasContainer from "./AreasContainer";

class AreasBlockTitle extends Component {
  componentDidMount = () => {
    const { fillSections, t } = this.props;
    const node = ReactDOM.findDOMNode(this);

    fillSections("main", t("component.hotspot.areasBlockTitle"), node.offsetTop, node.scrollHeight);
  };

  componentWillUnmount() {
    const { cleanSections } = this.props;

    cleanSections();
  }

  render() {
    const { item, t } = this.props;

    const { image, areas } = item;

    const width = image ? image.width : 900;
    const height = image ? image.height : 470;
    const file = image ? image.source : "";

    return (
      <Widget>
        <Subtitle>{t("component.hotspot.areasBlockTitle")}</Subtitle>

        <AreasContainer areas={areas} itemData={item} width={+width} height={+height} imageSrc={file} />
      </Widget>
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
