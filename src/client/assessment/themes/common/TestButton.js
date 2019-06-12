import React from "react";
import { compose } from "redux";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import styled from "styled-components";
import { Button } from "antd";
import { white } from "@edulastic/colors";
import { withNamespaces } from "@edulastic/localization";
import { IconCheck, IconLightBulb, IconBookmark } from "@edulastic/icons";
import ButtonLink from "./ButtonLink";
import { checkAnswerEvaluation } from "../../actions/checkanswer";

const TestButton = ({ t, checkAnswerEvaluation, settings, answerChecksUsedForItem }) => (
  <Container>
    {settings.maxAnswerChecks > 0 && (
      <StyledButton
        onClick={answerChecksUsedForItem >= settings.maxAnswerChecks ? "" : checkAnswerEvaluation}
        data-cy="checkAnswer"
        title={answerChecksUsedForItem >= settings.maxAnswerChecks ? "Usage limit exceeded" : ""}
      >
        <ButtonLink color="primary" icon={<IconCheck color={white} />} style={{ color: white }}>
          {t("common.test.checkanswer")}
        </ButtonLink>
      </StyledButton>
    )}

    <StyledButton>
      <ButtonLink color="primary" icon={<IconLightBulb color={white} />} style={{ color: white }}>
        {t("common.test.hint")}
      </ButtonLink>
    </StyledButton>
    <StyledButton>
      <ButtonLink color="primary" icon={<IconBookmark color={white} width={10} height={16} />} style={{ color: white }}>
        {t("common.test.bookmark")}
      </ButtonLink>
    </StyledButton>
  </Container>
);

TestButton.propTypes = {
  t: PropTypes.func.isRequired,
  checkAnswerEvaluation: PropTypes.func.isRequired
};

const enhance = compose(
  withNamespaces("student"),
  connect(
    null,
    { checkAnswerEvaluation }
  )
);

export default enhance(TestButton);

const Container = styled.div`
  margin-left: 60px;
`;

const StyledButton = styled(Button)`
  margin-right: 10px;
  background: transparent;
  height: 24px;
  &[disabled] {
    cursor: pointer;
    &:hover {
      background: transparent;
    }
    background: transparent;
  }
  &:hover {
    background: transparent;
  }
  &:focus {
    background: transparent;
  }
  &:active {
    background: transparent;
  }
`;
