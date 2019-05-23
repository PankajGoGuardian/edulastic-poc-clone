import React from "react";
import { connect } from "react-redux";
import { getUserFeatures } from "../../student/Login/ducks";

/**
 *
 * @param {features: object, featuresArray: Array of strings, operation: "AND | OR" children: JSX, actionOnInaccessible: "disabled"|"hidden"} props
 */
const FeaturesWrapper = props => {
  let { features, featuresArray, operation, children, actionOnInaccessible } = props;

  let isAccessible = true;
  if (operation === "AND") {
    for (let item of featuresArray) {
      if (!features[item]) {
        isAccessible = false;
        break;
      }
    }
  } else if (operation === "OR") {
    isAccessible = false;
    for (let item of featuresArray) {
      if (features[item]) {
        isAccessible = true;
        break;
      }
    }
  }

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
}))(FeaturesWrapper);
