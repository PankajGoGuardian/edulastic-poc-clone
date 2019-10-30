import React, { Fragment } from "react";
import PropTypes from "prop-types";
import { SortableElement } from "react-sortable-hoc";
import { compose } from "redux";
import { withTheme } from "styled-components";

import { FlexContainer, MathFormulaDisplay } from "@edulastic/common";
import { withNamespaces } from "@edulastic/localization";

import { Container } from "../styled/Container";
import { Text } from "../styled/Text";
import { Index } from "../styled/Index";
import { CorrectAnswerItem } from "../styled/CorrectAnswerItem";
import { QuestionText } from "../styled/QuestionText";
import { IconCorrectWrapper, IconCloseWrapper } from "../styled/IconWrapper";

const OrderListReportItem = SortableElement(
  ({ children, correctText, correct, showAnswers, ind, t, theme, columns, styleType }) => {
    return (
      <Fragment>
        <Container styleType={styleType} columns={columns} correct={correct}>
          <Text>
            <Index>{ind}</Index>
            <FlexContainer justifyContent="center">
              <MathFormulaDisplay dangerouslySetInnerHTML={{ __html: children }} />
            </FlexContainer>
            {correct && <IconCorrectWrapper color={theme.widgets.orderList.correctIconWrapperColor} />}
            {correct === false && <IconCloseWrapper color={theme.widgets.orderList.incorrectIconWrapperColor} />}
          </Text>
        </Container>
        {showAnswers && !correct && (
          <CorrectAnswerItem>
            <Text>
              <FlexContainer>
                <Index color={theme.widgets.orderList.incorrectIndexColor}>{ind}</Index>
                <QuestionText>
                  <span>{t("component.orderlist.correctanswer")}</span>{" "}
                  <MathFormulaDisplay dangerouslySetInnerHTML={{ __html: correctText }} />
                </QuestionText>
              </FlexContainer>
            </Text>
          </CorrectAnswerItem>
        )}
      </Fragment>
    );
  }
);

OrderListReportItem.propTypes = {
  children: PropTypes.string.isRequired,
  correct: PropTypes.bool.isRequired,
  showAnswers: PropTypes.bool,
  correctText: PropTypes.string,
  ind: PropTypes.number.isRequired,
  t: PropTypes.func.isRequired,
  theme: PropTypes.object.isRequired,
  columns: PropTypes.number,
  styleType: PropTypes.string
};

OrderListReportItem.defaultProps = {
  showAnswers: false,
  correctText: "",
  columns: 1,
  styleType: "button"
};

const enhance = compose(
  withNamespaces("assessment"),
  withTheme
);

export default enhance(OrderListReportItem);
