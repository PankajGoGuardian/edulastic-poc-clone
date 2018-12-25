import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { IconCheck, IconClose } from '@edulastic/icons';
import { green, red } from '@edulastic/colors';
import { Pointer, Point, Triangle } from '../common';

const ALPHABET = 'abcdefghijklmnopqrstuvwxyz';

const Icon = styled.div`
  position: absolute;
  right: 20px;
  display: flex;
`;

// eslint-disable-next-line react/prop-types
const TemplateBox = ({ children }) => (
  <div className="imagedragdrop_template_box">
    {children}
  </div>
);
const StyledTemplateBox = styled(TemplateBox)`
  font-size: ${props => props.fontSize};
  padding: 20px;
`;

const TemplateCover = styled.div`
  position: relative;
  top: 0px;
  left: 0px;
  width: ${props => props.width}px;
  margin: auto;
  min-width: 600px;
  max-width: 100%;
`;

const CheckboxTemplateBoxLayout = ({
  showAnswer,
  responseContainers,
  imageUrl,
  imageWidth,
  imageAlterText,
  responsecontainerindividuals,
  responseBtnStyle,
  fontSize,
  userSelections,
  stemnumeration,
  evaluation
}) => (
  <StyledTemplateBox fontSize={fontSize}>
    <TemplateCover width={imageWidth}>
      <img
        src={imageUrl}
        width="100%"
        style={{ userSelect: 'none', pointerEvents: 'none' }}
        alt={imageAlterText}
      />
      {responseContainers.map((responseContainer, index) => {
        const dropTargetIndex = index;
        const btnStyle = {
          widthpx: responseContainer.width,
          width: responseContainer.width,
          top: responseContainer.top,
          left: responseContainer.left,
          height: responseContainer.height,
          position: 'absolute',
          borderRadius: 5
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
              <div
                style={btnStyle}
                className={`imagelabeldragdrop-droppable active check-answer ${className}`}
              >
                <span className="index index-box">{indexStr}</span>
                <div className="text container">
                  {userSelections[dropTargetIndex]}
                </div>
                <Icon>
                  {className === 'right' && <IconCheck color={green} width={8} height={8} />}
                  {className === 'wrong' && <IconClose color={red} width={8} height={8} />}
                </Icon>
                <Pointer
                  className={responseContainer.pointerPosition}
                  width={responseContainer.width}
                >
                  <Point />
                  <Triangle />
                </Pointer>
              </div>
            )}
            {showAnswer && (
              <div
                style={btnStyle}
                className={`imagelabeldragdrop-droppable active check-answer ${className} show-answer`}
              >
                <span className="index index-box">{indexStr}</span>
                <div className="text container">
                  {userSelections[dropTargetIndex]}
                </div>
                <Icon>
                  {className === 'right' && <IconCheck color={green} width={8} height={8} />}
                  {className === 'wrong' && <IconClose color={red} width={8} height={8} />}
                </Icon>
                <Pointer
                  className={responseContainer.pointerPosition}
                  width={responseContainer.width}
                >
                  <Point />
                  <Triangle />
                </Pointer>
              </div>
            )}
          </React.Fragment>
        );
      })}
    </TemplateCover>
  </StyledTemplateBox>
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
  imageUrl: PropTypes.string.isRequired,
  imageAlterText: PropTypes.string.isRequired,
  imageWidth: PropTypes.number.isRequired
};

export default React.memo(CheckboxTemplateBoxLayout);
