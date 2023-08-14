import React from 'react'
import PropTypes from 'prop-types'
import { isEmpty } from 'lodash'

import { IconPencilEdit, IconTrash } from '@edulastic/icons'

import { notification } from '@edulastic/common'
import {
  SectionWrapper,
  SectionTitle,
  SectionForm,
  SectionFormConfirmButton,
  Actions,
} from '../styled-components/Section'

export default class Section extends React.Component {
  static propTypes = {
    section: PropTypes.object.isRequired,
    viewMode: PropTypes.string.isRequired,
    onUpdate: PropTypes.func.isRequired,
    onDelete: PropTypes.func.isRequired,
  }

  state = {
    title: '',
    shouldBlur: true,
    edit: false,
  }

  componentWillMount() {
    const {
      section: { title },
    } = this.props
    this.setState({
      title,
    })
  }

  handleSetEdit = (edit) => this.setState({ edit })

  handleSetTitle = () => {
    const { title } = this.state
    const {
      onUpdate,
      section: { id },
    } = this.props

    if (isEmpty(title))
      return notification({ messageKey: 'sectionNameCanNotEmpty' })

    this.handleSetEdit(false)
    onUpdate(id, title)
  }

  handleChangeTitle = (e) => {
    this.setState({ title: e.target.value })
  }

  renderActions = () => {
    const { onDelete } = this.props
    const handleEditClick = () => this.handleSetEdit(true)

    return (
      <Actions>
        <IconPencilEdit
          onClick={handleEditClick}
          title="Edit"
          data-cy="editSection"
        />
        <IconTrash onClick={onDelete} title="Delete" data-cy="sectionDelete" />
      </Actions>
    )
  }

  renderView() {
    const {
      section: { title },
      viewMode,
    } = this.props
    const review = viewMode === 'review' || viewMode === 'report'

    return (
      <SectionWrapper>
        <SectionTitle title={title}>{title}</SectionTitle>
        {!review && this.renderActions()}
      </SectionWrapper>
    )
  }

  renderForm() {
    const { title, shouldBlur } = this.state
    const { onDelete } = this.props
    return (
      <SectionWrapper>
        <SectionForm
          autoFocus
          value={title}
          onChange={this.handleChangeTitle}
          onBlur={shouldBlur ? this.handleSetTitle : ''}
          onPressEnter={this.handleSetTitle}
          data-cy="sectionInput"
        />
        <SectionFormConfirmButton
          onMouseDown={() => this.setState({ shouldBlur: false })}
          style={{ marginLeft: '5px' }}
          title="Save"
          onClick={this.handleSetTitle}
          data-cy="sectionSave"
        />
        <IconTrash
          onClick={onDelete}
          title="Delete"
          onMouseDown={() => this.setState({ shouldBlur: false })}
          style={{ marginLeft: '5px', cursor: 'pointer' }}
          data-cy="sectionDelete"
        />
      </SectionWrapper>
    )
  }

  render() {
    const { edit } = this.state
    const {
      section: { title },
    } = this.props

    if (isEmpty(title) || edit) {
      return this.renderForm()
    }

    return this.renderView()
  }
}
