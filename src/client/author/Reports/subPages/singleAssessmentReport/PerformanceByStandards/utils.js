export const obfuscatePIIData = (csvData) => {
  // code to obfuscate first column data
  const mapping = {}
  return [csvData, mapping]
}

export const elucidatePIIData = (text, mapping) => {
  // find and replace words in text by mapping
  // requires more thought, hence, not implemented
  return text
}

export const AI_CHAT_ROLES = {
  SYSTEM: 'system',
  USER: 'user',
  ASSISTANT: 'assistant',
}

export const DEFAULT_QUESTIONS_TEXT = [
  '1. Provide 3 key actionable insights for improvement?',
  '2. Which classes are struggling the most, and in what areas?',
  '3. How can I compare the performance of different classes across the same standards?',
  '4. What does a low percentage in a specific standard indicate about student understanding?',
].join('\n')

const defaultUserMessagePrefix =
  'Give a JSON response with the following keys and data:\n1. key is "response" and data is answer for "'

const defaultUserMessageSuffix =
  ' Limit to 50 words"\n2. key is "followup" and data is answer for "Provide 3 followup questions relevant to the CSV data. Separate each with a new line character and limit to 20 words."\n Make sure the response is a valid JSON.'

const getDefaultSystemMessage = ({ compareBy, viewBy }, csvData) => {
  const commonDataMessage = `
    Performance by Standards Report displays overall performance of the standards assessed for a single assessment.
    You can further analyze the data by domain, standard, and student levels.
  `
  const csvDataMessage = `This is CSV data for Performance by Standards Report:\n${csvData.toString()}`
  const metaDataMessage = `First row contains the headers for the CSV. First column represents ${compareBy}. Second column shows data on "Avg. ${viewBy} Performance" which is the average performance across all the ${viewBy}s assessed. Rest of the columns are ${viewBy} columns.`
  return `${commonDataMessage}\n${csvDataMessage}\n\n${metaDataMessage}`
}

const getDefaultUserMessage = () => {
  const summaryUserMessage = `${defaultUserMessagePrefix}Summarize the CSV data. Limit to 100 words"`
  return summaryUserMessage
}

export const getUserMessage = (userMessage) => {
  return `${defaultUserMessagePrefix}${userMessage}${defaultUserMessageSuffix}`
}

export const getParsedMessages = (messages) => {
  return messages.map((message) => {
    const newMessage = { ...message, chatText: message.content }
    if (message.role === AI_CHAT_ROLES.USER) {
      const chatText = message.content.slice(
        defaultUserMessagePrefix.length,
        -defaultUserMessageSuffix.length
      )
      Object.assign(newMessage, { chatText })
    }
    if (message.role === AI_CHAT_ROLES.ASSISTANT) {
      let parsedContent = {}
      try {
        parsedContent = JSON.parse(message.content)
      } catch (error) {
        const responseSearchString = '"response":'
        const responseIndex =
          message.content.match(responseSearchString).index || 0

        const followupSearchString = '"followup":'
        const followupIndex =
          message.content.match(followupSearchString).index || 0

        const responseIndexEnd = followupIndex || message.content.length

        const ct = responseIndex
          ? message.content.slice(
              responseIndex + responseSearchString.length,
              responseIndexEnd
            )
          : ''
        const qt = followupIndex
          ? message.content.slice(followupIndex + followupSearchString.length)
          : ''

        Object.assign(parsedContent, {
          response: ct.split('"')[1] || '',
          followup: qt.split('"')[1] || '',
        })
      }
      Object.assign(newMessage, {
        chatText: parsedContent.response,
        questionsText: parsedContent.followup,
      })
    }
    return newMessage
  })
}

export const getDefaultAiMessages = (filters, csvData) => {
  const systemMessageObj = {
    role: AI_CHAT_ROLES.SYSTEM,
    content: getDefaultSystemMessage(filters, csvData),
  }
  const userMessageObj = {
    role: AI_CHAT_ROLES.USER,
    content: getDefaultUserMessage(),
  }
  const messages = [systemMessageObj, userMessageObj]
  const parsedMessages = getParsedMessages(messages)
  return parsedMessages
}
