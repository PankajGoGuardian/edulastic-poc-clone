/**
 * This class should be used as a base for defining a comm channel between an iframe and it's parent window
 * it uses the postMessage/onMesasge to send events from one to the other. It also has a scope that a developer can set
 * so an event wont be fired where it should not
 * This approach is decoupled, very flexible and because the iframe and the main window have two seperate event queues
 * it will be non blocking (as much as that is possible)
 */
class MessageController {
  constructor(scope) {
    this.scope = scope
    this.context = null
    this._onMessage = this._onMessage.bind(this)
  }

  call(method, args) {
    this.context.postMessage(
      {
        scope: this.scope,
        method,
        arguments: args || [],
      },
      window.location
    )
    // console.log("parent side...")
  }

  _onMessage(msg) {
    if (msg.data.scope === this.scope) return

    if (msg.data.method in this) {
      // eslint-disable-next-line prefer-spread
      this[msg.data.method].apply(this, msg.data.arguments)
    }
  }

  connect(context = window) {
    this.context = context
    this.context.addEventListener('message', this._onMessage)
  }

  disconnect() {
    this.context.removeEventListener('message', this._onMessage)
    this.context = null
  }
}

export default MessageController
