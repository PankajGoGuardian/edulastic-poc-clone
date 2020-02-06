import React, { useContext } from "react";
import PropTypes from "prop-types";
import { Input } from "antd";

import { withNamespaces } from "@edulastic/localization";

import { Container } from "./styled/Container";
import { PointsText } from "./styled/PointsText";
import ItemLevelContext from "../../../../author/QuestionEditor/components/Container/QuestionContext";
import styled from "styled-components";

export default WrappedComponent => {
  const hocComponent = ({ points, onChangePoints, t, ...props }) => {
    const itemLevelScoring = useContext(ItemLevelContext);

    return (
      <React.Fragment>
        {itemLevelScoring || (
          <Container>
            <PointsText>{t("component.correctanswers.points")}</PointsText>
            <PointsInput
              type="number"
              data-cy="points"
              value={points}
              onChange={e => {
                if (e.target.value > 0) {
                  onChangePoints(+e.target.value);
                }
              }}
              step={0.5}
              size="large"
              min={0.5}
            />
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

const PointsInput = styled(Input)`
  &.ant-input {
    width: 230px;
    font-size: 14px;
    background: #f8f8f8;
    height: 36px;
    min-height: 36px;
  }
`;
