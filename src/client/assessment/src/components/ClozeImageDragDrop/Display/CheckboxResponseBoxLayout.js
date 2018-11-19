import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { IconCheck, IconClose } from '@edulastic/icons';
import { green, red } from '@edulastic/colors';
import { Draggable, Droppable } from 'react-drag-and-drop';
import { Pointer, Point, Triangle } from '../common';

const ALPHABET = 'abcdefghijklmnopqrstuvwxyz';

const Icon = styled.div`
  position: absolute;
  right: 20px;
  top: calc(50% - 10px);
`;

const CheckboxTemplateBoxLayout = ({
  showAnswer, responseContainers, imageUrl, imageWidth, imageAlterText, responsecontainerindividuals, responseBtnStyle,
  fontSize, userSelections, stemnumeration, evaluation, onDropHandler }) => (
    <div className="imagedragdrop_template_box" style={{ fontSize, padding: 20 }}>
      <div style={{ position: 'relative', top: 0, left: 0, width: imageWidth, margin: 'auto', minWidth: 600, maxWidth: '100%' }}>
        <img src={imageUrl} width="100%" style={{ userSelect: 'none', pointerEvents: 'none' }} alt={imageAlterText} />
        {responseContainers.map((responseContainer, index) => {
          const dropTargetIndex = index;
          const btnStyle = {
            widthpx: responseContainer.width,
            width: responseContainer.width,
            top: responseContainer.top,
            left: responseContainer.left,
            height: responseContainer.height,
            position: 'absolute',
            borderRadius: 5,
          };
          if (responsecontainerindividuals && responsecontainerindividuals[dropTargetIndex]) {
            const { widthpx } = responsecontainerindividuals[dropTargetIndex];
            btnStyle.width = widthpx;
            btnStyle.widthpx = widthpx;
          }
          if (btnStyle && btnStyle.width === 0) {
            btnStyle.width = responseBtnStyle.widthpx;
          } else {
            btnStyle.width = btnStyle.widthpx;
          }
          let indexStr = '';
          switch (stemnumeration) {
            case 'lowercase': {
              indexStr = ALPHABET[dropTargetIndex];
              break;
            }
            case 'uppercase': {
              indexStr = ALPHABET[dropTargetIndex].toUpperCase();
              break;
            }
            default:
              indexStr = dropTargetIndex + 1;
          }
          const className = evaluation[dropTargetIndex] ? 'right' : 'wrong';

          return (
            <React.Fragment key={index}>
              {!showAnswer && (
                <Droppable
                  types={['metal']} // <= allowed drop types
                  style={btnStyle}
                  className={`imagelabeldragdrop-droppable active check-answer ${className}`}
                  onDrop={data => onDropHandler(data, dropTargetIndex)}
                >
                  <span className="index index-box">{indexStr}</span>
                  <div className="text container">
                    {userSelections[dropTargetIndex] && userSelections[dropTargetIndex].map((answer, user_select_index) => (
                      <Draggable
                        type="metal"
                        key={user_select_index}
                        data={`${answer}_${dropTargetIndex}_fromResp`}
                        style={{ border: 'solid 1px lightgray', margin: 5, padding: 5, display: 'inline-block' }}
                      >
                        {answer}
                      </Draggable>
                    ))}
                  </div>
                  <Icon>
                    {className === 'right' && <IconCheck color={green} width={8} height={8} />}
                    {className === 'wrong' && <IconClose color={red} width={8} height={8} />}
                  </Icon>
                  <Pointer className={responseContainer.pointerPosition} width={responseContainer.width}>
                    <Point />
                    <Triangle />
                  </Pointer>
                </Droppable>
              )}
              {showAnswer && (
                <div
                  style={btnStyle}
                  className={`imagelabeldragdrop-droppable active check-answer ${className} show-answer`}
                >
                  <span className="index index-box">{indexStr}</span>
                  <div className="text container">
                    {userSelections[dropTargetIndex] && userSelections[dropTargetIndex].map((answer, user_select_index) => (
                      <div
                        key={user_select_index}
                        style={{ border: 'solid 1px lightgray', margin: 5, padding: 5, display: 'inline-block' }}
                      >
                        {answer}
                      </div>
                    ))}
                  </div>
                  <Icon>
                    {className === 'right' && <IconCheck color={green} width={8} height={8} />}
                    {className === 'wrong' && <IconClose color={red} width={8} height={8} />}
                  </Icon>
                  <Pointer className={responseContainer.pointerPosition} width={responseContainer.width}>
                    <Point />
                    <Triangle />
                  </Pointer>
                </div>
              )}
            </React.Fragment>
          );
        })}
      </div>
    </div>
);

CheckboxTemplateBoxLayout.propTypes = {
  responsecontainerindividuals: PropTypes.array.isRequired,
  fontSize: PropTypes.string.isRequired,
  responseContainers: PropTypes.array.isRequired,
  responseBtnStyle: PropTypes.object.isRequired,
  userSelections: PropTypes.array.isRequired,
  stemnumeration: PropTypes.string.isRequired,
  evaluation: PropTypes.array.isRequired,
  showAnswer: PropTypes.bool.isRequired,
  onDropHandler: PropTypes.func.isRequired,
  imageUrl: PropTypes.string.isRequired,
  imageAlterText: PropTypes.string.isRequired,
  imageWidth: PropTypes.number.isRequired,
};

export default React.memo(CheckboxTemplateBoxLayout);
