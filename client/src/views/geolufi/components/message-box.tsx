import { Message } from '../types';

interface MessageBoxProps {
  message: Message
}

function MessageBox({ message }: MessageBoxProps) {
  return (
    <div className={`message-box message-box--${message.variant}`}>
      <div className="message-box__inner">
        {message.text}
      </div>
    </div>
  );
}

export { MessageBox };
