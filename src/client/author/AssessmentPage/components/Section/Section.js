import React from "react";
import PropTypes from "prop-types";
import { isEmpty } from "lodash";

import { IconPencilEdit, IconTrash } from "@edulastic/icons";

import { SectionWrapper, SectionTitle, SectionForm, SectionFormConfirmButton, Actions } from "./styled";

export default class Section extends React.Component {
  static propTypes = {
    section: PropTypes.object.isRequired,
    viewMode: PropTypes.string.isRequired,
    onUpdate: PropTypes.func.isRequired,
    onDelete: PropTypes.func.isRequired
  };

  state = {
    title: "",
    edit: false
  };

  componentWillMount() {
    const {
      section: { title }
    } = this.props;
    this.setState({
      title
    });
  }

  handleSetEdit = edit => this.setState({ edit });

  handleSetTitle = () => {
    const { title } = this.state;
    const {
      onUpdate,
      section: { id }
    } = this.props;

    if (isEmpty(title)) return;

    this.handleSetEdit(false);
    onUpdate(id, title);
  };

  handleChangeTitle = e => {
    this.setState({ title: e.target.value });
  };

  renderActions = () => {
    const { onDelete } = this.props;
    const handleEditClick = () => this.handleSetEdit(true);

    return (
      <Actions>
        <IconPencilEdit onClick={handleEditClick} />
        <IconTrash onClick={onDelete} />
      </Actions>
    );
  };

  renderView() {
    const {
      section: { title },
      viewMode
    } = this.props;
    const review = viewMode === "review";

    return (
      <SectionWrapper>
        <SectionTitle>{title}</SectionTitle>
        {!review && this.renderActions()}
      </SectionWrapper>
    );
  }

  renderForm() {
    const { title } = this.state;
    return (
      <SectionWrapper>
        <SectionForm value={title} onChange={this.handleChangeTitle} onPressEnter={this.handleSetTitle} />
        <SectionFormConfirmButton onClick={this.handleSetTitle} />
      </SectionWrapper>
    );
  }

  render() {
    const { edit } = this.state;
    const {
      section: { title }
    } = this.props;

    if (isEmpty(title) || edit) {
      return this.renderForm();
    }

    return this.renderView();
  }
}
