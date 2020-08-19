import React, { Component } from "react";
import styled from "styled-components";
import PropTypes from "prop-types";
import { Collapse, Icon } from "antd";
import { greyThemeLighter, greyThemeDark2, greyThemeLight } from "@edulastic/colors";
import { withNamespaces } from "@edulastic/localization";
import { TextInputStyled } from "../../../styled/InputStyles";

const { Panel } = Collapse;

const AnswerContainer = styled.div`
  .ant-collapse-item {
    border: 1px solid ${greyThemeLight};
    margin-bottom: 4px;

    .ant-collapse-header {
      background-color: ${greyThemeLighter};
      color: ${greyThemeDark2};
      font-weight: 600;
      padding: 6px 16px;
    }

    .ant-collapse-content {
      margin-top: 8px;
    }
  }
`;

class ClozeInputAnswer extends Component {
  onChangeHandler = (value, answerId) => {
    const { onChange: changeAnswers } = this.props;
    changeAnswers({ value, answerId });
  };

  render() {
    const {
      answers,
      item: { uiStyle, responseContainers = [] }
    } = this.props;

    return (
      <AnswerContainer>
        <Collapse
          onChange={() => {}}
          bordered={false}
          expandIconPosition="right"
          expandIcon={({ isActive }) => (isActive ? <Icon type="caret-up" /> : <Icon type="caret-down" />)}
        >
          {answers.map(answer => {
            const response = responseContainers.find(respCont => respCont.id === answer.id);
            const width = response && response.widthpx ? `${response.widthpx}px` : `${uiStyle.minWidth}px` || "auto";
            const height = response && response.heightpx ? `${response.heightpx}px` : "auto";
            return (
              <Panel header={`Text Input ${answer.index + 1}`} key={answer.index}>
                <TextInputStyled
                  style={{ width, height, minWidth: "140px", minHeight: "35px" }}
                  value={answer.value}
                  onChange={e => this.onChangeHandler(e.target.value, answer.id)}
                />
              </Panel>
            );
          })}
        </Collapse>
      </AnswerContainer>
    );
  }
}

ClozeInputAnswer.propTypes = {
  answers: PropTypes.array.isRequired,
  onChange: PropTypes.func.isRequired,
  item: PropTypes.object.isRequired
};

export default withNamespaces("assessment")(ClozeInputAnswer);
