import React, { Component } from "react";
import ReactDOM from "react-dom";
import PropTypes from "prop-types";
import { Input, Row, Col } from "antd";

import { withNamespaces } from "@edulastic/localization";
import { EduButton, FlexContainer } from "@edulastic/common";

import Question from "../../../components/Question";
import { Subtitle } from "../../../styled/Subtitle";

import { IconTrash } from "../styled/IconTrash";

class CustomKeys extends Component {
  componentDidMount = () => {
    const { fillSections, t } = this.props;
    const node = ReactDOM.findDOMNode(this);

    fillSections("advanced", t("component.options.customkeys"), node.offsetTop, node.scrollHeight);
  };

  componentDidUpdate(prevProps) {
    const { advancedAreOpen, fillSections, t } = this.props;

    const node = ReactDOM.findDOMNode(this);

    if (prevProps.advancedAreOpen !== advancedAreOpen) {
      fillSections("advanced", t("component.options.customkeys"), node.offsetTop, node.scrollHeight);
    }
  }

  componentWillUnmount() {
    const { cleanSections } = this.props;

    cleanSections();
  }

  render() {
    const { blocks, onChange, onAdd, onDelete, advancedAreOpen, t, fillSections, cleanSections } = this.props;
    return (
      <Question
        section="advanced"
        label={t("component.options.textBlocks")}
        advancedAreOpen={advancedAreOpen}
        fillSections={fillSections}
        cleanSections={cleanSections}
      >
        <Subtitle>{t("component.options.textBlocks")}</Subtitle>

        <Row gutter={32}>
          {blocks.map((block, index) => (
            <Col style={{ marginBottom: 15 }} span={12} key={index}>
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
      </Question>
    );
  }
}

CustomKeys.propTypes = {
  blocks: PropTypes.array.isRequired,
  onChange: PropTypes.func.isRequired,
  onAdd: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
  t: PropTypes.func.isRequired,
  advancedAreOpen: PropTypes.bool,
  fillSections: PropTypes.func,
  cleanSections: PropTypes.func
};

CustomKeys.defaultProps = {
  advancedAreOpen: false,
  fillSections: () => {},
  cleanSections: () => {}
};

export default withNamespaces("assessment")(CustomKeys);
