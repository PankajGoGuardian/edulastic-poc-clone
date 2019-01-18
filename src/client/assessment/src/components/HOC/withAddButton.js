import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { EduButton } from '@edulastic/common';

const withAddButton = (WrappedComponent) => {
  const withAddButtonHocComponent = ({ buttonText, onAdd, ...props }) => (
    <Fragment>
      <WrappedComponent {...props} />
      <EduButton onClick={onAdd} type="primary">
        {buttonText}
      </EduButton>
    </Fragment>
  );

  withAddButtonHocComponent.propTypes = {
    buttonText: PropTypes.string,
    onAdd: PropTypes.func
  };

  withAddButtonHocComponent.defaultProps = {
    buttonText: 'Add new choice',
    onAdd: () => {}
  };

  return withAddButtonHocComponent;
};

export default withAddButton;
