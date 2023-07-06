import { MULTIPLE_CHOICE } from '@edulastic/constants/const/questionType'
import uuid from 'uuid/v4'

const uuids = [uuid(), uuid(), uuid(), uuid()]

export const videoQuizDefaultQuestionOptions = {
  [MULTIPLE_CHOICE]: [
    { label: 'A', value: uuids[0] },
    { label: 'B', value: uuids[1] },
    { label: 'C', value: uuids[2] },
    { label: 'D', value: uuids[3] },
  ],
}

export const videoQuizStimulusSupportedQtypes = [MULTIPLE_CHOICE]
