import { EduButton, MainContentWrapper } from "@edulastic/common";
import React, { useState } from "react";
import { Link } from "react-router-dom";
// TODO: Update SVG imports here
import IMG1 from "../../static/1.png";
import IMG2 from "../../static/2.png";
import IMG3 from "../../static/3.png";
import IMG4 from "../../static/analysis.png";
import IMG5 from "../../static/speaker.png";
import IMG6 from "../../static/teamwork.png";
import IMG7 from "../../static/sheet.png";
import IMG8 from "../../static/list.png";
import IMG9 from "../../static/presentation.png";

import { ActionsWrapper, Container, Description, Title } from "../styled/commonStyled";
import {
  AvailablePlansContainer,
  ContentWrapper,
  CurrentPlanContainer,
  FeatureDescription,
  FlexCard,
  GridContainer,
  Img,
  InnerWrapper,
  PlanContainerWrapper,
  PlanDetails,
  PlanImage,
  PlansContainer,
  PlanStatus,
  StyledLink,
  StyledParagraph
} from "./styled";

const getUpgradeToTeacherPlanActions = ({ openPaymentServiceModal, openHasLicenseKeyModal, isblur }) => (
  <ActionsWrapper>
    <EduButton height="40px" onClick={openPaymentServiceModal} disabled={isblur}>
      UPGRADE NOW FOR $100/YEAR
    </EduButton>
    <EduButton isGhost height="40px" onClick={openHasLicenseKeyModal} disabled={isblur}>
      ALREADY HAVE A LICENSE KEY
    </EduButton>
  </ActionsWrapper>
);

const getUpgradeToMultipleUsersPlanAction = ({ openPurchaseLicenseModal }) => (
  <ActionsWrapper>
    <EduButton height="40px" onClick={openPurchaseLicenseModal} isGhost>
      PURCHASE LICENSE
    </EduButton>
    <Link to="/author/subscription/manage-licenses">
      <EduButton height="40px" isGhost>
        MANAGE LICENSE
      </EduButton>
    </Link>
  </ActionsWrapper>
);

const getEnterprisePlanActions = () => (
  <ActionsWrapper>
    <EduButton height="40px" isGhost>
      REQUEST A QUOTE
    </EduButton>
  </ActionsWrapper>
);

const availablePlans = [
  {
    imgSrc: IMG1,
    title: "Upgrade to Teacher Premium",
    description:
      "Get Additional reports, options to assist students collaborate with collegues, anti-cheating tools and more.",
    getActionsComp: getUpgradeToTeacherPlanActions
  },
  {
    imgSrc: IMG2,
    title: "Upgrade Multiple Users to Premium",
    description:
      "Administer common assesement, get immediate school or district-wide reports, and enable premium access for all teachers in your school or district.",
    getActionsComp: getUpgradeToMultipleUsersPlanAction
  },
  {
    imgSrc: IMG3,
    title: "Edulastic Enterprise",
    description:
      "Administer common assesement, get immediate school or district-wide reports, and enable premium access for all teachers in your school or district.",
    getActionsComp: getEnterprisePlanActions
  }
];

const featuresData = [
  {
    imgSrc:IMG4,
    title: "In-depth Reporting",
    description: "Show student growth over time. Analyze answer distractor. See complete student mastery profile."
  },
  {
    imgSrc:IMG5,
    title: "Read Aloud",
    description: "Choose students to have questions and answer choices read to them."
  },
  {
    imgSrc:IMG6,
    title: "Collaboration",
    description: "Work on assessment as a team before they're published."
  },
  {
    imgSrc:IMG7,
    title: "Advanced Assessment Options",
    description: "Shuffle question order for each student. Show student actions but hide correct answers."
  },
  {
    imgSrc:IMG8,
    title: "Rubric Scoring",
    description: "Create and share rubrics school or district wide."
  },
  {
    imgSrc:IMG9,
    title: "Presentation Mode",
    description: "Review answers and common mistake with the class without showing names."
  }
];

