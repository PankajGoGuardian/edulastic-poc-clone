import React, { useMemo } from 'react'
import { get } from 'lodash'
import { QuestionDetails, DetailRow, FlexWrap } from './styled'
import Standards from '../../../../ItemList/components/Item/Standards'

const QuestionPreviewDetails = ({
  id,
  createdBy,
  maxScore,
  depthOfKnowledge,
  authorDifficulty,
  bloomsTaxonomy,
  tags,
  item,
}) => {
  const allRubricNames = useMemo(() => {
    const questions = get(item, 'data.questions', [])
    let rubricNames = []
    if (questions.length === 1 && questions[0]?.rubrics?.name) {
      rubricNames = [questions[0].rubrics.name]
    } else {
      rubricNames = questions.map((q, index) => {
        if (q?.rubrics?.name) {
          return `Q${index + 1}: ${q.rubrics.name}`
        }
        return ''
      })
    }
    return rubricNames.filter((name) => name)
  }, [item])

  return (
    <QuestionDetails>
      <FlexWrap>
        <DetailRow font={11}>
          <label>ID: </label>
          <span data-cy="item-id-on-preview">
            {id?.length > 6 ? id.substr(id.length - 6) : id || '--'}
          </span>
        </DetailRow>
        <DetailRow>
          <label>Owner: </label>
          <span data-cy="teacher-name-on-preview">
            {createdBy?.name || '--'}
          </span>
        </DetailRow>
        <DetailRow font={11}>
          <label>Points: </label>
          <span data-cy="points-on-preview">{maxScore || '--'}</span>
        </DetailRow>
      </FlexWrap>

      <FlexWrap border="none" justify="flex-start">
        <DetailRow direction="column">
          <label>Depth of Knowledge</label>
          <span data-cy="dok-on-preview">{depthOfKnowledge || '--'}</span>
        </DetailRow>
        <DetailRow direction="column">
          <label>Difficulty Level</label>
          <span data-cy="diff-on-preview">{authorDifficulty || '--'}</span>
        </DetailRow>
        <DetailRow direction="column">
          <label>Bloom’s Taxonomy</label>
          <span data-cy="tax-on-preview">{bloomsTaxonomy || '--'}</span>
        </DetailRow>
        <DetailRow direction="column">
          <label>Rubric</label>
          <span>
            {allRubricNames.length ? allRubricNames.join(', ') : '--'}
          </span>
        </DetailRow>
      </FlexWrap>

      <FlexWrap border="none" direction="column" align="flex-start">
        <DetailRow className="standards">
          <label>Standard: </label>
          <div data-cy="standards-on-preview">
            <Standards item={item} show={7} />
          </div>
        </DetailRow>
        <DetailRow className="tags">
          <label>Tags: </label>
          <div data-cy="tags-on-preview">
            {(tags &&
              tags.length &&
              tags.map((tag) => <span>{tag?.tagName}</span>)) ||
              '--'}
          </div>
        </DetailRow>
      </FlexWrap>
    </QuestionDetails>
  )
}

export default QuestionPreviewDetails
