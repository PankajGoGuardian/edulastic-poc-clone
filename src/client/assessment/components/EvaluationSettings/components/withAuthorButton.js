import React, { Fragment } from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { EduButton } from '@edulastic/common'

const hasAuthorButton = ['GENERAL GRAPHING']

const withAuthorButton = (WrappedComponent) => {
  const withAuthorButtonHocComponent = ({ groupKey, ...props }) => (
    <>
      {hasAuthorButton.includes(groupKey) && (
        <AuthorButton isGhost height="28px" data-cy="howToAuthor">
          How to author
        </AuthorButton>
      )}
      <WrappedComponent {...props} />
    </>
  )
  withAuthorButtonHocComponent.propTypes = {
    groupKey: PropTypes.string,
  }

  withAuthorButtonHocComponent.defaultProps = {
    groupKey: '',
  }

  return withAuthorButtonHocComponent
}

export default withAuthorButton

const AuthorButton = styled(EduButton)`
  position: fixed;
  top: 10px;
  right: 64px;
`
