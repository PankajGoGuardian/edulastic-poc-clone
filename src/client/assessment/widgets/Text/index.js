import React, { memo } from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import { compose } from "redux";
import { connect } from "react-redux";
import { Paper } from "@edulastic/common";
import { withNamespaces } from "@edulastic/localization";
import { setQuestionDataAction } from "../../../author/QuestionEditor/ducks";
import { ContentArea } from "../../styled/ContentArea";
import TextContent from "./TextContent";
import TextContentPreview from "./TextContentPreview";

const EmptyWrapper = styled.div``;

const Text = ({
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

  if (view === "edit") {
    return (
      <ContentArea>
        <TextContent
          item={item}
          setQuestionData={setQuestionData}
          t={t}
          fillSections={fillSections}
          cleanSections={cleanSections}
        />
      </ContentArea>
    );
  }

  return (
    <Wrapper>
      <TextContentPreview item={item} />
    </Wrapper>
  );
};

Text.propTypes = {
  item: PropTypes.shape({
    id: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    type: PropTypes.string.isRequired
  }).isRequired,
  view: PropTypes.string.isRequired,
  smallSize: PropTypes.bool,
  setQuestionData: PropTypes.func.isRequired,
  t: PropTypes.func.isRequired,
  fillSections: PropTypes.func,
  cleanSections: PropTypes.func,
  advancedAreOpen: PropTypes.bool
};

Text.defaultProps = {
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
    { setQuestionData: setQuestionDataAction }
  )
);

const TextContainer = enhance(Text);

export { TextContainer as Text };
