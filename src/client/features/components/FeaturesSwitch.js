//@ts-check
import React from "react";
import { connect } from "react-redux";
import { getUserFeatures } from "../../student/Login/ducks";

/**
 *
 * @param {{features: {[feature:string]:boolean|Object[]} & {premiumGradeSubject:Object[]}, inputFeatures: string[] | string, operation: "AND" | "OR", gradeSubject: {grade: string[], subject: string[]}, children: JSX.Element, actionOnInaccessible: "disabled"|"hidden"}} props
 *
 * gradeSubject is optional, if omitted only features will be taken into account
 *
 * features is optional, if omitted only gradeSubject will be taken into account
 *
 */
const FeaturesSwitch = props => {
  let {
    features,
    inputFeatures = [],
    operation = "AND",
    gradeSubject = { grade: [], subject: [] },
    children,
    actionOnInaccessible = "hidden"
  } = props;

  let featureFlag = null;
  if (typeof inputFeatures === "string") {
    featureFlag = features[inputFeatures] ? true : false;
  } else if (Array.isArray(inputFeatures)) {
    if (operation === "AND") {
      for (let item of inputFeatures) {
        if (!features[item]) {
          featureFlag = false;
          break;
        }
      }
      featureFlag = featureFlag === null && inputFeatures.length > 0 ? true : false;
    } else if (operation === "OR") {
      featureFlag = false;
      for (let item of inputFeatures) {
        if (features[item]) {
          featureFlag = true;
          break;
        }
      }
    }
  }

  let gradeSubjectFlag = false;
  const feat = features.premiumGradeSubject.find(
    item => item.grade.toLowerCase() === "all" && item.subject.toLowerCase() === "all"
  );

  const gradesIncludesAll = gradeSubject.grade.includes("all") || gradeSubject.grade.includes("All");
  const subjectsIncludesAll = gradeSubject.subject.includes("all") || gradeSubject.subject.includes("All");

  if (!feat) {
    const feat = features.premiumGradeSubject.find(
      item =>
        (gradeSubject.grade.includes(item.grade) ||
          gradesIncludesAll ||
          item.grade === "All" ||
          item.grade === "all") &&
        (gradeSubject.subject.includes(item.subject) ||
          subjectsIncludesAll ||
          item.subject === "All" ||
          item.subject === "all")
    );
    if (feat) {
      gradeSubjectFlag = true;
    }
  } else {
    gradeSubjectFlag = true;
  }

  const isAccessible = featureFlag || gradeSubjectFlag;

  const _children = React.Children.map(children, (child, index) => {
    return React.cloneElement(child, {
      ...props,
      children: child.props.children,
      actionOnInaccessible,
      isAccessible: isAccessible
    });
  });
  return isAccessible ? _children : actionOnInaccessible === "disabled" ? _children : null;
};

export default connect(state => ({
  features: getUserFeatures(state)
  //@ts-ignore
}))(FeaturesSwitch);
