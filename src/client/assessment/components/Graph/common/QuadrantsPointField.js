import React, { useContext, Fragment } from "react";
import PropTypes from "prop-types";

import { withNamespaces } from "@edulastic/localization";
import ItemLevelContext from "../../../../author/QuestionEditor/components/Container/QuestionContext";

export default WrappedComponent => {
  const hocComponent = ({ ...props }) => {
    const itemLevelScoring = useContext(ItemLevelContext);

    return (
      <React.Fragment>
        {itemLevelScoring || (
          <Fragment>
            <WrappedComponent {...props} />
            <span>{t("component.correctanswers.points")}</span>
          </Fragment>
        )}
      </React.Fragment>
    );
  };

  hocComponent.propTypes = {
    points: PropTypes.number.isRequired,
    onChangePoints: PropTypes.func.isRequired,
    t: PropTypes.func.isRequired
  };

  return withNamespaces("assessment")(hocComponent);
};
