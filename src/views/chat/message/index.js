import { h } from 'preact';

export default function Message({ message }) {
  return (
    <span>
      <strong>{message.userName}</strong>: {message.content}
    </span>
  );
}
