import { useEffect, useState } from "react";
import PropTypes from 'prop-types';
import ScrollToBottom from "react-scroll-to-bottom";

function Chat({ socket, username, room }) {
  const [currentMessage, setCurrentMessage] = useState("");
  const [messageList, setMessageList] = useState([]);
  const [sentMessages, setSentMessages] = useState(new Set());

  // Props validation
  Chat.propTypes = {
    socket: PropTypes.object.isRequired,
    username: PropTypes.string.isRequired,
    room: PropTypes.string.isRequired,
  };

  useEffect(() => {
    // Load stored messages when component mounts
    const storedMessages = localStorage.getItem("messageList");
    if (storedMessages) {
      setMessageList(JSON.parse(storedMessages));
    }
  }, []);

  const sendMessage = async () => {
    if (currentMessage.trim() !== "" && !sentMessages.has(currentMessage)) {
      const currentTime = new Date().toISOString();
      const messageData = {
        room: room,
        author: username,
        message: currentMessage,
        time: currentTime,
      };
  
      await socket.emit("send_message", messageData);
      setCurrentMessage("");
  
      // Add the sent message to the Set to mark it as sent
      setSentMessages((prevSentMessages) => new Set(prevSentMessages.add(currentMessage)));
    }
  };

  useEffect(() => {
    const handleReceiveMessage = (data) => {
      setMessageList((prevMessages) => [...prevMessages, data]);
      // Store messages in localStorage
      localStorage.setItem("messageList", JSON.stringify([...messageList, data]));
    };

    socket.on("receive_message", handleReceiveMessage);

    return () => {
      socket.off("receive_message", handleReceiveMessage);
    };
  }, [socket, messageList]);
  

  return (
    <div className="chat-window">
      <div className="chat-header">
        <p>Live Chat</p>
      </div>
      <div className="chat-body">
        <ScrollToBottom className="message-container">
          {messageList.map((messageContent, index) => {
            return (
              <div
                className="message"
                key={index} // Use index as key since we don't have unique IDs for messages
                id={username === messageContent.author ? "you" : "other"}
              >
                <div>
                  <div className="message-content">
                    <p>{messageContent.message}</p>
                  </div>
                  <div className="message-meta">
                    <p id="time">{messageContent.time}</p>
                    <p id="author">{messageContent.author}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </ScrollToBottom>
      </div>
      <div className="chat-footer">
        <input
          type="text"
          value={currentMessage}
          placeholder="Hey..."
          onChange={(event) => setCurrentMessage(event.target.value)}
          onKeyPress={(event) => event.key === "Enter" && sendMessage()}
        />
        <button onClick={sendMessage}>&#9658;</button>
      </div>
    </div>
  );
}

export default Chat;
