//@ts-check
import React from "react";
import { connect } from "react-redux";
import { getUserFeatures } from "../../student/Login/ducks";
import { getGroupList } from "../../author/src/selectors/user";
import { isFeatureAccessibleToUser as isFeatureAccessible } from "../featuresUtils";

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
  let { children, actionOnInaccessible = "hidden" } = props;

  const isAccessible = isFeatureAccessible({
    ...props
  });

  const _children = React.Children.map(children, (child, index) => {
    return React.cloneElement(child, {
      ...props,
      ...child.props,
      children: child.props.children,
      actionOnInaccessible,
      isAccessible: isAccessible
    });
  });
  return isAccessible ? _children : actionOnInaccessible === "disabled" ? _children : null;
};
export { isFeatureAccessible };
export default connect(state => ({
  features: getUserFeatures(state),
  groupList: getGroupList(state)
  //@ts-ignore
}))(FeaturesSwitch);
