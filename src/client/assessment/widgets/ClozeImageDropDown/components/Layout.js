import React from 'react';
import { Select } from 'antd';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { compose } from 'redux';

import { TextField } from '@edulastic/common';
import { withNamespaces } from '@edulastic/localization';

import { setQuestionDataAction } from '../../../../author/src/actions/question';
import { getQuestionDataSelector } from '../../../../author/src/selectors/question';

import { AddNewChoiceBtn } from '../../../styled/AddNewChoiceBtn';
import { Row } from '../../../styled/WidgetOptions/Row';
import { Col } from '../../../styled/WidgetOptions/Col';
import { Label } from '../../../styled/WidgetOptions/Label';

import { OptionSelect } from '../styled/OptionSelect';
import { OptionCheckbox } from '../styled/OptionCheckbox';

const Layout = ({ questionData, onChange, uiStyle, t }) => {
  const changeUiStyle = (prop, value) => {
    onChange('ui_style', {
      ...uiStyle,
      [prop]: value
    });
  };

  const addNewResponseContainer = () => {};

  const stemnumerationOptions = [
    { value: 'numerical', label: t('component.options.numerical') },
    { value: 'uppercase', label: t('component.options.uppercasealphabet') },
    { value: 'lowercase', label: t('component.options.lowercasealphabet') }
  ];

  const fontsizeOptions = [
    { value: 'small', label: t('component.options.small') },
    { value: 'normal', label: t('component.options.normal') },
    { value: 'large', label: t('component.options.large') },
    { value: 'xlarge', label: t('component.options.extraLarge') },
    { value: 'xxlarge', label: t('component.options.huge') }
  ];

  const inputtypeOptions = [
    { value: 'text', label: t('component.options.text') },
    { value: 'number', label: t('component.options.number') }
  ];

  const pointerOptions = [
    { value: 'right', label: t('component.options.right') },
    { value: 'left', label: t('component.options.left') },
    { value: 'top', label: t('component.options.top') },
    { value: 'bottom', label: t('component.options.bottom') }
  ];

  return (
    <React.Fragment>
      <Row>
        <Col md={12}>
          <OptionCheckbox
            checked={questionData.multiline}
            onChange={e => onChange('multiline', e.target.checked)}
            size="large"
          >
            {t('component.options.multiline')}
          </OptionCheckbox>
        </Col>
        <Col md={12}>
          <OptionCheckbox
            checked={questionData.browserspellcheck}
            onChange={e => onChange('browserspellcheck', e.target.checked)}
            size="large"
          >
            {t('component.options.browserspellcheck')}
          </OptionCheckbox>
        </Col>
      </Row>
      <Row>
        <Col md={12}>
          <OptionCheckbox
            checked={questionData.imagescale}
            onChange={e => onChange('imagescale', e.target.checked)}
            size="large"
          >
            {t('component.options.imagescale')}
          </OptionCheckbox>
        </Col>
        <Col md={12}>
          <OptionCheckbox
            checked={questionData.verticaltop}
            onChange={e => onChange('verticaltop', e.target.checked)}
            size="large"
          >
            {t('component.options.verticaltop')}
          </OptionCheckbox>
        </Col>
      </Row>
      <Row>
        <Col md={12}>
          <OptionCheckbox
            checked={questionData.specialcharacters}
            onChange={e => onChange('specialcharacters', e.target.checked)}
            size="large"
          >
            {t('component.options.specialcharacters')}
          </OptionCheckbox>
        </Col>
      </Row>
      <Row>
        <Col md={12}>
          <Label>{t('component.options.stemNumerationReviewOnly')}</Label>
          <OptionSelect
            size="large"
            onChange={val => changeUiStyle('stemnumeration', val)}
            value={uiStyle.stemnumeration}
          >
            {stemnumerationOptions.map(({ value: val, label }) => (
              <Select.Option key={val} value={val}>
                {label}
              </Select.Option>
            ))}
          </OptionSelect>
        </Col>
        <Col md={12}>
          <Label>{t('component.options.fontSize')}</Label>
          <OptionSelect
            size="large"
            onChange={fontsize => changeUiStyle('fontsize', fontsize)}
            value={uiStyle.fontsize}
          >
            {fontsizeOptions.map(({ value: val, label }) => (
              <Select.Option key={val} value={val}>
                {label}
              </Select.Option>
            ))}
          </OptionSelect>
        </Col>
      </Row>
      <Row>
        <Col md={12}>
          <Label>{t('component.options.inputtype')}</Label>
          <OptionSelect
            size="large"
            onChange={inputtype => changeUiStyle('inputtype', inputtype)}
            value={uiStyle.inputtype}
          >
            {inputtypeOptions.map(({ value: val, label }) => (
              <Select.Option key={val} value={val}>
                {label}
              </Select.Option>
            ))}
          </OptionSelect>
        </Col>
        <Col md={12}>
          <Label>{t('component.options.placeholder')}</Label>
          <TextField
            disabled={false}
            containerStyle={{ width: '80%' }}
            onChange={e => changeUiStyle('placeholder', e.target.value)}
            value={uiStyle.placeholder}
          />
        </Col>
      </Row>
      <Row>
        <Col md={12}>
          <Label>{t('component.options.widthpx')}</Label>
          <TextField
            type="number"
            size="large"
            disabled={false}
            containerStyle={{ width: '80%' }}
            onChange={e => changeUiStyle('widthpx', e.target.value)}
            value={uiStyle.widthpx}
          />
        </Col>
        <Col md={12}>
          <Label>{t('component.options.heightpx')}</Label>
          <TextField
            type="number"
            size="large"
            disabled={false}
            containerStyle={{ width: '80%' }}
            onChange={e => changeUiStyle('heightpx', e.target.value)}
            value={uiStyle.heightpx}
          />
        </Col>
      </Row>
      <Row>
        <Col md={6}>
          <Label>{t('component.options.pointers')}</Label>
          <OptionSelect
            size="large"
            onChange={inputtype => changeUiStyle('inputtype', inputtype)}
            value={uiStyle.inputtype}
          >
            {pointerOptions.map(({ value: val, label }) => (
              <Select.Option key={val} value={val}>
                {label}
              </Select.Option>
            ))}
          </OptionSelect>
        </Col>
      </Row>
      <Row>
        <Col md={6}>
          <Label>{t('component.options.responsecontainerindividual')}</Label>
          <AddNewChoiceBtn onClick={() => addNewResponseContainer()}>
            {t('component.options.addnewresponsecontainer')}
          </AddNewChoiceBtn>
        </Col>
      </Row>
    </React.Fragment>
  );
};

Layout.propTypes = {
  questionData: PropTypes.object.isRequired,
  onChange: PropTypes.func.isRequired,
  uiStyle: PropTypes.object,
  t: PropTypes.func.isRequired
};

Layout.defaultProps = {
  uiStyle: {
    responsecontainerposition: 'bottom',
    fontsize: 'normal',
    stemnumeration: '',
    widthpx: 0,
    heightpx: 0,
    wordwrap: false,
    responsecontainerindividuals: []
  }
};

const enhance = compose(
  withNamespaces('assessment'),
  connect(
    state => ({
      questionData: getQuestionDataSelector(state)
    }),
    {
      setQuestionData: setQuestionDataAction
    }
  )
);

export default enhance(Layout);
