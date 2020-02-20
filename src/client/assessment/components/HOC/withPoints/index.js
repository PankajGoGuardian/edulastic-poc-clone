import { withNamespaces } from "@edulastic/localization";
import PropTypes from "prop-types";
import React, { useContext } from "react";
import ItemLevelContext from "../../../../author/QuestionEditor/components/Container/QuestionContext";
import { Label } from "../../../styled/WidgetOptions/Label";
import { CorrectAnswerHeader, PointsInput } from "../../../styled/CorrectAnswerHeader";
import { getFormattedAttrId } from "@edulastic/common/src/helpers";
import { compose } from "redux";
import { connect } from "react-redux";
import { getCurrentQuestionSelector } from "../../../../author/sharedDucks/questions";

export default WrappedComponent => {
  const hocComponent = ({ points, onChangePoints, t, title, ...props }) => {
    const itemLevelScoring = useContext(ItemLevelContext);

    return (
      <React.Fragment>
        {itemLevelScoring || (
          <CorrectAnswerHeader mb="15px">
            <Label>{t("component.correctanswers.points")}</Label>
            <PointsInput
              type="number"
              id={getFormattedAttrId(`${title}-${t("component.correctanswers.points")}`)}
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

  const enhance = compose(
    withNamespaces("assessment"),
    connect(
      state => {
        const question = getCurrentQuestionSelector(state);
        return {
          title: question?.title || ""
        };
      },
      null
    )
  );
  return enhance(hocComponent);
};
