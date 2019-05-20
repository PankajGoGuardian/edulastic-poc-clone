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

import PassageView from "./PassageView";
import Details from "./Details";

const EmptyWrapper = styled.div``;

const Passage = ({
  item,
  view,
  smallSize,
  setQuestionData,
  t,
  fillSections,
  cleanSections,
  advancedAreOpen,
  ...restProps
}) => {
  const Wrapper = smallSize ? EmptyWrapper : Paper;
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
      <Wrapper>
        <PassageView preview item={itemForPreview} {...restProps} />
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
