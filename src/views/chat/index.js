import { h, Component } from 'preact';
import { bind } from 'decko';
var Stomp = require('stompjs/lib/stomp.js').Stomp;

export default class Chat extends Component {
  constructor(props) {
    super(props);

    this.userChatId = this.props.match.params.userChatId;
    this.rabbitClient = null;
    this.state = {
      messageList: []
    };
  }

  componentDidMount() {
    this.createRabbitConnection();
  }

  createRabbitConnection() {
    var ws = new WebSocket('ws://localhost:15674/ws');
    this.rabbitClient = Stomp.over(ws);

    this.rabbitClient.connect(
      'guest',
      'guest',
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
    this.subscribeToRabbitExchange('/exchange/chat-exchange');
  }

  @bind
  onRabbitConnectionError() {
    console.error('Error connecting');
  }

  @bind
  sendMessage(event) {
    this.rabbitClient.send(
      '/exchange/chat-exchange',
      { 'content-type': 'text/plain' },
      JSON.stringify({ userName: this.userChatId, content: 'Hello, World' })
    );
  }

  @bind
  renderMessageList() {
    {
      this.state.messageList.map(message => {
        return (
          <span>
            {message.userName}: {message.content}
          </span>
        );
      });
    }
  }

  render() {
    return (
      <div>
        <div class="flex flex-dc">{this.renderMessageList()}</div>
        <div>
          <textarea placeholder="Type your message" />
          <button onClick={this.sendMessage}>Send Mesage</button>
        </div>
      </div>
    );
  }
}
