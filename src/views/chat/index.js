import { h, Component } from 'preact';

export default class Chat extends Component {
  constructor(props) {
    super(props);

    this.userChatId = this.props.match.params.userChatId;
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
          <button>Send Mesage</button>
        </div>
      </div>
    );
  }
}
