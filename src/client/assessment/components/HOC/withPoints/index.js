import { withNamespaces } from "@edulastic/localization";
import { Input } from "antd";
import PropTypes from "prop-types";
import React, { useContext } from "react";
import styled from "styled-components";
import ItemLevelContext from "../../../../author/QuestionEditor/components/Container/QuestionContext";
import { Label } from "../../../styled/WidgetOptions/Label";
import { CorrectAnswerHeader } from "../../../styled/CorrectAnswerHeader";
import { greyThemeLight } from "@edulastic/colors";

export default WrappedComponent => {
  const hocComponent = ({ points, onChangePoints, t, ...props }) => {
    const itemLevelScoring = useContext(ItemLevelContext);

    return (
      <React.Fragment>
        {itemLevelScoring || (
          <CorrectAnswerHeader mb="15px">
            <Label>{t("component.correctanswers.points")}</Label>
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
          </CorrectAnswerHeader>
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
    background: #f8f8fb;
    border: 1px solid ${greyThemeLight};
    max-height: 40px;
    min-height: 40px;
    font-size: 14px;
    line-height: 38px;
    padding: 0 15px;
    margin-right: ${props => props.mr || "0px"};
    position: relative;
    z-index: 1;
  }
`;
