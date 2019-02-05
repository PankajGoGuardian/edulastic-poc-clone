import React from 'react';
import PropTypes from 'prop-types';
import { Draggable } from 'react-drag-and-drop';

const ResponseBoxLayout = ({
  smallSize,
  responses,
  fontSize,
  dragHandler,
  transparentResponses
}) => (
  <div className="responses_box" style={{ padding: smallSize ? '5px 10px' : 16 }}>
    {responses.map((option, index) => (
      <div key={index} className={transparentResponses ? 'draggable_box_transparent' : 'draggable_box'} style={{ fontSize: smallSize ? 10 : fontSize }}>
        {!dragHandler && (
          <Draggable type="metal" data={option}>{option}</Draggable>
        )}
        {dragHandler && (
          <React.Fragment>
            <Draggable type="metal" data={option}><i className="fa fa-arrows-alt" style={{ fontSize: 12 }} /><span>{option}</span></Draggable>
          </React.Fragment>
        )}
      </div>
    ))}
  </div>
);

ResponseBoxLayout.propTypes = {
  responses: PropTypes.array,
  fontSize: PropTypes.string,
  smallSize: PropTypes.bool,
  dragHandler: PropTypes.bool,
  transparentResponses: PropTypes.bool
};

ResponseBoxLayout.defaultProps = {
  responses: [],
  fontSize: '13px',
  smallSize: false,
  dragHandler: false,
  transparentResponses: false
};

export default React.memo(ResponseBoxLayout);
