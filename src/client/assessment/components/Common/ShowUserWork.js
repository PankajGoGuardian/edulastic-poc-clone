import React from "react";
import { connect } from "react-redux";
import { EduButton } from "@edulastic/common";
import PropTypes from "prop-types";

function ShowUserWorkButton({ onClickHandler, loading = false, children, style }) {
  return (
    <EduButton style={style} type="primary" isGhost onClick={onClickHandler} loading={loading}>
      {children}
    </EduButton>
  );
}

const mapStateToProps = state => ({
  loading: state.scratchpad.loading
});

ShowUserWorkButton.propTypes = {
  onClickHandler: PropTypes.func.isRequired,
  loading: PropTypes.bool,
  style: PropTypes.object,
  children: PropTypes.object.isRequired
};

ShowUserWorkButton.defaultProps = {
  loading: false,
  style: {}
};

export default connect(mapStateToProps)(ShowUserWorkButton);
