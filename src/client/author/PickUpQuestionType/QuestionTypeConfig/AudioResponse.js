import { questionType, questionTitle } from '@edulastic/constants'
import WSAudioResponse from '../../src/assets/written-spoken/audio-response.svg'

export const audioResponseConfig = {
  type: 'edit',
  cardImage: WSAudioResponse,
  data: {
    title: questionTitle.AUDIO_RESPONSE,
    stimulus: '',
    type: questionType.AUDIO_RESPONSE,
    audioTimeLimitInMinutes: 5,
    validation: {
      validResponse: { score: 1 },
      maxScore: 1,
    },
    instructorStimulus: '',
  },
}