const PlansComponent = ({
  imgSrc,
  title,
  description,
  getActionsComp,
  isblur,
  openPaymentServiceModal,
  openHasLicenseKeyModal,
  openPurchaseLicenseModal
}) => (
  <PlansContainer isblur={isblur}>
    <ContentWrapper>
      <PlanImage>
        <img src={imgSrc} alt="" />
      </PlanImage>
      <PlanDetails>
        <Title margin="0 0 8px 0">{title}</Title>
        <Description>{description}</Description>
      </PlanDetails>
    </ContentWrapper>
    {getActionsComp({
      openPaymentServiceModal,
      openHasLicenseKeyModal,
      openPurchaseLicenseModal,
      isblur
    })}
  </PlansContainer>
);

function formatDate(subEndDate) {
  if (!subEndDate) return null;
  const date = new Date(subEndDate).toString().split(" ");
  return `${date[2]} ${date[1]}, ${date[3]}`;
}

const SubscriptionMain = props => {
  const {
    isSubscribed = false,
    subEndDate,
    openPaymentServiceModal,
    openHasLicenseKeyModal,
    openPurchaseLicenseModal
  } = props;

  const licenseExpiryDate = formatDate(subEndDate);

  const [showPlans, setShowPlans] = useState(false);

  return (
    <>
      <MainContentWrapper padding="30px">
        <CurrentPlanContainer onClick={() => setShowPlans(false)}>
          <Container>
            <Title padding="0 30px 0 0">Your Current Plan:</Title>
            <Description>{isSubscribed && licenseExpiryDate ? "Premium Version" : "Free Plan"}</Description>
          </Container>
          <PlanStatus>
            {isSubscribed && licenseExpiryDate ? (
              <p>
                Expires on: <StyledLink>{licenseExpiryDate}</StyledLink>
              </p>
            ) : (
              <StyledLink>Free Forever</StyledLink>
            )}
          </PlanStatus>
        </CurrentPlanContainer>

        {!showPlans && (
          <>
            <PlanContainerWrapper>
              {isSubscribed ? (
                <h2 style={{ fontWeight: 600 }}>Cool features in your plan</h2>
              ) : (
                <PlansContainer isEnterprise={false}>
                  <ContentWrapper>
                    <PlanImage>
                      <img src={availablePlans[0].imgSrc} alt="" />
                    </PlanImage>
                    <PlanDetails>
                      <Title margin="0 0 8px 0">{availablePlans[0].title}</Title>
                      <Description>{availablePlans[0].description}</Description>
                    </PlanDetails>
                  </ContentWrapper>
                </PlansContainer>
              )}

              <GridContainer>
                {featuresData.map(({ title, description },index) => (
                  <FlexCard>
                    <InnerWrapper>
                      <Img src={featuresData[index].imgSrc} />
                      <h3 style={{ fontWeight: 700, paddingLeft: 20 }}>{featuresData[index].title}</h3>
                    </InnerWrapper>
                    <FeatureDescription>{featuresData[index].description}</FeatureDescription>
                  </FlexCard>
                ))}
              </GridContainer>
            </PlanContainerWrapper>

            {!isSubscribed && (
              <ActionsWrapper width="460px" row>
                <EduButton isGhost height="40px" onClick={openHasLicenseKeyModal}>
                  ALREADY HAVE A LICENSE KEY
                </EduButton>
                <EduButton height="40px" onClick={openPaymentServiceModal}>
                  UPGRADE NOW FOR $100/YEAR
                </EduButton>
              </ActionsWrapper>
            )}
            <StyledParagraph isSubscribed={isSubscribed}>
              interested in buying multiple teacher premium subscriptions or upgrading to enterprise?
              {/* <StyledLink onClick={() => setShowPlans(true)}> click here.</StyledLink> */}
              <a href="https://edulastic.com/teacher-premium/" target="_blank" rel="noopener noreferrer">
                {" "}
                click here.
              </a>
            </StyledParagraph>
          </>
        )}
        {showPlans && (
          <AvailablePlansContainer>
            {availablePlans.map((plan, index) => (
              <PlansComponent
                key={index}
                isblur={isSubscribed && index === 0}
                openPaymentServiceModal={openPaymentServiceModal}
                openHasLicenseKeyModal={openHasLicenseKeyModal}
                openPurchaseLicenseModal={openPurchaseLicenseModal}
                {...plan}
              />
            ))}
          </AvailablePlansContainer>
        )}
      </MainContentWrapper>
    </>
  );
};

export default SubscriptionMain;
