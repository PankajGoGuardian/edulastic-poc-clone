import React, { memo, useMemo } from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import { compose } from "redux";
import { connect } from "react-redux";

import { Paper } from "@edulastic/common";
import { withNamespaces } from "@edulastic/localization";
import { setQuestionDataAction } from "../../../author/QuestionEditor/ducks";
import { replaceVariables } from "../../utils/variables";

import { ContentArea } from "../../styled/ContentArea";

import ProtractorView from "./ProtractorView";
import Details from "./Details";

const EmptyWrapper = styled.div``;

const Protractor = ({
  item,
  view,
  smallSize,
  setQuestionData,
  t,
  cleanSections,
  fillSections,
  advancedAreOpen,
  ...restProps
}) => {
  const Wrapper = smallSize ? EmptyWrapper : Paper;
  const itemForPreview = useMemo(() => replaceVariables(item), [item]);

  if (view === "edit") {
    return (
      <ContentArea>
        <Details item={item} smallSize={smallSize} fillSections={fillSections} cleanSections={cleanSections} />
      </ContentArea>
    );
  }

  if (view === "preview") {
    return (
      <Wrapper>
        <ProtractorView smallSize={smallSize} item={itemForPreview} {...restProps} />
      </Wrapper>
    );
  }
};

Protractor.propTypes = {
  item: PropTypes.object.isRequired,
  view: PropTypes.string.isRequired,
  smallSize: PropTypes.bool.isRequired,
  setQuestionData: PropTypes.func.isRequired,
  t: PropTypes.func.isRequired,
  advancedAreOpen: PropTypes.bool,
  cleanSections: PropTypes.func,
  fillSections: PropTypes.func
};

Protractor.defaultProps = {
  advancedAreOpen: false,
  cleanSections: () => {},
  fillSections: () => {}
};

const enhance = compose(
  withNamespaces("assessment"),
  memo,
  connect(
    null,
    {
      setQuestionData: setQuestionDataAction
    }
  )
);

const ProtractorContainer = enhance(Protractor);

export { ProtractorContainer as Protractor };
