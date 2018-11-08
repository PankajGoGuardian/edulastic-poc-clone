import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { IconCheck, IconClose } from '@edulastic/icons';
import { green, red } from '@edulastic/colors';

const ALPHABET = 'abcdefghijklmnopqrstuvwxyz';

const Icon = styled.div`
  position: absolute;
  right: 20px;
  top: calc(50% - 10px);
`;

// eslint-disable-next-line max-len
const CheckboxTemplateBoxLayout = ({ templateParts, hasGroupResponses, responsecontainerindividuals, responseBtnStyle, fontSize, userSelections, stemNumeration, evaluation }) => {
  let responseIndex = 0;
  console.log('stemNumeration:', stemNumeration);

  return (
    <div className="template_box" style={{ fontSize, padding: 20 }}>
      {templateParts.map((templatePart, index) => {
        if (templatePart.indexOf('class="response-btn"') !== -1) {
          const dropTargetIndex = responseIndex;
          responseIndex++;
          let indexStr;
          const className = evaluation[dropTargetIndex] ? 'right' : 'wrong';
          switch (stemNumeration) {
            case 'lowercase': {
              indexStr = ALPHABET[dropTargetIndex];
              break;
            }
            case 'uppercase': {
              indexStr = ALPHABET[dropTargetIndex].toUpperCase();
              break;
            }
            case 'numerical': {
              indexStr = dropTargetIndex + 1;
              break;
            }
            default:
          }
          let btnStyle = responsecontainerindividuals && responsecontainerindividuals[dropTargetIndex];
          if (btnStyle === undefined) {
            btnStyle = responseBtnStyle;
          }
          if (btnStyle && btnStyle.widthpx === 0) {
            btnStyle.widthpx = responseBtnStyle.widthpx;
          }
          if (btnStyle && btnStyle.heightpx === 0) {
            btnStyle.heightpx = responseBtnStyle.heightpx;
          }
          if (btnStyle && btnStyle.wordwrap === undefined) {
            btnStyle.wordwrap = responseBtnStyle.wordwrap;
          }
          return (
            <div key={index}>
              {hasGroupResponses && (
                <div className={`response-btn check-answer ${className}`} style={btnStyle}>
                  &nbsp;<span className="index">{indexStr}</span><span className="text">{userSelections[dropTargetIndex] && userSelections[dropTargetIndex].data}</span>&nbsp;
                  <Icon>
                    {className === 'right' && <IconCheck color={green} width={8} height={8} />}
                    {className === 'wrong' && <IconClose color={red} width={8} height={8} />}
                  </Icon>
                </div>
              )}
              {!hasGroupResponses && (
                <div className={`response-btn check-answer ${className}`} style={btnStyle}>
                  &nbsp;<span className="index">{indexStr}</span><span className="text">{userSelections[dropTargetIndex] && userSelections[dropTargetIndex]}</span>&nbsp;
                  <Icon>
                    {className === 'right' && <IconCheck color={green} width={8} height={8} />}
                    {className === 'wrong' && <IconClose color={red} width={8} height={8} />}
                  </Icon>
                </div>
              )}
            </div>
          );
        }
        return (
          <span style={{ userSelect: 'none' }} key={index} dangerouslySetInnerHTML={{ __html: templatePart }} />
        );
      })}
    </div>
  );
};

CheckboxTemplateBoxLayout.propTypes = {
  responsecontainerindividuals: PropTypes.array,
  fontSize: PropTypes.string,
  templateParts: PropTypes.array,
  responseBtnStyle: PropTypes.object,
  hasGroupResponses: PropTypes.bool,
  userSelections: PropTypes.array,
  stemNumeration: PropTypes.string,
  evaluation: PropTypes.array,
};

CheckboxTemplateBoxLayout.defaultProps = {
  responsecontainerindividuals: [],
  fontSize: '13px',
  templateParts: [],
  responseBtnStyle: {},
  hasGroupResponses: false,
  userSelections: [],
  stemNumeration: 'numerical',
  evaluation: [],
};

export default CheckboxTemplateBoxLayout;
