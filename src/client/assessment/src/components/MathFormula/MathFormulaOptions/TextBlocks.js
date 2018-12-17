import React from 'react';
import PropTypes from 'prop-types';
import { withNamespaces } from '@edulastic/localization';
import { Input, Row, Col } from 'antd';
import { EduButton, FlexContainer } from '@edulastic/common';
import { IconTrash } from '@edulastic/icons';
import { greenDark, red } from '@edulastic/colors';

import Options from '../../common/Options';

const TextBlocks = ({ blocks, onChange, onAdd, onDelete, t }) => (
  <Options.Block>
    <Options.Heading>{t('component.options.textBlocks')}</Options.Heading>

    <Row gutter={32}>
      {blocks.map((block, index) => (
        <Col style={{ marginBottom: 15 }} span={12}>
          <FlexContainer>
            <Input
              style={{ width: '100%' }}
              size="large"
              value={block}
              onChange={e => onChange({ index, value: e.target.value })}
            />
            <IconTrash
              onClick={() => onDelete(index)}
              color={greenDark}
              hoverColor={red}
              style={{ cursor: 'pointer' }}
            />
          </FlexContainer>
        </Col>
      ))}
    </Row>

    <EduButton onClick={onAdd} type="primary">
      {t('component.options.addTextBlock')}
    </EduButton>
  </Options.Block>
);

TextBlocks.propTypes = {
  blocks: PropTypes.array.isRequired,
  onChange: PropTypes.func.isRequired,
  onAdd: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
  t: PropTypes.func.isRequired
};

export default withNamespaces('assessment')(TextBlocks);
