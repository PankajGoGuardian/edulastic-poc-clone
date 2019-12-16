import React from "react";
import styled from "styled-components";
import { Icon } from "antd";

import { black, fadedBlack, someGreyColor1, green } from "@edulastic/colors";

import { TextWrapper, LinkWrapper } from "../../../../author/Dashboard/components/styledComponents";

// demo data
const demoData = [
  {
    questionHeading: "Lorem ipsum",
    questionDescription: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse tincidunt augue"
  },
  {
    questionHeading: "Lorem ipsum",
    questionDescription: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse tincidunt augue"
  },
  {
    questionHeading: "Lorem ipsum",
    questionDescription: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse tincidunt augue"
  }
];

const QuestionItem = props => {
  const {
    question: { questionHeading, questionDescription }
  } = props;
  return (
    <div className={"question-item"}>
      <TextWrapper fw="900" size="20px" rfs="13px" color={fadedBlack}>
        {questionHeading}
      </TextWrapper>
      <TextWrapper size="14px" rfs="13px" color="#848993">
        {questionDescription}
      </TextWrapper>
      <Icon type="caret-right" />
    </div>
  );
};

const QuestionsList = props => {
  const { className } = props;
  return (
    <div className={className}>
      {demoData.map(item => (
        <QuestionItem question={item} />
      ))}
    </div>
  );
};

export const StyledQuestionsList = styled(QuestionsList)`
  .question-item {
    padding-bottom: 20px;
    padding-right: 25px;
    border-bottom: solid 1px ${someGreyColor1};
    position: relative;

    .anticon {
      position: absolute;
      right: 0;
      top: 28%;
      font-size: 18px;
      svg {
        fill: ${green};
      }
    }
  }
`;
