import React, { useState } from "react";
import { IconSearch, IconClose } from "@edulastic/icons";
import {
  SearchBoxContainer,
  StyledInput,
  StyledLink,
  PossibleInsights,
  InsightsTitle,
  InsightsItem,
  InsightsItemIndex
} from "./styled";

const SearchBox = () => {
  const [visible, setVisible] = useState(false);
  const showDrawer = () => {
    setVisible(true);
  };
  const onClose = () => {
    setVisible(false);
  };
  return (
    <SearchBoxContainer>
      <StyledInput placeholder="What insights are you looking for?" prefix={<IconSearch />} />
      <StyledLink onClick={showDrawer}>EXPLORE ALL QUESTIONS</StyledLink>

      <PossibleInsights placement="right" closable={false} onClose={onClose} visible={visible}>
        <InsightsTitle>
          <span>Possible Insights</span>
          <IconClose onClick={onClose} />
        </InsightsTitle>
        <InsightsItem>
          <InsightsItemIndex>1</InsightsItemIndex>
          <span>Are my students on track to master standards?</span>
        </InsightsItem>
        <InsightsItem>
          <InsightsItemIndex>2</InsightsItemIndex>
          <span>Who is at risk for not meeting state targets?</span>
        </InsightsItem>
        <InsightsItem>
          <InsightsItemIndex>2</InsightsItemIndex>
          <span>Which teachers are getting good results?</span>
        </InsightsItem>
      </PossibleInsights>
    </SearchBoxContainer>
  );
};

export default SearchBox;
