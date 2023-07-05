import { MULTIPLE_CHOICE } from '@edulastic/constants/const/questionType'
import uuid from 'uuid/v4'

const uuids = [uuid(), uuid(), uuid(), uuid()]

export const videoQuizDefaultQuestionOptions = {
  [MULTIPLE_CHOICE]: [
    { label: '', value: uuids[0] },
    { label: '', value: uuids[1] },
    { label: '', value: uuids[2] },
    { label: '', value: uuids[3] },
  ],
}

export const videoQuizStimulusSupportedQtypes = [MULTIPLE_CHOICE]
