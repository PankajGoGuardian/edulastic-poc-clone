import React from "react";
import { isEmpty } from "lodash";
import { FlexContainer, Tab, Tabs } from "@edulastic/common";
import { withNamespaces } from "@edulastic/localization";
import { IconClose } from "./styled/IconClose";

const AnswerTabs = ({ t, onTabChange, onCloseTab, correctTab, validation }) => {
  const hasAlt = !isEmpty(validation?.altResponses);
  if (!hasAlt) {
    return null;
  }

  const closeTabHandler = tabIndex => e => {
    e.stopPropagation();
    // tabArr includes correctAnswer as well,
    // so we should decrease 1 from tabIndex.
    onCloseTab(tabIndex - 1);
  };

  const renderLabel = tabIndex => (
    <FlexContainer>
      <span>
        {t("component.correctanswers.alternate")} {tabIndex}
      </span>
      <IconClose onClick={closeTabHandler(tabIndex)} data-cy="del-alter" />
    </FlexContainer>
  );

  // +1 is correctAnswer, numOfAnswers is always greater than 1.
  const numOfAnswers = (validation?.altResponses?.length || 0) + 1;
  const tabs = new Array(numOfAnswers).fill(true).map((_, i) => {
    const tabLabel = i === 0 ? t("component.correctanswers.correct") : renderLabel(i);
    return <Tab key={i} label={tabLabel} type="primary" />;
  });

  return (
    <Tabs value={correctTab} onChange={onTabChange}>
      {tabs}
    </Tabs>
  );
};

export default withNamespaces("assessment")(AnswerTabs);
