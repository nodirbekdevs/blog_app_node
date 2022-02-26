let { messages } = require('./messages.json')
let { error_messages } = require('./error_messages.json')

export function message(message: string, lang: string) {
    if (messages.hasOwnProperty(message)) {
        return messages[message][lang]
    }
    return message
}

export function error_message(message: string, lang: string) {
    return error_messages[message][lang] || message
}
