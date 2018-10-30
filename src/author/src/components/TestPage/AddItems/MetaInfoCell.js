import React from 'react';
import PropTypes from 'prop-types';

const MetaInfoCell = ({ data }) => <div>{data.by}</div>;

MetaInfoCell.propTypes = {
  data: PropTypes.object.isRequired,
};

export default MetaInfoCell;
