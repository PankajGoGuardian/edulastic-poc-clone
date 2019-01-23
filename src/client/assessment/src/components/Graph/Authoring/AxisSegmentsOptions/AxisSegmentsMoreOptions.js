import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import { compose } from 'redux';
import { withNamespaces } from '@edulastic/localization';
import { Checkbox, Select } from '@edulastic/common';
import {
  MoreOptionsContainer,
  MoreOptionsDivider,
  MoreOptionsInput,
  MoreOptionsLabel,
  MoreOptionsRow,
  MoreOptionsSubHeading,
  Row, Col, MoreOptionsColumnContainer, MoreOptionsColumn
} from '../../common/styled_components';
import FontSizeDropdown from '../AxisLabelsLayoutSettings/FontSizeDropdown';

class AxisSegmentsMoreOptions extends Component {
  state = {
    layout: 'horizontal',
    spacingBtwStackedResponses: '30px',
    stackResponses: false,
    minWidth: '550px',
    ticksShowMin: true,
    ticksShowMax: true,
    minorTicks: 1,
    renderingBase: 'lineMinValue',
    showLabels: true,
    labelShowMin: true,
    labelShowMax: true,
    labelDisplaySpecPoints: ''
  };

  handleNumberlineCheckboxChange = (name, checked) => {
    const { numberlineAxis, setNumberline } = this.props;
    setNumberline({ ...numberlineAxis, [name]: !checked });
  }

  handleNumberlineInputChange = (event) => {
    const { target: { name, value } } = event;

    const { numberlineAxis, setNumberline } = this.props;
    setNumberline({ ...numberlineAxis, [name]: value });
  }

  handleCanvasInputChange = (event) => {
    const { target: { name, value } } = event;

    const { canvasConfig, setCanvas } = this.props;
    setCanvas({ ...canvasConfig, [name]: value });
  };

  handleOptionsInputChange = (event) => {
    const { target: { name, value } } = event;

    const { options, setOptions } = this.props;
    setOptions({ ...options, [name]: value });
  }

  getFontSizeItem = () => {
    const { fontSizeList, numberlineAxis } = this.props;
    const selectedItem = fontSizeList.find(item => item.value == numberlineAxis.fontSize);

    return selectedItem;
  };

  changeFontSize = (event) => {
    const { setNumberline, numberlineAxis } = this.props;

    setNumberline({ ...numberlineAxis, fontSize: event });
  };

  handleSelect = (name, value) => {
    this.setState({
      [name]: value
    });
  };

  handleCheckbox = (name, checked) => {
    this.setState({
      [name]: !checked
    });
  };

  handleInputChange = (event) => {
    const { target: { name, value } } = event;
    this.setState({ [name]: value });
  };

