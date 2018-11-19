import React from 'react';
import PropTypes from 'prop-types';
import { EduButton } from '@edulastic/common';

export default (WrappedComponent) => {
  const hocComponent = ({ buttonText, onAdd, ...props }) => (
    <div>
      <WrappedComponent {...props} />
      <EduButton onClick={onAdd} type="primary">
        {buttonText}
      </EduButton>
    </div>
  );

  hocComponent.propTypes = {
    buttonText: PropTypes.string,
    onAdd: PropTypes.func,
  };

  hocComponent.defaultProps = {
    buttonText: 'Add new choice',
    onAdd: () => {},
  };

  return hocComponent;
};
