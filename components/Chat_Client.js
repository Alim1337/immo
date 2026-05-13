import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";

const ChatClient = () => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const router = useRouter();
  const { negotiationId, clientID, proprietaireId } = router.query;

  useEffect(() => {
    if (negotiationId) {
      fetchMessages();
    }
  }, [negotiationId]);

  const fetchMessages = async () => {
    try {
      const response = await fetch(`/api/api_messages_modul?negotiationId=${negotiationId}`);
      const data = await response.json();
      setMessages(data);
    } catch (error) {
      console.log(error);
    }
  };

  const sendMessage = async () => {
    try {
      const response = await fetch("/api/api_messages_modul", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          negotiationId,
          content: newMessage,
        }),
      });

      const data = await response.json();
      setMessages([...messages, data]);
      setNewMessage("");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="flex-1 p-2 sm:p-6 justify-between flex flex-col h-screen bg-gray-400">
      {/* Header */}
      <div className="flex sm:items-center justify-between py-3 border-b-2 border-gray-200">
        {/* Header content */}
      </div>

      {/* Messages */}
      <div
        id="messages"
        className="flex flex-col space-y-4 p-3 overflow-y-auto scrollbar-thumb-blue scrollbar-thumb-rounded scrollbar-track-blue-lighter scrollbar-w-2 scrolling-touch"
      >
        {messages.map((message) => (
          <div
            className={`chat-message ${
              message.sender_id === parseInt(clientID) ? "client-message" : "proprietor-message"
            }`}
            key={message.id_message}
          >
            {/* Message content */}
            {message.content}
          </div>
        ))}
      </div>

      {/* Message input */}
      <div className="border-t-2 border-gray-200 px-4 pt-4 mb-2 sm:mb-0">
        <div className="relative flex">
          <input
            type="text"
            placeholder="Write your message!"
            className="w-full focus:outline-none focus:placeholder-gray-400 text-gray-600 placeholder-gray-600 pl-12 bg-gray-200 rounded-md py-3"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
          />
          <div className="absolute right-0 items-center inset-y-0 hidden sm:flex">
            <button
              type="button"
              className="inline-flex items-center justify-center rounded-full h-10 w-10 transition duration-500 ease-in-out text-gray-500 hover:bg-gray-300 focus:outline-none"
              onClick={sendMessage}
            >
              {/* Send button content */}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatClient;
