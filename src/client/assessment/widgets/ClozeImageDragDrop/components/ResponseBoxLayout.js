import React from 'react';
import PropTypes from 'prop-types';
import DragItem from './DragItem';

const ResponseBoxLayout = ({
  smallSize,
  responses,
  fontSize,
  dragHandler,
  onDrop,
  transparentResponses
}) => (
  <div className="responses_box" style={{ padding: smallSize ? '5px 10px' : 16 }}>
    {responses.map((option, index) => (
      <div
        key={index}
        className={transparentResponses ? 'draggable_box_transparent' : 'draggable_box'}
        style={{ fontSize: smallSize ? 10 : fontSize }}
      >
        {!dragHandler && (
          <DragItem index={index} onDrop={onDrop} item={option} data={option}>
            {option}
          </DragItem>
        )}
        {dragHandler && (
          <React.Fragment>
            <DragItem index={index} onDrop={onDrop} item={option} data={option}>
              <i className="fa fa-arrows-alt" style={{ fontSize: 12 }} />
              <span>{option}</span>
            </DragItem>
          </React.Fragment>
        )}
      </div>
    ))}
  </div>
);

ResponseBoxLayout.propTypes = {
  responses: PropTypes.array,
  fontSize: PropTypes.string,
  onDrop: PropTypes.func.isRequired,
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
