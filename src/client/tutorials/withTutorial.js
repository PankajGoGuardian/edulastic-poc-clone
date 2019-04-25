import React, { useEffect } from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { tutorials } from "@edulastic/constants";
import { setCurrentTutorialAction } from "./tutorialReducer";

export const withTutorial = tutorialName => WrappedComponent => {
  const Wrapper = props => {
    const { setCurrentTutorial } = props;
    useEffect(() => {
      setCurrentTutorial(tutorials[tutorialName].steps);
    }, []);

    return <WrappedComponent {...props} />;
  };

  Wrapper.propTypes = {
    setCurrentTutorial: PropTypes.func.isRequired
  };

  return connect(
    null,
    {
      setCurrentTutorial: setCurrentTutorialAction
    }
  )(Wrapper);
};
