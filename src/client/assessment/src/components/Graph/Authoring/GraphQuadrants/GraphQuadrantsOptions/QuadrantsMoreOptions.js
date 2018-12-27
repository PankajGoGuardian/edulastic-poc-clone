import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import { compose } from 'redux';
import { withNamespaces } from '@edulastic/localization';
import { Checkbox, Select } from '@edulastic/common';
import {
  MoreOptionsContainer,
  MoreOptionsColumn,
  MoreOptionsColumnContainer,
  MoreOptionsDivider,
  MoreOptionsInput,
  MoreOptionsInputSmall,
  MoreOptionsLabel,
  MoreOptionsRow,
  MoreOptionsRowInline,
  MoreOptionsSubHeading
} from '../../../common/styled_components';
import GraphContainer from '../../../Display/GraphContainer';
import { CONSTANT } from '../../../Builder/config';

class QuadrantsMoreOptions extends Component {
  handleCheckbox = (name, checked) => {
    const { options, setOptions } = this.props;
    setOptions({ ...options, [name]: !checked });
  };

  handleInputChange = (event) => {
    const { target: { name, value } } = event;

    const { options, setOptions } = this.props;
    setOptions({ ...options, [name]: value });
  };

  handleSelect = (name, value) => {
    const { options, setOptions } = this.props;
    setOptions({ ...options, [name]: value });
  };

  handleBgImgCheckbox = (name, checked) => {
    const { bgImgOptions, setBgImg } = this.props;
    setBgImg({ ...bgImgOptions, [name]: !checked });
  };

  handleBgImgInputChange = (event) => {
    const { target: { name, value } } = event;

    const { bgImgOptions, setBgImg } = this.props;
    setBgImg({ ...bgImgOptions, [name]: value });
  };

  getTools = () => [
    CONSTANT.TOOLS.POINT,
    CONSTANT.TOOLS.CIRCLE,
    CONSTANT.TOOLS.PARABOLA,
    CONSTANT.TOOLS.POLYGON,
    CONSTANT.TOOLS.SIN,
    CONSTANT.TOOLS.LINE,
    CONSTANT.TOOLS.RAY,
    CONSTANT.TOOLS.VECTOR,
    CONSTANT.TOOLS.SEGMENT,
    CONSTANT.TOOLS.LABEL
  ];

