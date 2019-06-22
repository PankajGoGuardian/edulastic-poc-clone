import React, { Component } from "react";
import PropTypes from "prop-types";
import ReactDOM from "react-dom";
import { Input, Row, Col } from "antd";

import { withNamespaces } from "@edulastic/localization";
import { EduButton, FlexContainer } from "@edulastic/common";

import { Widget } from "../../../styled/Widget";
import { Subtitle } from "../../../styled/Subtitle";

import { IconTrash } from "../styled/IconTrash";

class TextBlocks extends Component {
  componentDidMount = () => {
    const { fillSections, t } = this.props;
    const node = ReactDOM.findDOMNode(this);

    fillSections("advanced", t("component.options.textBlocks"), node.offsetTop, node.scrollHeight);
  };

  componentDidUpdate(prevProps) {
    const { advancedAreOpen, fillSections, t } = this.props;

    const node = ReactDOM.findDOMNode(this);

    if (prevProps.advancedAreOpen !== advancedAreOpen) {
      fillSections("advanced", t("component.options.textBlocks"), node.offsetTop, node.scrollHeight);
    }
  }

  componentWillUnmount() {
    const { cleanSections } = this.props;

    cleanSections();
  }

  render() {
    const { blocks, onChange, onAdd, onDelete, advancedAreOpen, t } = this.props;
    return (
      <Widget style={{ display: advancedAreOpen ? "block" : "none" }}>
        <Subtitle>{t("component.options.textBlocks")}</Subtitle>

        <Row gutter={32}>
          {blocks.map((block, index) => (
            <Col style={{ marginBottom: 15 }} span={12}>
              <FlexContainer>
                <Input
                  style={{ width: "100%" }}
                  size="large"
                  value={block}
                  onChange={e => onChange({ index, value: e.target.value })}
                />
                <IconTrash onClick={() => onDelete(index)} />
              </FlexContainer>
            </Col>
          ))}
        </Row>

        <EduButton onClick={onAdd} type="primary">
          {t("component.options.addTextBlock")}
        </EduButton>
      </Widget>
    );
  }
}

TextBlocks.propTypes = {
  blocks: PropTypes.array.isRequired,
  onChange: PropTypes.func.isRequired,
  onAdd: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
  t: PropTypes.func.isRequired,
  advancedAreOpen: PropTypes.bool,
  fillSections: PropTypes.func,
  cleanSections: PropTypes.func
};

TextBlocks.defaultProps = {
  advancedAreOpen: false,
  fillSections: () => {},
  cleanSections: () => {}
};

export default withNamespaces("assessment")(TextBlocks);