  render() {
    const {
      t,
      orientationList,
      fontSizeList,
      renderingBaseList,
      canvasConfig,
      options,
      numberlineAxis
    } = this.props;

    const {
      layout,
      spacingBtwStackedResponses,
      stackResponses,
      minWidth,
      ticksShowMin,
      ticksShowMax,
      minorTicks,
      renderingBase,
      showLabels,
      labelShowMin,
      labelShowMax,
      labelDisplaySpecPoints
    } = this.state;
    return (
      <Fragment>
        <MoreOptionsContainer>
          <MoreOptionsSubHeading>
            {t('component.graphing.layoutoptionstitle')}
          </MoreOptionsSubHeading>

          <Row>
            <Col md={12}>
              <Row>
                <Col md={6} style={{ paddingRight: 20 }}>
                  <MoreOptionsRow>
                    <MoreOptionsLabel>
                      {t('component.options.orientation')}
                    </MoreOptionsLabel>
                    <Select
                      style={{ width: '80%' }}
                      onChange={val => this.handleSelect('layout', val)}
                      options={orientationList}
                      value={layout}
                    />
                  </MoreOptionsRow>
                </Col>
                <Col md={6} style={{ paddingLeft: 20 }}>
                  {
                    layout === 'horizontal' && (
                    <MoreOptionsRow>
                      <MoreOptionsLabel>
                        {t('component.graphing.layoutoptions.width')}
                      </MoreOptionsLabel>
                      <MoreOptionsInput
                        type="text"
                        defaultValue="600px"
                        name="layout_width"
                        onChange={this.handleOptionsInputChange}
                        value={options.layout_width}
                      />
                    </MoreOptionsRow>
                    )}
                </Col>
              </Row>
            </Col>

            {
              layout === 'vertical' && (
              <Col md={12}>
                <Row>
                  <Col md={6} style={{ paddingRight: 20 }}>
                    <MoreOptionsRow>
                      <MoreOptionsLabel>
                        {t('component.graphing.layoutoptions.minWidth')}
                      </MoreOptionsLabel>
                      <MoreOptionsInput
                        type="text"
                        defaultValue="600px"
                        name="minWidth"
                        onChange={this.handleInputChange}
                        value={minWidth}
                      />
                    </MoreOptionsRow>
                  </Col>
                  <Col md={6} style={{ paddingLeft: 20 }}>
                    <MoreOptionsRow>
                      <MoreOptionsLabel>
                        {t('component.graphing.layoutoptions.height')}
                      </MoreOptionsLabel>
                      <MoreOptionsInput
                        type="text"
                        defaultValue="600px"
                        name="layout_height"
                        onChange={this.handleOptionsInputChange}
                        value={options.layout_height}
                      />
                    </MoreOptionsRow>
                  </Col>
                </Row>
              </Col>
              )}

            <Col md={12}>
              <Row>
                <Col md={6} style={{ paddingRight: 20 }}>
                  <MoreOptionsRow>
                    <MoreOptionsLabel>
                      {t('component.graphing.layoutoptions.linemargin')}
                    </MoreOptionsLabel>
                    <MoreOptionsInput
                      type="text"
                      name="margin"
                      defaultValue="75"
                      value={canvasConfig.margin}
                      onChange={this.handleCanvasInputChange}
                    />
                  </MoreOptionsRow>
                  <MoreOptionsRow>
                    <Checkbox
                      label={t('component.graphing.layoutoptions.showMinArrow')}
                      onChange={() => this.handleNumberlineCheckboxChange('leftArrow', numberlineAxis.leftArrow)}
                      name="leftArrow"
                      checked={numberlineAxis.leftArrow}
                    />
                  </MoreOptionsRow>
                  <MoreOptionsRow>
                    <Checkbox
                      label={t('component.graphing.layoutoptions.stackResponses')}
                      name="stackResponses"
                      onChange={() => this.handleCheckbox('stackResponses', stackResponses)}
                      checked={stackResponses}
                    />
                  </MoreOptionsRow>
                </Col>
                <Col md={6} style={{ paddingLeft: 20 }}>
                  <MoreOptionsRow>
                    <MoreOptionsLabel>
                      {t('component.graphing.layoutoptions.spacingBtwStacked')}
                    </MoreOptionsLabel>
                    <MoreOptionsInput
                      type="text"
                      defaultValue="600px"
                      name="spacingBtwStackedResponses"
                      onChange={this.handleInputChange}
                      value={spacingBtwStackedResponses}
                    />
                  </MoreOptionsRow>
                  <MoreOptionsRow>
                    <Checkbox
                      label={t('component.graphing.layoutoptions.showMaxArrow')}
                      onChange={() => this.handleNumberlineCheckboxChange('rightArrow', numberlineAxis.rightArrow)}
                      name="rightArrow"
                      checked={numberlineAxis.rightArrow}
                    />
                  </MoreOptionsRow>
                  <MoreOptionsRow>
                    <MoreOptionsLabel>
                      {t('component.graphing.layoutoptions.fontSize')}
                    </MoreOptionsLabel>
                    <FontSizeDropdown
                      t={t}
                      fontSizeList={fontSizeList}
                      currentItem={this.getFontSizeItem()}
                      onChangeFontSize={this.changeFontSize}
                    />
                  </MoreOptionsRow>
                </Col>
              </Row>
            </Col>
          </Row>
        </MoreOptionsContainer>

        <MoreOptionsDivider />

        <MoreOptionsContainer>
          <MoreOptionsSubHeading>
            {t('component.graphing.ticksoptionstitle')}
          </MoreOptionsSubHeading>

          <MoreOptionsColumnContainer>
            <MoreOptionsColumn>
              <MoreOptionsRow>
                <Checkbox
                  label={t('component.graphing.ticksoptions.showticks')}
                  name="showTicks"
                  onChange={() => this.handleNumberlineCheckboxChange('showTicks', numberlineAxis.showTicks)}
                  checked={numberlineAxis.showTicks}
                />
              </MoreOptionsRow>
              <MoreOptionsRow>
                <Checkbox
                  label={t('component.graphing.labelsoptions.showmax')}
                  name="showMax"
                  onChange={() => this.handleCheckbox('ticksShowMax', ticksShowMax)}
                  checked={ticksShowMax}
                />
              </MoreOptionsRow>
            </MoreOptionsColumn>
            <MoreOptionsColumn>
              <MoreOptionsRow>
                <Checkbox
                  label={t('component.graphing.labelsoptions.showmin')}
                  name="showMin"
                  onChange={() => this.handleCheckbox('ticksShowMin', ticksShowMin)}
                  checked={ticksShowMin}
                />
              </MoreOptionsRow>
              <MoreOptionsRow>
                <MoreOptionsLabel>
                  {t('component.graphing.ticksoptions.tickdistance')}
                </MoreOptionsLabel>
                <MoreOptionsInput
                  type="number"
                  defaultValue="1"
                  name="ticksDistance"
                  onChange={this.handleNumberlineInputChange}
                  value={numberlineAxis.ticksDistance}
                />
              </MoreOptionsRow>
            </MoreOptionsColumn>
          </MoreOptionsColumnContainer>
          <MoreOptionsColumnContainer style={{ marginTop: 20 }}>
            <MoreOptionsColumn>
              <MoreOptionsRow>
                <MoreOptionsLabel>
                  {t('component.graphing.ticksoptions.minorTicks')}
                </MoreOptionsLabel>
                <MoreOptionsInput
                  type="text"
                  defaultValue="600px"
                  name="minorTicks"
                  onChange={this.handleInputChange}
                  value={minorTicks}
                />
              </MoreOptionsRow>
            </MoreOptionsColumn>

            <MoreOptionsColumn>
              <MoreOptionsRow>
                <MoreOptionsLabel>
                  {t('component.graphing.ticksoptions.renderingbase')}
                </MoreOptionsLabel>
                <Select
                  style={{ width: '80%' }}
                  onChange={val => this.handleSelect('renderingBase', val)}
                  options={renderingBaseList}
                  value={renderingBase}
                />
              </MoreOptionsRow>
            </MoreOptionsColumn>
          </MoreOptionsColumnContainer>
        </MoreOptionsContainer>

        <MoreOptionsDivider />

        <MoreOptionsContainer>
          <MoreOptionsSubHeading>
            {t('component.graphing.labelstitle')}
          </MoreOptionsSubHeading>

          <MoreOptionsColumnContainer>
            <MoreOptionsColumn>
              <MoreOptionsRow>
                <Checkbox
                  label={t('component.graphing.labelsoptions.showLabels')}
                  name="showLabels"
                  onChange={() => this.handleCheckbox('showLabels', showLabels)}
                  checked={showLabels}
                />
              </MoreOptionsRow>
              <MoreOptionsRow>
                <Checkbox
                  label={t('component.graphing.labelsoptions.showmax')}
                  name="labelShowMax"
                  onChange={() => this.handleCheckbox('labelShowMax', labelShowMax)}
                  checked={labelShowMax}
                />
              </MoreOptionsRow>
            </MoreOptionsColumn>

            <MoreOptionsColumn>
              <MoreOptionsRow>
                <Checkbox
                  label={t('component.graphing.labelsoptions.showmin')}
                  name="labelShowMin"
                  onChange={() => this.handleCheckbox('labelShowMin', labelShowMin)}
                  checked={labelShowMin}
                />
              </MoreOptionsRow>
              <MoreOptionsRow>
                <MoreOptionsLabel>
                  {t('component.graphing.labelsoptions.displayspecificpoints')}
                </MoreOptionsLabel>
                <MoreOptionsInput
                  type="text"
                  defaultValue="600px"
                  name="labelDisplaySpecPoints"
                  onChange={this.handleInputChange}
                  value={labelDisplaySpecPoints}
                />
              </MoreOptionsRow>
            </MoreOptionsColumn>
          </MoreOptionsColumnContainer>
        </MoreOptionsContainer>
      </Fragment>
    );
  }
}

AxisSegmentsMoreOptions.propTypes = {
  t: PropTypes.func.isRequired,
  orientationList: PropTypes.array,
  fontSizeList: PropTypes.array,
  renderingBaseList: PropTypes.array
};

AxisSegmentsMoreOptions.defaultProps = {
  orientationList: [],
  fontSizeList: [],
  renderingBaseList: []
};

const enhance = compose(
  withNamespaces('assessment'),
);

export default enhance(AxisSegmentsMoreOptions);
