import API from '@edulastic/api/src/utils/API'

const api = new API()
const prefix = '/prompt'

const getAIResponse = (messages) => {
  return [
    {
      role: 'system',
      content:
        '\n    Performance by Standards Report displays overall performance of the standards assessed for a single assessment.\n    You can further analyze the data by domain, standard, and student levels.\n  \nThis is CSV data for Performance by Standards Report:\nSchool,Avg. standard Performance,K.CC.A.1 (Points - 5) (0%),K.CC.A.3 (Points - 1) (100%),K.CC.B.4 (Points - 3) (0%),K.CC.B.5 (Points - 1) (100%),K.CC.C.6 (Points - 2) (50%),K.CC.C.7 (Points - 1) (0%),K.OA.A.1 (Points - 1) (100%),K.OA.A.2 (Points - 1) (0%),K.OA.A.3 (Points - 1) (0%),K.OA.A.5 (Points - 1) (0%),K.MD.A.1 (Points - 1) (0%),K.MD.A.2 (Points - 1) (0%),K.MD.B.3 (Points - 3) (0%),K.G.A.1 (Points - 1) (0%),K.G.B.4 (Points - 1) (0%),school1(2022-2023),25%,0%,100%,0%,100%,50%,0%,100%,0%,0%,0%,0%,0%,0%,0%,0%',
    },
    {
      role: 'user',
      content:
        'Give a JSON response with the following keys and data:\n1. key is "response" and data is answer for "Provide 3 key actionable insights for improvement. Limit to 50 words"\n2. key is "followup" and data is answer for "Provide 3 followup questions separated by new line"',
    },
    {
      role: 'assistant',
      content:
        '{\n  "response": "Provide more support and practice for standards K.CC.B.4, K.MD.B.3, and K.G.A.1. Focus on strategies to improve student performance in these areas.",\n  "followup": "1. What specific strategies can be implemented to support standards K.CC.B.4, K.MD.B.3, and K.G.A.1?\\n2. Are there any resources or materials available to help address these standards?\\n3. How can we assess student progress and provide timely feedback for improvement in these areas?"\n}',
    },
  ]

  // return api
  //   .callApi({
  //     url: `${prefix}/getResponse`,
  //     method: 'POST',
  //     data: { messages },
  //     useSlowApi: true,
  //   })
  //   .then(({ data }) => data?.result)
}

export default {
  getAIResponse,
}
