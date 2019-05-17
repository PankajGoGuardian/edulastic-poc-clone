import React from "react";
import { connect } from "react-redux";
import { getUserFeatures } from "../../student/Login/ducks";

const FeatureWrapper = props => {
  let { features, feature, children, actionOnInaccessible } = props;
  const _children = React.Children.map(children, (child, index) => {
    return React.cloneElement(child, { actionOnInaccessible, isAccessible: features[feature] ? true : false });
  });
  return features[feature] ? _children : actionOnInaccessible === "disabled" ? _children : null;
};

export default connect(state => ({
  features: getUserFeatures(state)
}))(FeatureWrapper);
