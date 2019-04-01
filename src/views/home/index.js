import { h, Component } from 'preact';
import { bind } from 'decko';

import style from './styles.scss';

export default class Home extends Component {
  constructor(props) {
    super(props);

    this.state = {
      userName: null
    };
  }

  @bind
  openNewChatWindow(event) {
    event.preventDefault();

    if (!this.state.userName) {
      window.alert('You must provide a username');
    } else {
      window.open(
        `http://localhost:8081/${this.state.userName}`,
        `Chat | ${this.state.userName}`,
        'height=400,width=500'
      );
    }
  }

  @bind
  onUserNameInputChange(event) {
    const userName = event.target.value.toLowerCase();
    this.setState({ userName });
  }

  render({}, { userName }) {
    return (
      <div class={`flex flex-full-center ${style.homeWrapper}`}>
        <div class="flex flex-dc flex-full-center">
          <form onSubmit={this.openNewChatWindow}>
            <input
              type="text"
              placeholder="Type your username"
              onInput={this.onUserNameInputChange}
            />
            <button type="submit" onClick={this.openNewChatWindow}>
              Open new chat window
            </button>
          </form>
        </div>
      </div>
    );
  }
}
