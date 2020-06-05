import React, { Component } from "react";
import PropTypes from "prop-types";

import { withNamespaces } from "@edulastic/localization";

import MobileAssignment from "./components/MobileAssignment/MobileAssignment";
import { Container, MobilePagination, MobilePaginationWrapper, ContentWrapper } from "./styled";

class MobileTableList extends Component {
  static propTypes = {
    tests: PropTypes.array,
    onOpenReleaseScoreSettings: PropTypes.func.isRequired
  };

  static defaultProps = {
    tests: []
  };

  state = {
    currentItem: 0
  };

  constructor(props) {
    super(props);

    this.containerRef = React.createRef();
    this.touchStartX = 0;
    this.touchEndX = 0;
  }

  get totalAssignments() {
    const { tests } = this.props;
    return tests.length;
  }

  handleSetContainerRef = ref => {
    this.containerRef = ref;
  };

  moveCurrentItem = () => {
    if (!this.containerRef) return;

    const { currentItem } = this.state;
    const { innerWidth } = window;

    const leftMargin = 26;
    const rightMargin = 56;
    const itemWidth = innerWidth - leftMargin - rightMargin;

    const leftOffset = innerWidth - itemWidth;
    const itemOffset = currentItem * innerWidth;
    const margin = leftOffset * currentItem;

    const yOffset = itemOffset - margin + 20 * currentItem - 22;

    this.containerRef.scrollTo({
      top: 0,
      left: yOffset,
      behavior: "smooth"
    });

    this.touchStartX = 0;
    this.touchEndX = 0;
  };

  handleChangeCurrentItem = page => {
    const { currentItem } = this.state;

    if (page - 1 === currentItem) return;

    this.setState(
      {
        currentItem: page - 1
      },
      this.moveCurrentItem
    );
  };

  handleTouchStart = ({ touches }) => {
    this.touchStartX = touches[0].screenX;
  };

  handleTouchMove = ({ touches }) => {
    this.touchEndX = touches[0].screenX;
  };

  handleTouchEnd = () => {
    const { currentItem } = this.state;

    if (this.touchEndX === 0) {
      this.touchStartX = 0;
      return;
    }

    const treshold = 100;
    const diff = Math.abs(this.touchStartX - this.touchEndX);
    const canProceed = diff > treshold;

    if (!canProceed) return;

    const page = currentItem + 1;

    const shouldIncreasePage = this.touchEndX < this.touchStartX;
    const shouldDescreasePage = this.touchEndX > this.touchStartX;

    if (shouldDescreasePage) {
      const decreasedPage = page === 1 ? 1 : page - 1;

      this.handleChangeCurrentItem(decreasedPage);
    } else if (shouldIncreasePage) {
      const increasedPage = page === this.totalAssignments ? page : page + 1;

      this.handleChangeCurrentItem(increasedPage);
    }
  };

  renderItem = (item, key) => {
    const { onOpenReleaseScoreSettings, assignmentsByTestId } = this.props;
    if (assignmentsByTestId[item._id]) {
      return (
        <MobileAssignment
          key={key}
          assignment={assignmentsByTestId[item._id]}
          onOpenReleaseScoreSettings={onOpenReleaseScoreSettings}
        />
      );
    }
    return "";
  };

  render() {
    const { currentItem } = this.state;
    const { tests } = this.props;
    const currentPage = currentItem + 1;

    return (
      <ContentWrapper>
        <Container
          onTouchStart={this.handleTouchStart}
          onTouchMove={this.handleTouchMove}
          onTouchEnd={this.handleTouchEnd}
          ref={this.handleSetContainerRef}
        >
          {tests.map(this.renderItem)}
        </Container>
        <MobilePaginationWrapper>
          <MobilePagination
            defaultPageSize={1}
            defaultCurrent={1}
            current={currentPage}
            onChange={this.handleChangeCurrentItem}
            total={this.totalAssignments}
            size="large"
            hideOnSinglePage
          />
        </MobilePaginationWrapper>
      </ContentWrapper>
    );
  }
}

export default withNamespaces("assignmentCard")(MobileTableList);
