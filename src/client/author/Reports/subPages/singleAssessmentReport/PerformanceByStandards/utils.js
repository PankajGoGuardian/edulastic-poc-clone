export const AI_CHAT_ROLES = {
  SYSTEM: 'system',
  USER: 'user',
  ASSISTANT: 'assistant',
}

export const DEFAULT_QUESTIONS_TEXT = [
  '1. Which classes are struggling the most, and in what areas?',
  '2. How can I compare the performance of different classes across the same standards?',
  '3. What does a low percentage in a specific standard indicate about student understanding?',
  '4. What does a low percentage in a specific standard indicate about student understanding?',
].join('\n')

const defaultUserMessagePrefix =
  'Give a JSON response with the following keys and data:\n1. key is "response" and data is answer for "'

const defaultUserMessage = 'Provide 3 key actionable insights for improvement.'

const defaultUserMessageSuffix =
  ' Limit to 50 words"\n2. key is "followup" and data is answer for "Provide 3 followup questions separated by new line"'

const getDefaultSystemMessage = (csvData) => {
  const commonDataMessage = `
    Performance by Standards Report displays overall performance of the standards assessed for a single assessment.
    You can further analyze the data by domain, standard, and student levels.
  `
  const csvDataMessage = `This is CSV data for Performance by Standards Report:\n${csvData.toString()}`
  return `${commonDataMessage}\n${csvDataMessage}`
}

export const getUserMessage = (userMessage = defaultUserMessage) => {
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
      const parsedContent = JSON.parse(message.content)
      Object.assign(newMessage, {
        chatText: parsedContent.response,
        questionsText: parsedContent.followup,
      })
    }
    return newMessage
  })
}

export const getDefaultAiMessages = (csvData) => {
  const systemMessageObj = {
    role: AI_CHAT_ROLES.SYSTEM,
    content: getDefaultSystemMessage(csvData),
  }
  const userMessageObj = {
    role: AI_CHAT_ROLES.USER,
    content: getUserMessage(defaultUserMessage),
  }
  const messages = [systemMessageObj, userMessageObj]
  const parsedMessages = getParsedMessages(messages)
  return parsedMessages
}
