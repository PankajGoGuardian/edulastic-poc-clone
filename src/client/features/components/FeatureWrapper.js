import React from "react";
import { connect } from "react-redux";
import { getUserFeatures } from "../../student/Login/ducks";

/**
 *
 * @param {features: object, feature: string, children: JSX, actionOnInaccessible: "disabled"|"hidden"} props
 */
const FeatureWrapper = props => {
  let { features, feature, children, actionOnInaccessible } = props;
  const _children = React.Children.map(children, (child, index) => {
    return React.cloneElement(child, {
      ...props,
      actionOnInaccessible,
      isAccessible: features[feature] ? true : false
    });
  });
  return features[feature] ? _children : actionOnInaccessible === "disabled" ? _children : null;
};

export default connect(state => ({
  features: getUserFeatures(state)
}))(FeatureWrapper);
