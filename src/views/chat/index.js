import { h, Component } from 'preact';
import { bind } from 'decko';
var Stomp = require('stompjs/lib/stomp.js').Stomp;

export default class Chat extends Component {
  constructor(props) {
    super(props);

    this.userChatId = this.props.match.params.userChatId;

    this.rabbitClient = null;
  }

  componentDidMount() {
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

  @bind
  onRabbitConnect() {
    console.log('Connected');
    this.rabbitClient.subscribe('/exchange/chat-exchange', function(d) {
      console.log(JSON.parse(d.body));
    });
  }

  @bind
  onRabbitConnectionError() {
    console.warn('Error connecting');
  }

  @bind
  sendMessage(event) {
    this.rabbitClient.send(
      '/exchange/chat-exchange',
      { 'content-type': 'text/plain' },
      JSON.stringify({ userName: this.userChatId, message: 'Hello, World' })
    );
  }

  render() {
    return (
      <div>
        <div class="flex flex-dc">
          <span>{this.userChatId}: Message 1</span>
          <span>{this.userChatId}: Message 2</span>
        </div>
        <div>
          <textarea placeholder="Type your message" />
          <button onClick={this.sendMessage}>Send Mesage</button>
        </div>
      </div>
    );
  }
}
