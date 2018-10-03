import React from 'react';
import PropTypes from 'prop-types';

const Left = ({ item }) => (
  <div>
    {item.presentation.widgets.map((widget, i) => (
      <span key={i}>{widget.name}</span>
    ))}
  </div>
);

Left.propTypes = {
  item: PropTypes.object.isRequired,
};

export default Left;
