import React from 'react'
import styled from 'styled-components'
import TagsList from '../../../../../../common/components/TagsList'

// Note: This margin-inline should not be here.
// Left margin should be common left padding on container,
// so that there's single place to change it for all siblings.
const StyledSpan = styled.span`
  margin-inline: 10px 20px;
  font-weight: 600;
`

/**
 * @typedef {{
 *  standard: {standard: string; standardId: string}[]
 *  maxStandards: number
 * } & import('../../../../../../common/components/TagsList').TagsListProps} StandardTagsListProps
 *
 * @type {React.FC<StandardTagsListProps>}
 */
const StandardTagsList = ({ standards = [], maxStandards, ...rest }) => {
  const count = standards.length

  return (
    <div>
      <StyledSpan>
        {count} Standard{count > 1 ? 's' : ''} selected (Max {maxStandards})
      </StyledSpan>
      <TagsList
        data={standards.map((s) => ({ title: s.standard, key: s.standardId }))}
        {...rest}
      />
    </div>
  )
}

export default StandardTagsList
