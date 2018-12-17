import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { withNamespaces } from '@edulastic/localization';
import { Input } from 'antd';
import { EduButton, FlexContainer } from '@edulastic/common';
import { IconTrash } from '@edulastic/icons';
import { greenDark, red } from '@edulastic/colors';

import Options from '../../common/Options';

const ResponseContainers = ({ containers, onChange, onAdd, onDelete, t }) => (
  <Options.Block>
    <Options.Heading>{t('component.options.responseContainer')}</Options.Heading>

    {containers.map(({ width = 0, height = 0 }, index) => (
      <Fragment>
        <Options.Row>
          <Options.Col md={12}>
            <FlexContainer justifyContent="space-between">
              <Options.Label>
                {t('component.options.responseContainer')} {index + 1}
              </Options.Label>
              <IconTrash
                onClick={() => onDelete(index)}
                color={greenDark}
                hoverColor={red}
                style={{ cursor: 'pointer' }}
              />
            </FlexContainer>
          </Options.Col>
        </Options.Row>

        <Options.Row>
          <Options.Col md={6}>
            <Options.Label>{t('component.options.widthpx')}</Options.Label>
            <Input
              type="number"
              size="large"
              style={{ width: '80%' }}
              value={width}
              onChange={e => onChange({ index, prop: 'width', value: +e.target.value })}
            />
          </Options.Col>
          <Options.Col md={6}>
            <Options.Label>{t('component.options.heightpx')}</Options.Label>
            <Input
              type="number"
              size="large"
              style={{ width: '80%' }}
              value={height}
              onChange={e => onChange({ index, prop: 'height', value: +e.target.value })}
            />
          </Options.Col>
        </Options.Row>
      </Fragment>
    ))}

    <EduButton onClick={onAdd} type="primary">
      {t('component.options.addResponseContainer')}
    </EduButton>
  </Options.Block>
);

ResponseContainers.propTypes = {
  containers: PropTypes.array.isRequired,
  onChange: PropTypes.func.isRequired,
  onAdd: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
  t: PropTypes.func.isRequired
};

export default withNamespaces('assessment')(ResponseContainers);
