import React, { useContext } from "react";
import PropTypes from "prop-types";
import { Input } from "antd";

import { withNamespaces } from "@edulastic/localization";

import { Container } from "./styled/Container";
import { PointsText } from "./styled/PointsText";
import ItemLevelContext from "../../../../author/QuestionEditor/components/Container/QuestionContext";

export default WrappedComponent => {
  const hocComponent = ({ points, onChangePoints, t, ...props }) => {
    const itemLevelScoring = useContext(ItemLevelContext);

    return (
      <React.Fragment>
        {itemLevelScoring || (
          <Container>
            <Input
              type="number"
              data-cy="points"
              value={points}
              onChange={e => onChangePoints(+e.target.value)}
              style={{ width: 140, textAlign: "center", fontSize: 14 }}
              size="large"
            />
            <PointsText>{t("component.correctanswers.points")}</PointsText>
          </Container>
        )}
        <WrappedComponent {...props} />
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
