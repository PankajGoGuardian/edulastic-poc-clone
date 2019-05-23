import React, { memo, useMemo } from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import { compose } from "redux";
import { connect } from "react-redux";

import { Paper } from "@edulastic/common";
import { white, boxShadowDefault } from "@edulastic/colors";
import { withNamespaces } from "@edulastic/localization";
import { setQuestionDataAction } from "../../../author/QuestionEditor/ducks";
import { replaceVariables } from "../../utils/variables";

import { ContentArea } from "../../styled/ContentArea";

import PassageView from "./PassageView";
import Details from "./Details";

const EmptyWrapper = styled.div``;

const PassageWrapper = styled(Paper)`
  border-radius: ${({ flowLayout }) => (flowLayout ? 0 : 10)}px;
  background: ${({ flowLayout }) => (flowLayout ? "transparent" : white)};
  padding: ${({ flowLayout }) => (flowLayout ? "0px" : "35px 43px")};
  box-shadow: ${({ flowLayout }) => (flowLayout ? "unset" : `0 3px 10px 0 ${boxShadowDefault}`)};
`;

const Passage = ({
  item,
  view,
  smallSize,
  setQuestionData,
  t,
  fillSections,
  cleanSections,
  advancedAreOpen,
  flowLayout,
  ...restProps
}) => {
  const Wrapper = smallSize ? EmptyWrapper : PassageWrapper;
  const itemForPreview = useMemo(() => replaceVariables(item), [item]);

  if (view === "edit") {
    return (
      <ContentArea>
        <Details item={item} fillSections={fillSections} cleanSections={cleanSections} />
      </ContentArea>
    );
  }

  if (view === "preview") {
    return (
      <Wrapper flowLayout={flowLayout}>
        <PassageView preview item={itemForPreview} flowLayout={flowLayout} {...restProps} />
      </Wrapper>
    );
  }
};

Passage.propTypes = {
  item: PropTypes.object.isRequired,
  view: PropTypes.string.isRequired,
  smallSize: PropTypes.bool,
  setQuestionData: PropTypes.func.isRequired,
  t: PropTypes.func.isRequired,
  advancedAreOpen: PropTypes.bool,
  fillSections: PropTypes.func,
  cleanSections: PropTypes.func
};

Passage.defaultProps = {
  smallSize: false,
  advancedAreOpen: false,
  fillSections: () => {},
  cleanSections: () => {}
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

const PassageContainer = enhance(Passage);

export { PassageContainer as Passage };
