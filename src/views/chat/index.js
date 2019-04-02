import { h, Component } from 'preact';
import { bind } from 'decko';
import Ink from 'react-ink';
import {
  rabbitSocketUri,
  rabbitConnectionCredentials,
  rabbitConnectionExchange
} from '../../scripts/vars';

var Stomp = require('stompjs/lib/stomp.js').Stomp;

import Message from './message';

import style from './styles.scss';

export default class Chat extends Component {
  constructor(props) {
    super(props);

    this.userChatId = this.props.match.params.userChatId;
    this.rabbitClient = null;
    this.state = {
      messageList: [],
      userMessage: null
    };
  }

  componentDidMount() {
    this.createRabbitConnection();
  }

  createRabbitConnection() {
    var ws = new WebSocket(rabbitSocketUri);
    this.rabbitClient = Stomp.over(ws);

    this.rabbitClient.connect(
      rabbitConnectionCredentials.username,
      rabbitConnectionCredentials.password,
      this.onRabbitConnect,
      this.onRabbitConnectionError,
      '/'
    );
  }

  subscribeToRabbitExchange(exchangeName) {
    this.rabbitClient.subscribe(exchangeName, response => {
      const newMessage = JSON.parse(response.body);

      const newMessageArray = [...this.state.messageList];
      newMessageArray.push(newMessage);
      this.setState({ messageList: newMessageArray });
    });
  }

  @bind
  onRabbitConnect() {
    this.subscribeToRabbitExchange(rabbitConnectionExchange);
  }

  @bind
  onRabbitConnectionError() {
    console.error('Error connecting');
  }

  @bind
  sendMessage(event) {
    event.preventDefault();

    const data = {
      userName: this.userChatId,
      content: this.state.userMessage
    };

    if (!data.content) {
      window.alert('You must write a message');
    } else {
      this.rabbitClient.send(
        rabbitConnectionExchange,
        { 'content-type': 'text/plain' },
        JSON.stringify(data)
      );
    }
  }

  @bind
  renderMessageList() {
    return this.state.messageList.map(message => <Message message={message} />);
  }

  @bind
  onUserMessageInput(event) {
    const newMessge = event.target.value;

    this.setState({ userMessage: newMessge });
  }

  // Can be further refactored into components but it's already 1:29am
  render() {
    return (
      <div class={`flex flex-dc ${style.chatWrapper}`}>
        <div class={`flex flex-full-center ${style.userIdBadge}`}>
          User ID: {this.userChatId}
        </div>
        <div class={`flex flex-dc ${style.messagesWrapper}`}>
          {this.renderMessageList()}
        </div>
        <form
          onSubmit={this.sendMessage}
          class={`flex ${style.userActionWrapper}`}
        >
          <textarea
            onInput={this.onUserMessageInput}
            placeholder="Type your message..."
          />
          <button onClick={this.sendMessage}>
            <Ink />
            Send Mesage
          </button>
        </form>
      </div>
    );
  }
}