  render() {
    const {
      t,
      stemNumerationList,
      fontSizeList,
      options,
      canvasConfig,
      bgImgOptions,
      backgroundShapes,
      setBgShapes
    } = this.props;
    const {
      drawLabelZero,
      displayPositionOnHover,
      currentStemNum,
      currentFontSize,
      xShowAxisLabel,
      xHideTicks,
      xDrawLabel,
      xMaxArrow,
      xMinArrow,
      xCommaInLabel,
      yShowAxisLabel,
      yHideTicks,
      yDrawLabel,
      yMaxArrow,
      yMinArrow,
      yCommaInLabel,
      xDistance,
      yDistance,
      xTickDistance,
      yTickDistance,
      layout_width,
      layout_height,
      layout_margin,
      layout_snapto,
      xAxisLabel,
      yAxisLabel
    } = options;

    return (
      <Fragment>
        <MoreOptionsContainer>
          <MoreOptionsSubHeading>
            {t('component.graphing.layoutoptionstitle')}
          </MoreOptionsSubHeading>

          <MoreOptionsColumnContainer>
            <MoreOptionsColumn>
              <MoreOptionsRow>
                <MoreOptionsLabel>
                  {t('component.graphing.layoutoptions.width')}
                </MoreOptionsLabel>
                <MoreOptionsInput
                  type="text"
                  defaultValue="600"
                  name="layout_width"
                  value={layout_width}
                  onChange={this.handleInputChange}
                />
              </MoreOptionsRow>
              <MoreOptionsRow>
                <MoreOptionsLabel>
                  {t('component.graphing.layoutoptions.margin')}
                </MoreOptionsLabel>
                <MoreOptionsInput
                  type="text"
                  defaultValue="0"
                  name="layout_margin"
                  value={layout_margin}
                  onChange={this.handleInputChange}
                />
              </MoreOptionsRow>
              <MoreOptionsRow style={{ marginTop: '16px' }}>
                <Checkbox
                  label={t('component.graphing.layoutoptions.drawLabelzero')}
                  name="drawLabelZero"
                  onChange={() => this.handleCheckbox('drawLabelZero', drawLabelZero)}
                  checked={drawLabelZero}
                />
              </MoreOptionsRow>
              <MoreOptionsRow>
                <MoreOptionsLabel>
                  {t('component.graphing.layoutoptions.stemNumeration')}
                </MoreOptionsLabel>
                <Select
                  style={{ width: '77%', marginTop: '11px' }}
                  onChange={val => this.handleSelect('currentStemNum', val)}
                  options={stemNumerationList}
                  value={currentStemNum}
                />
              </MoreOptionsRow>
            </MoreOptionsColumn>

            <MoreOptionsColumn>
              <MoreOptionsRow>
                <MoreOptionsLabel>
                  {t('component.graphing.layoutoptions.height')}
                </MoreOptionsLabel>
                <MoreOptionsInput
                  type="text"
                  defaultValue="600"
                  name="layout_height"
                  value={layout_height}
                  onChange={this.handleInputChange}
                />
              </MoreOptionsRow>
              <MoreOptionsRow>
                <MoreOptionsLabel>
                  {t('component.graphing.layoutoptions.snapTo')}
                </MoreOptionsLabel>
                <MoreOptionsInput
                  type="text"
                  defaultValue="grid"
                  name="layout_snapto"
                  value={layout_snapto}
                  onChange={this.handleInputChange}
                />
              </MoreOptionsRow>
              <MoreOptionsRow style={{ marginTop: '16px' }}>
                <Checkbox
                  label={t('component.graphing.layoutoptions.displayPositionOnHover')}
                  name="displayPositionOnHover"
                  onChange={() => this.handleCheckbox('displayPositionOnHover', displayPositionOnHover)}
                  checked={displayPositionOnHover}
                />
              </MoreOptionsRow>
              <MoreOptionsRow>
                <MoreOptionsLabel>
                  {t('component.graphing.layoutoptions.fontSize')}
                </MoreOptionsLabel>
                <Select
                  style={{ width: '77%', marginTop: '11px' }}
                  onChange={val => this.handleSelect('currentFontSize', val)}
                  options={fontSizeList}
                  value={currentFontSize}
                />
              </MoreOptionsRow>
            </MoreOptionsColumn>
          </MoreOptionsColumnContainer>
        </MoreOptionsContainer>

        <MoreOptionsDivider />

        <MoreOptionsContainer>
          <MoreOptionsSubHeading>
            {t('component.graphing.grid_options.grid')}
          </MoreOptionsSubHeading>

          <MoreOptionsColumnContainer>
            <MoreOptionsColumn>
              <MoreOptionsRow>
                <MoreOptionsLabel>
                  {t('component.graphing.grid_options.axis_x')}
                </MoreOptionsLabel>
              </MoreOptionsRow>
              <MoreOptionsRowInline>
                <MoreOptionsInputSmall
                  type="number"
                  defaultValue="1"
                  name="xDistance"
                  value={xDistance}
                  onChange={this.handleInputChange}
                />
                <MoreOptionsLabel style={{ marginLeft: '29px' }}>
                  {t('component.graphing.grid_options.x_distance')}
                </MoreOptionsLabel>
              </MoreOptionsRowInline>
              <MoreOptionsRowInline>
                <MoreOptionsInputSmall
                  type="number"
                  name="xTickDistance"
                  value={xTickDistance}
                  onChange={this.handleInputChange}
                />
                <MoreOptionsLabel style={{ marginLeft: '29px' }}>
                  {t('component.graphing.grid_options.tick_distance')}
                </MoreOptionsLabel>
              </MoreOptionsRowInline>

              <MoreOptionsRow style={{ marginTop: '40px' }}>
                <Checkbox
                  label={t('component.graphing.grid_options.show_axis_label')}
                  name="drawLabelZero"
                  onChange={() => this.handleCheckbox('xShowAxisLabel', xShowAxisLabel)}
                  checked={xShowAxisLabel}
                />
              </MoreOptionsRow>
              {
                xShowAxisLabel && (
                  <MoreOptionsRow style={{ marginTop: '16px' }}>
                    <MoreOptionsInput
                      type="text"
                      defaultValue="X"
                      style={{ width: '7em', marginTop: 0 }}
                      name="xAxisLabel"
                      value={xAxisLabel}
                      onChange={this.handleInputChange}
                    />
                  </MoreOptionsRow>
                )
              }
              <MoreOptionsRow style={{ marginTop: '40px' }}>
                <Checkbox
                  label={t('component.graphing.grid_options.hide_ticks')}
                  name="drawLabelZero"
                  onChange={() => this.handleCheckbox('xHideTicks', xHideTicks)}
                  checked={xHideTicks}
                />
              </MoreOptionsRow>
              <MoreOptionsRow style={{ marginTop: '40px' }}>
                <Checkbox
                  label={t('component.graphing.grid_options.draw_label')}
                  name="drawLabelZero"
                  onChange={() => this.handleCheckbox('xDrawLabel', xDrawLabel)}
                  checked={xDrawLabel}
                />
              </MoreOptionsRow>
              <MoreOptionsRow style={{ marginTop: '40px' }}>
                <Checkbox
                  label={t('component.graphing.grid_options.min_arrow')}
                  name="drawLabelZero"
                  onChange={() => this.handleCheckbox('xMinArrow', xMinArrow)}
                  checked={xMinArrow}
                />
              </MoreOptionsRow>
              <MoreOptionsRow style={{ marginTop: '40px' }}>
                <Checkbox
                  label={t('component.graphing.grid_options.max_arrow')}
                  name="drawLabelZero"
                  onChange={() => this.handleCheckbox('xMaxArrow', xMaxArrow)}
                  checked={xMaxArrow}
                />
              </MoreOptionsRow>
              <MoreOptionsRow style={{ marginTop: '40px' }}>
                <Checkbox
                  label={t('component.graphing.grid_options.comma_in_label')}
                  name="drawLabelZero"
                  onChange={() => this.handleCheckbox('xCommaInLabel', xCommaInLabel)}
                  checked={xCommaInLabel}
                />
              </MoreOptionsRow>
            </MoreOptionsColumn>

            <MoreOptionsColumn>
              <MoreOptionsRow>
                <MoreOptionsLabel>
                  {t('component.graphing.grid_options.axis_y')}
                </MoreOptionsLabel>
              </MoreOptionsRow>
              <MoreOptionsRowInline>
                <MoreOptionsInputSmall
                  type="number"
                  defaultValue="1"
                  style={{ width: '7em', marginTop: 0 }}
                  name="yDistance"
                  value={yDistance}
                  onChange={this.handleInputChange}
                />
                <MoreOptionsLabel style={{ marginLeft: '29px' }}>
                  {t('component.graphing.grid_options.y_distance')}
                </MoreOptionsLabel>
              </MoreOptionsRowInline>
              <MoreOptionsRowInline>
                <MoreOptionsInputSmall
                  type="number"
                  style={{ width: '7em', marginTop: 0 }}
                  name="yTickDistance"
                  value={yTickDistance}
                  onChange={this.handleInputChange}
                />
                <MoreOptionsLabel style={{ marginLeft: '29px' }}>
                  {t('component.graphing.grid_options.tick_distance')}
                </MoreOptionsLabel>
              </MoreOptionsRowInline>
              <MoreOptionsRow style={{ marginTop: '40px' }}>
                <Checkbox
                  label={t('component.graphing.grid_options.show_axis_label')}
                  name="drawLabelZero"
                  onChange={() => this.handleCheckbox('yShowAxisLabel', yShowAxisLabel)}
                  checked={yShowAxisLabel}
                />
              </MoreOptionsRow>
              {
                yShowAxisLabel && (
                  <MoreOptionsRow style={{ marginTop: '16px' }}>
                    <MoreOptionsInput
                      type="text"
                      defaultValue="X"
                      style={{ width: '7em', marginTop: 0 }}
                      name="yAxisLabel"
                      value={yAxisLabel}
                      onChange={this.handleInputChange}
                    />
                  </MoreOptionsRow>
                )
              }
              <MoreOptionsRow style={{ marginTop: '40px' }}>
                <Checkbox
                  label={t('component.graphing.grid_options.hide_ticks')}
                  name="drawLabelZero"
                  onChange={() => this.handleCheckbox('yHideTicks', yHideTicks)}
                  checked={yHideTicks}
                />
              </MoreOptionsRow>
              <MoreOptionsRow style={{ marginTop: '40px' }}>
                <Checkbox
                  label={t('component.graphing.grid_options.draw_label')}
                  name="drawLabelZero"
                  onChange={() => this.handleCheckbox('yDrawLabel', yDrawLabel)}
                  checked={yDrawLabel}
                />
              </MoreOptionsRow>
              <MoreOptionsRow style={{ marginTop: '40px' }}>
                <Checkbox
                  label={t('component.graphing.grid_options.min_arrow')}
                  name="drawLabelZero"
                  onChange={() => this.handleCheckbox('yMinArrow', yMinArrow)}
                  checked={yMinArrow}
                />
              </MoreOptionsRow>
              <MoreOptionsRow style={{ marginTop: '40px' }}>
                <Checkbox
                  label={t('component.graphing.grid_options.max_arrow')}
                  name="drawLabelZero"
                  onChange={() => this.handleCheckbox('yMaxArrow', yMaxArrow)}
                  checked={yMaxArrow}
                />
              </MoreOptionsRow>
              <MoreOptionsRow style={{ marginTop: '40px' }}>
                <Checkbox
                  label={t('component.graphing.grid_options.comma_in_label')}
                  name="drawLabelZero"
                  onChange={() => this.handleCheckbox('yCommaInLabel', yCommaInLabel)}
                  checked={yCommaInLabel}
                />
              </MoreOptionsRow>
            </MoreOptionsColumn>
          </MoreOptionsColumnContainer>
        </MoreOptionsContainer>

        <MoreOptionsDivider />

        <MoreOptionsContainer>
          <MoreOptionsSubHeading>
            {t('component.graphing.background_options.background_image')}
          </MoreOptionsSubHeading>
          <MoreOptionsRow>
            <MoreOptionsLabel>
              {t('component.graphing.background_options.image_url')}
            </MoreOptionsLabel>
            <MoreOptionsInput
              style={{ width: '88.5%' }}
              type="text"
              defaultValue=""
              name="src"
              value={bgImgOptions.src}
              onChange={this.handleBgImgInputChange}
            />
          </MoreOptionsRow>
          <MoreOptionsColumnContainer>
            <MoreOptionsColumn>
              <MoreOptionsRow>
                <MoreOptionsLabel>
                  {t('component.graphing.background_options.height')}
                </MoreOptionsLabel>
                <MoreOptionsInput
                  type="text"
                  defaultValue=""
                  name="height"
                  value={bgImgOptions.height}
                  onChange={this.handleBgImgInputChange}
                />
              </MoreOptionsRow>
              <MoreOptionsRow>
                <MoreOptionsLabel>
                  {t('component.graphing.background_options.x_axis_image_position')}
                </MoreOptionsLabel>
                <MoreOptionsInput
                  type="text"
                  defaultValue=""
                  name="x"
                  value={bgImgOptions.x}
                  onChange={this.handleBgImgInputChange}
                />
              </MoreOptionsRow>
              <MoreOptionsRow>
                <MoreOptionsLabel>
                  {t('component.graphing.background_options.opacity')}
                </MoreOptionsLabel>
                <MoreOptionsInput
                  type="text"
                  defaultValue=""
                  name="opacity"
                  value={bgImgOptions.opacity}
                  onChange={this.handleBgImgInputChange}
                />
              </MoreOptionsRow>
            </MoreOptionsColumn>
            <MoreOptionsColumn>
              <MoreOptionsRow>
                <MoreOptionsLabel>
                  {t('component.graphing.background_options.width')}
                </MoreOptionsLabel>
                <MoreOptionsInput
                  type="text"
                  defaultValue=""
                  name="width"
                  value={bgImgOptions.width}
                  onChange={this.handleBgImgInputChange}
                />
              </MoreOptionsRow>
              <MoreOptionsRow>
                <MoreOptionsLabel>
                  {t('component.graphing.background_options.y_axis_image_position')}
                </MoreOptionsLabel>
                <MoreOptionsInput
                  type="text"
                  defaultValue=""
                  name="y"
                  value={bgImgOptions.y}
                  onChange={this.handleBgImgInputChange}
                />
              </MoreOptionsRow>
              <MoreOptionsRow style={{ marginTop: '58px' }}>
                <Checkbox
                  label={t('component.graphing.background_options.show_bg_shape_points')}
                  name="showShapePoints"
                  onChange={() => this.handleBgImgCheckbox('showShapePoints', bgImgOptions.showShapePoints)}
                  checked={bgImgOptions.showShapePoints}
                />
              </MoreOptionsRow>
            </MoreOptionsColumn>
          </MoreOptionsColumnContainer>
        </MoreOptionsContainer>

        <MoreOptionsDivider />

        <MoreOptionsContainer>
          <MoreOptionsSubHeading>
            {t('component.graphing.background_shapes')}
          </MoreOptionsSubHeading>
          <MoreOptionsRow>
            <GraphContainer
              uiStyle={options}
              canvasConfig={canvasConfig}
              tools={this.getTools()}
              bgImgOptions={bgImgOptions}
              elements={backgroundShapes}
              onChange={setBgShapes}
            />
          </MoreOptionsRow>
        </MoreOptionsContainer>
      </Fragment>
    );
  }
}

QuadrantsMoreOptions.propTypes = {
  t: PropTypes.func.isRequired,
  stemNumerationList: PropTypes.array,
  fontSizeList: PropTypes.array,
  options: PropTypes.object.isRequired,
  setOptions: PropTypes.func.isRequired,
  bgImgOptions: PropTypes.object.isRequired,
  setBgImg: PropTypes.func.isRequired,
  canvasConfig: PropTypes.object.isRequired,
  backgroundShapes: PropTypes.array,
  setBgShapes: PropTypes.func
};

QuadrantsMoreOptions.defaultProps = {
  stemNumerationList: [],
  fontSizeList: [],
  backgroundShapes: [],
  setBgShapes: () => {}
};

const enhance = compose(
  withNamespaces('assessment'),
);

export default enhance(QuadrantsMoreOptions);
