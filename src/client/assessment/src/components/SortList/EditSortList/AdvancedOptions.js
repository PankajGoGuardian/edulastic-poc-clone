import React, { useState } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import { withNamespaces } from '@edulastic/localization';
import { Checkbox } from '@edulastic/common';
import { secondaryTextColor, grey } from '@edulastic/colors';

import Options, { FontSizeSelect, OrientationSelect } from '../../common/Options';

import { Subtitle } from '../../common';
import LargeInput from './LargeInput';

const AdvancedOptions = ({ t, onItemChange, onValidationChange, onUiChange }) => {
  const [unscored, setUnscored] = useState(false);
  const [instantFeedback, setInstantFeedback] = useState(false);
  const [automarkable, setAutomarkable] = useState(false);
  const [penalty, setPenalty] = useState(0);
  const [feedbackAttempts, setFeedbackAttempts] = useState(0);
  const [minScoreIfAttempted, setMinScoreIfAttempted] = useState(0);
  const [fontsize, setFontsize] = useState('normal');
  const [orientation, setOrientation] = useState('horizontal');

  return (
    <Options title="Advanced Options">
      <Subtitle style={{ padding: 0, marginBottom: 21 }}>{t('component.options.scoring')}</Subtitle>

      <FlexRow>
        <Flex>
          <Checkbox
            checked={unscored}
            label={t('component.options.unscored')}
            onChange={() => {
              onValidationChange('unscored', !unscored);
              setUnscored(!unscored);
            }}
          />
        </Flex>
        <Flex>
          <FlexRow noMargins>
            <LargeInput
              value={penalty}
              onChange={(val) => {
                onValidationChange('penalty', val);
                setPenalty(val);
              }}
            />
            <LabelText>{t('component.options.penalty')}</LabelText>
          </FlexRow>
        </Flex>
      </FlexRow>
      <FlexRow>
        <Flex>
          <Checkbox
            checked={instantFeedback}
            label={t('component.options.instant_feedback')}
            onChange={() => {
              onItemChange('instant_feedback', !instantFeedback);
              setInstantFeedback(!instantFeedback);
            }}
          />
        </Flex>
        <Flex>
          <FlexRow noMargins>
            <LargeInput
              value={feedbackAttempts}
              onChange={(val) => {
                onItemChange('feedback_attempts', val);
                setFeedbackAttempts(val);
              }}
            />
            <LabelText>{t('component.options.feedback_attempts')}</LabelText>
          </FlexRow>
        </Flex>
      </FlexRow>
      <FlexRow>
        <Flex>
          <Checkbox
            checked={automarkable}
            label={t('component.options.automarkable')}
            onChange={() => {
              onValidationChange('automarkable', !automarkable);
              setAutomarkable(!automarkable);
            }}
          />
        </Flex>
        <Flex>
          <FlexRow noMargins>
            <LargeInput
              value={minScoreIfAttempted}
              onChange={(val) => {
                onValidationChange('min_score_if_attempted', val);
                setMinScoreIfAttempted(val);
              }}
            />
            <LabelText>{t('component.options.min_score_if_attempted')}</LabelText>
          </FlexRow>
        </Flex>
      </FlexRow>
      <Hr />
      <Subtitle style={{ padding: 0, marginBottom: 21 }}>{t('component.options.layout')}</Subtitle>
      <FlexRow>
        <Flex flexDir="column">
          <FontSizeSelect
            value={fontsize}
            onChange={(val) => {
              onUiChange('fontsize', val);
              setFontsize(val);
            }}
          />
        </Flex>
        <Flex flexDir="column">
          <OrientationSelect
            value={orientation}
            onChange={(val) => {
              onUiChange('orientation', val);
              setOrientation(val);
            }}
          />
        </Flex>
      </FlexRow>
    </Options>
  );
};

AdvancedOptions.propTypes = {
  t: PropTypes.func.isRequired,
  onItemChange: PropTypes.func.isRequired,
  onValidationChange: PropTypes.func.isRequired,
  onUiChange: PropTypes.func.isRequired
};

export default withNamespaces('assessment')(AdvancedOptions);

const FlexRow = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
  min-height: 40px;
  margin-bottom: ${({ noMargins }) => (noMargins ? 0 : 16)}px;
`;

const Hr = styled.hr`
  border: none;
  border-top: 1px solid ${grey};
  margin-top: 40px;
  margin-bottom: 40px;
`;

const Flex = styled.div`
  flex: 1;
  flex-direction: ${({ flexDir }) => flexDir || 'inherit'};
  display: ${({ flexDir }) => (flexDir ? 'flex' : 'initial')};
`;

const LabelText = styled.span`
  font-size: 13px;
  font-weight: 600;
  color: ${secondaryTextColor};
`;
