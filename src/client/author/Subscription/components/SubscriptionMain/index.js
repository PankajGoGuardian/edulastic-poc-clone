import React, { useState } from "react";
import { Link } from "react-router-dom";

import {
  SubscriptionMainWrapper,
  CurrentPlanContainer,
  AvailablePlansContainer,
  PlanContainerWrapper,
  PlansContainer,
  ContentWrapper,
  PlanImage,
  PlanDetails,
  PlanStatus,
  GridContainer,
  FeatureDescription,
  FlexCard,
  InnerWrapper,
  Img,
  StyledLink,
  StyledParagraph
} from "./styled";
import { Title, Description, Container, ThemeButton, ActionsWrapper } from "../styled/commonStyled";

// TODO: Update SVG imports here
import IMG1 from "../../static/1.png";
import IMG2 from "../../static/2.png";
import IMG3 from "../../static/3.png";
import IMG4 from "../../static/4.png";

const getUpgradeToTeacherPlanActions = ({ openPaymentServiceModal, openHasLicenseKeyModal, isblur }) => (
  <ActionsWrapper>
    <ThemeButton onClick={openPaymentServiceModal} disabled={isblur} inverse>
      UPGRADE NOW FOR $100/YEAR
    </ThemeButton>
    <ThemeButton onClick={openHasLicenseKeyModal} disabled={isblur}>
      ALREADY HAVE A LICENSE KEY
    </ThemeButton>
  </ActionsWrapper>
);

const getUpgradeToMultipleUsersPlanAction = ({ openPurchaseLicenseModal }) => (
  <ActionsWrapper>
    <ThemeButton onClick={openPurchaseLicenseModal}>PURCHASE LICENSE</ThemeButton>
    <Link to="/author/subscription/manage-licenses">
      <ThemeButton>MANAGE LICENSE</ThemeButton>
    </Link>
  </ActionsWrapper>
);

const getEnterprisePlanActions = () => (
  <ActionsWrapper>
    <ThemeButton
      onClick={() => {
        console.log("Open link G-Form Link in new tab");
      }}
    >
      REQUEST A QUOTE
    </ThemeButton>
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
    title: "In-depth Reporting",
    description: "Show student growth over time. Analyze answer distractor. See complete student mastery profile."
  },
  {
    title: "Read Aloud",
    description: "Choose students to have questions and answer choices read to them."
  },
  {
    title: "Collaboration",
    description: "Work on assessment as a team before they're published."
  },
  {
    title: "Advanced Assessment Options",
    description: "Shuffle question order for each student. Show student actions but hide correct answers."
  },
  {
    title: "Rubric Scoring",
    description: "Create and share rubrics school or district wide."
  },
  {
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
        <img src={imgSrc} />
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

const getLicenseExpiryDate = subEndDate => {
  if (!subEndDate) return null;
  const date = Date(subEndDate).split(" ");
  return `${date[2]} ${date[1]}, ${date[3]}`;
};

const SubscriptionMain = props => {
  const {
    isSubscribed = false,
    subEndDate,
    subType,
    isPremiumAccount = true,
    openPaymentServiceModal,
    openHasLicenseKeyModal,
    openPurchaseLicenseModal
  } = props;

  const licenseExpiryDate = getLicenseExpiryDate(subEndDate);

  const [showPlans, setShowPlans] = useState(false);

  return (
    <>
      <SubscriptionMainWrapper>
        <CurrentPlanContainer onClick={() => setShowPlans(false)}>
          <Container>
            <Title padding="0 30px 0 0">Current Plan</Title>
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
                <h2 style={{ fontWeight: 600, padding: "40px 0 12px 70px" }}>Cool features in your plan</h2>
              ) : (
                <PlansContainer isEnterprise={false}>
                  <ContentWrapper>
                    <PlanImage>
                      <img src={availablePlans[0].imgSrc} />
                    </PlanImage>
                    <PlanDetails>
                      <Title margin="0 0 8px 0">{availablePlans[0].title}</Title>
                      <Description>{availablePlans[0].description}</Description>
                    </PlanDetails>
                  </ContentWrapper>
                </PlansContainer>
              )}

              <GridContainer>
                {featuresData.map(({ title, description }) => (
                  <FlexCard>
                    <InnerWrapper>
                      <Img src={IMG4} />
                      <h3 style={{ fontWeight: 700, paddingLeft: 20 }}>{title}</h3>
                    </InnerWrapper>
                    <FeatureDescription>{description}</FeatureDescription>
                  </FlexCard>
                ))}
              </GridContainer>
            </PlanContainerWrapper>

            {!isSubscribed && (
              <ActionsWrapper width="460px" row>
                <ThemeButton onClick={openHasLicenseKeyModal}>ALREADY HAVE A LICENSE KEY</ThemeButton>
                <ThemeButton onClick={openPaymentServiceModal} inverse>
                  UPGRADE NOW FOR $100/YEAR
                </ThemeButton>
              </ActionsWrapper>
            )}
            <StyledParagraph isSubscribed={isSubscribed}>
              interested in buying multiple teacher premium subscriptions or upgrading to enterprise?
              {/* <StyledLink onClick={() => setShowPlans(true)}> click here.</StyledLink> */}
              <a href="https://edulastic.com/teacher-premium/" target="_blank">
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
      </SubscriptionMainWrapper>
    </>
  );
};

export default SubscriptionMain;
