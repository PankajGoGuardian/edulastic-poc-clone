import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { cloneDeep, isEqual } from 'lodash';
import styled from 'styled-components';

import { Paper, FlexContainer, Stimulus } from '@edulastic/common';
import { IconCarets } from '@edulastic/icons';
import { green, greenDark, secondaryTextColor } from '@edulastic/colors';
import { withNamespaces } from '@edulastic/localization';

import { DropContainer } from '../../common';
import ShowCorrect from '../ShowCorrect';
import { DragItem } from '../DragItem';

const { IconCaretLeft, IconCaretRight, IconCaretUp, IconCaretDown } = IconCarets;

const styles = {
  dropContainerStyles: smallSize => ({ marginBottom: smallSize ? 6 : 20, borderRadius: 4 }),
  wrapperStyles: smallSize => ({ marginTop: smallSize ? 0 : 40 })
};
class SortListPreview extends PureComponent {
  static propTypes = {
    previewTab: PropTypes.string,
    t: PropTypes.func.isRequired,
    smallSize: PropTypes.bool,
    item: PropTypes.object,
    saveAnswer: PropTypes.func.isRequired
  };

  static defaultProps = {
    previewTab: 'clear',
    smallSize: false,
    item: {}
  };

  state = {
    // eslint-disable-next-line react/destructuring-assignment
    items: this.props.item.source,

    // eslint-disable-next-line react/destructuring-assignment
    selected: Array.from({ length: this.props.item.source.length }, () => null),

    active: ''
  };

  onDrop = (itemCurrent, itemTo, flag) => {
    const data = cloneDeep(this.state);
    const { saveAnswer } = this.props;
    let tmp = [];

    [tmp] = data[flag].splice(itemCurrent.index, 1, data[itemTo.flag][itemTo.index]);

    data[itemTo.flag][itemTo.index] = tmp;

    this.setState(data);

    saveAnswer(data.selected);
  };

  setActive = (item) => {
    this.setState({ active: cloneDeep(item) });
  };

  onRightLeftClick = () => {
    const { items, selected, active } = cloneDeep(this.state);
    const { saveAnswer } = this.props;

    if (items.includes(active)) {
      items.splice(items.indexOf(active), 1, null);
      selected.splice(selected.indexOf(null), 1, active);
    } else if (active) {
      selected.splice(selected.indexOf(active), 1, null);
      items.splice(items.indexOf(null), 1, active);
    }

    if (active) {
      this.setState({
        items,
        selected,
        active: ''
      });
      saveAnswer(selected);
    }
  };

  onUpDownClick = indicator => () => {
    const { selected, active } = cloneDeep(this.state);
    const { saveAnswer } = this.props;

    let tmp;

    if (selected.includes(active)) {
      const activeIndex = selected.indexOf(active);
      if (indicator === 'Up' && activeIndex !== 0) {
        tmp = selected[activeIndex - 1];
        selected[activeIndex - 1] = selected[activeIndex];
        selected[activeIndex] = tmp;
      }
      if (indicator === 'Down' && activeIndex !== selected.length - 1) {
        tmp = selected[activeIndex + 1];
        selected[activeIndex + 1] = selected[activeIndex];
        selected[activeIndex] = tmp;
      }
      this.setState({
        selected,
        active
      });
      saveAnswer(selected);
    }
  };

  drop = ({ obj, index, flag }) => ({ obj, index, flag });

