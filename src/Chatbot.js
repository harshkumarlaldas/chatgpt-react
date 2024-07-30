// src/Chatbot.js
import React, { useState } from 'react';
import axios from 'axios';

const Chatbot = () => {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (input.trim() === '') return;

    const newMessage = { sender: 'user', text: input };
    setMessages([...messages, newMessage]);

    try {
        const response = await axios.post('https://api.openai.com/v1/chat/completions', {
            model: 'gpt-3.5-turbo', //POST https://api.openai.com/v1/engines/davinci-codex/completions 401 (Unauthorized)
            messages: [{ role: 'user', content: input }],
            max_tokens: 150,
            n: 1,
            stop: null,
            temperature: 0.7,
          }, {
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer <PLACE KEY HERE FROM  {https://platform.openai.com/account/api-keys}>`,
            }
          });

      const botMessage = { sender: 'bot', text: response.data.choices[0].text.trim() };
      setMessages([...messages, newMessage, botMessage]);
    } catch (error) {
      console.error('Error fetching response from OpenAI:', error);
    }

    setInput('');
  };

  return (
    <div>
      <div className="chat-window">
        {messages.map((message, index) => (
          <div key={index} className={`message ${message.sender}`}>
            {message.text}
          </div>
        ))}
      </div>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type your message..."
        />
        <button type="submit">Send</button>
      </form>
    </div>
  );
};

export default Chatbot;
