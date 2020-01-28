import React, { useState } from "react";

import SubscriptionHeader from "../SubscriptionHeader";
import SubscriptionMain from "../SubscriptionMain";
import { Wrapper } from "../styled/commonStyled";
import { CompareModal, PlanCard, PlanHeader, PlanLabel, PlanContent, PlanTitle, PlanDescription } from "./styled";

const comparePlansData = [
  {
    cardTitle: "Free Teacher",
    cardLabel: "FREE FOREVER",
    color: "#5EB500",
    data: [
      {
        title: "Unlimited Assesments",
        description: "Create as many classes & students as you need."
      },
      {
        title: "80K & Growing Item Bank",
        description: "Edulastic CERTIFIED for Grades K-12."
      },
      {
        title: "30+ Technology-Enhanced Question Types",
        description: "Create your own or mix and match."
      },
      {
        title: "Immediate Perfomance Data",
        description: "Real-time reports by student and class."
      },
      {
        title: "Standards Mastery Tracking",
        description: "Reports by standard for students and classes."
      },
      {
        title: "Standards Mastery Tracking",
        description: "Reports by standard for students and classes."
      },
      {
        title: "Assessment Sharing",
        description: "Share assessments or keep them private. Your choice."
      },
      {
        title: "Works with Google Apps",
        description: "Google single sign-on and sync with Google Classroom."
      }
    ]
  },
  {
    cardTitle: "Premium Teacher",
    cardLabel: "PER TEACHER PRICING",
    color: "#4E95F3",
    data: [
      {
        title: "All Free Teacher Features, PLUS:",
        description: ""
      },
      {
        title: "In-depth Reporting",
        description: "Showstudent growth over time. Analyze answer distractor. See coplete student mastery profile."
      },
      {
        title: "Advanced Assessment Optons",
        description: "Shuffle qustion order for each student. Show student scoes but hide correct answers."
      },
      {
        title: "Read Aloud",
        description: "Choose students to have questions and answer choices read to them."
      },
      {
        title: "Rubric Scoring",
        description: "Create and share rubrics school or district wide."
      },
      {
        title: "Collaboration",
        description: "Work on assessment as a team before they're published."
      },
      {
        title: "Presentation Mode",
        description: "Review answers and common mistake with the class without showing names."
      }
    ]
  },
  {
    cardTitle: "Enterprise",
    cardLabel: "PER STUDENT PRICING",
    color: "#FFA200",
    data: [
      {
        title: "Premium Teacher for All Teachers, PLUS:",
        description: ""
      },
      {
        title: "Common Assessment",
        description: "Administer common assessments and control access by teachers and students."
      },
      {
        title: "Immediate School or District-Wide Reports",
        description: "See performance, growth and standards mastery by building, grade, teacher and student."
      },
      {
        title: "SIS & LMS Integration",
        description: "Automatic roster sync and gradebook integration (where available)."
      },
      {
        title: "Additional Item Banks",
        description: "Choose from third-party item banks, such as Inspect, Carnegie Learning or Progress Testing."
      },
      {
        title: "Expedited Technical Support",
        description: "On-call support during assessment by phone or online."
      },
      {
        title: "Custom Professional Development",
        description: "Live or online workshops to get you and your teacher up and running."
      }
    ]
  }
];

const PlanDetailsComponent = ({ title, description = "" }) => (
  <>
    <PlanTitle>{title}</PlanTitle>
    <PlanDescription>{description}</PlanDescription>
  </>
);

const Plans = ({ cardTitle, cardLabel, data, color }) => (
  <PlanCard>
    <PlanHeader color={color}>{cardTitle}</PlanHeader>
    <PlanLabel color={color}>{cardLabel}</PlanLabel>
    <PlanContent>
      {data.map(item => (
        <PlanDetailsComponent {...item} />
      ))}
    </PlanContent>
  </PlanCard>
);

const Subscription = props => {
  const [comparePlan, setComparePlan] = useState(false);
  const openComparePlanModal = () => setComparePlan(true);

  const handleCancel = () => setComparePlan(false);

  return (
    <Wrapper>
      <SubscriptionHeader openComparePlanModal={openComparePlanModal} />
      <SubscriptionMain />
      <CompareModal title="" visible={comparePlan} onCancel={handleCancel} footer={[]} style={{ top: 25 }}>
        {comparePlansData.map(plan => (
          <Plans {...plan} />
        ))}
      </CompareModal>
    </Wrapper>
  );
};

export default Subscription;
