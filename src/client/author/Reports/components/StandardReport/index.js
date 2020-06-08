import React from "react";

import FeaturesSwitch from "../../../../features/components/FeaturesSwitch";
import { MultipleAssessmentReport } from "../multipleAssessmentReport";
import { SingleAssessmentReport } from "../singleAssessmentReport";
import { StandardsMasteryReport } from "../standardsMasteryReport";
import { StudentProfileReport } from "../studentProfileReport";
import { SubscriptionReport } from "../subscriptionReport";
// import SearchBox from "./SearchBox";
import { StyledCard, StyledContainer } from "./styled";

const StandardReport = ({ premium }) => (
  <StyledContainer>
    {/* <SearchBox /> */}
    {premium && (
      <div>
        <FeaturesSwitch inputFeatures="singleAssessmentReport" actionOnInaccessible="hidden">
          <StyledCard className="single-assessment-reports report">
            <SingleAssessmentReport />
          </StyledCard>
        </FeaturesSwitch>

        <FeaturesSwitch inputFeatures="multipleAssessmentReport" actionOnInaccessible="hidden">
          <StyledCard className="multiple-assessment-reports report">
            <MultipleAssessmentReport />
          </StyledCard>
        </FeaturesSwitch>

        <StyledCard className="standards-mastery-reports report">
          <StandardsMasteryReport premium={premium} />
        </StyledCard>

        <FeaturesSwitch inputFeatures="studentProfileReport" actionOnInaccessible="hidden">
          <StyledCard className="student-profile-reports report">
            <StudentProfileReport />
          </StyledCard>
        </FeaturesSwitch>
      </div>
    )}
    {!premium && (
      <div>
        <StyledCard margin="0px 0px 20px" className="standards-mastery-reports report">
          <StandardsMasteryReport premium={premium} />
        </StyledCard>
        <StyledCard margin="0px 0px 20px" className="upgrade subscription report">
          <SubscriptionReport premium={premium} />
        </StyledCard>
      </div>
    )}
  </StyledContainer>
);
export default StandardReport;