  render() {
    const {
      previewTab,
      item,
      t,
      smallSize,
      item: {
        validation: {
          valid_response: { value: valid_response },
          alt_responses
        }
      }
    } = this.props;

    const { items, selected, active } = this.state;

    const inCorrectList = selected
      .filter((ite, i) => ite && ite !== item.source[valid_response[i]])
      .concat(items.filter(i => i !== null));

    let altRespCorrect = [];

    alt_responses.forEach((ob) => {
      const alt = selected.filter((ite, i) => ite && ite === item.source[ob.value[i]]);

      if (alt.length > altRespCorrect.length) {
        altRespCorrect = alt;
      }
    });

    return (
      <Paper padding={smallSize} boxShadow={smallSize ? 'none' : ''}>
        {!smallSize && (
          <Stimulus>
            <div dangerouslySetInnerHTML={{ __html: item.stimulus }} />
          </Stimulus>
        )}
        <FlexContainer alignItems="flex-start" style={styles.wrapperStyles(smallSize)}>
          <FullWidthContainer>
            {!smallSize && (
              <Title smallSize={smallSize}>{t('component.sortList.containerSourcePreview')}</Title>
            )}
            {items.map((o, i) => (
              <DropContainer
                key={i}
                noBorder={!!o}
                style={styles.dropContainerStyles(smallSize)}
                index={i}
                flag="items"
                obj={o}
                drop={this.drop}
              >
                <DragItem
                  index={i}
                  smallSize={smallSize}
                  active={isEqual(active, o)}
                  onClick={this.setActive}
                  flag="items"
                  onDrop={this.onDrop}
                  obj={o}
                />
              </DropContainer>
            ))}
          </FullWidthContainer>

          <FlexWithMargins smallSize={smallSize}>
            <IconLeft smallSize={smallSize} onClick={this.onRightLeftClick} />
            <IconRight smallSize={smallSize} onClick={this.onRightLeftClick} />
          </FlexWithMargins>

          <FullWidthContainer>
            {!smallSize && (
              <Title smallSize={smallSize}>{t('component.sortList.containerTargetPreview')}</Title>
            )}
            {selected.map((o, i) => (
              <DropContainer
                key={i}
                noBorder={!!o}
                style={styles.dropContainerStyles(smallSize)}
                index={i}
                flag="selected"
                obj={o}
                drop={this.drop}
              >
                <DragItem
                  index={i}
                  correct={altRespCorrect.includes(o) || !inCorrectList.includes(o)}
                  smallSize={smallSize}
                  previewTab={previewTab}
                  flag="selected"
                  active={isEqual(active, o)}
                  onClick={this.setActive}
                  onDrop={this.onDrop}
                  obj={o}
                />
              </DropContainer>
            ))}
          </FullWidthContainer>

          <FlexCol smallSize={smallSize}>
            <IconUp smallSize={smallSize} onClick={this.onUpDownClick('Up')} />
            <IconDown smallSize={smallSize} onClick={this.onUpDownClick('Down')} />
          </FlexCol>
        </FlexContainer>

        {previewTab === 'show' && (
          <ShowCorrect source={item.source} list={inCorrectList} correctList={valid_response} />
        )}
      </Paper>
    );
  }
}

export default withNamespaces('assessment')(SortListPreview);

const Title = styled.p`
  text-align: center;
  width: 100%;
  font-weight: 600;
  margin-bottom: ${({ smallSize }) => (smallSize ? 5 : 15)}px;
  font-size: 13px;
  color: ${secondaryTextColor};
  text-transform: uppercase;
`;

const IconDown = styled(IconCaretDown)`
  color: ${green};
  margin: 0;
  font-size: ${({ smallSize }) => (smallSize ? 10 : 20)}px;
`;
const IconUp = styled(IconCaretUp)`
  color: ${green};
  margin: 0;
  font-size: ${({ smallSize }) => (smallSize ? 10 : 20)}px;
`;
const IconLeft = styled(IconCaretLeft)`
  color: ${green};
  margin: 0;
  font-size: ${({ smallSize }) => (smallSize ? 10 : 20)}px;
`;
const IconRight = styled(IconCaretRight)`
  color: ${green};
  margin: 0;
  font-size: ${({ smallSize }) => (smallSize ? 10 : 20)}px;
`;

const FlexWithMargins = styled(FlexContainer)`
  margin-top: ${({ smallSize }) => (smallSize ? -10 : 10)}px;
  margin-right: ${({ smallSize }) => (smallSize ? 5 : 30)}px;
  margin-left: ${({ smallSize }) => (smallSize ? 5 : 30)}px;
  align-self: center;
  & ${IconLeft}:hover, ${IconRight}:hover, ${IconUp}:hover, ${IconDown}:hover {
    color: ${greenDark};
    cursor: pointer;
  }
`;

const FlexCol = styled(FlexWithMargins)`
  flex-direction: column;
`;

const FullWidthContainer = styled.div`
  width: 100%;
  margin-right: 0;
`;
