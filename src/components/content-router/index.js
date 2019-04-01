import { h } from 'preact';
import { BrowserRouter, Switch, Route } from 'react-router-dom';

import Home from '../../views/home';
import Chat from '../../views/chat';

export default function ContentRouter() {
  return (
    <BrowserRouter>
      <Switch>
        <Route exact path="/" component={Home} />
        <Route exact path="/:userChatId" component={Chat} />
      </Switch>
    </BrowserRouter>
  );
}
