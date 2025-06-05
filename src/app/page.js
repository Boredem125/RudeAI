'use client';
import { useState, useRef } from 'react';

export default function Home() {
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: "Can't even do this on your own? Fine incapable human, I am your savior 😂",
      backgroundColor: 'white',
      color: '#000',
      avatar: 'https://robohash.org/example?set=set4',
    },
  ]);

  const [message, setMessage] = useState('');
  const messageRef = useRef(null);

  const sendMessage = async () => {
    if (!message.trim()) return;

    setMessages((messages) => [
      ...messages,
      {
        role: 'user',
        content: message,
        backgroundColor: '#75bbfd',
        color: '#000',
        avatar: 'https://api.dicebear.com/9.x/pixel-art/svg?seed=Jane',
      },
      {
        role: 'assistant',
        content: '',
        avatar: 'https://api.dicebear.com/9.x/bottts/png',
        backgroundColor: 'white',
        color: '#000',
      },
    ]);
    setMessage('');

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify([...messages, { role: 'user', content: message }]),
      });

      if (!response.ok) throw new Error('Network response was not ok');

      const reader = response.body.getReader();
      const decoder = new TextDecoder();

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        const text = decoder.decode(value, { stream: true });

        setMessages((messages) => {
          let last = messages[messages.length - 1];
          return [...messages.slice(0, -1), { ...last, content: last.content + text }];
        });
      }
    } catch (error) {
      setMessages((messages) => [
        ...messages,
        {
          role: 'assistant',
          content: "I'm sorry, I encountered an error. Try again later.",
          backgroundColor: '#1976D2',
          color: '#fff',
          avatar: 'https://robohash.org/example?set=set4',
        },
      ]);
    }
  };

  const endChat = () => {
    setMessages([
      {
        role: 'assistant',
        content: 'This conversation is over. Farewell, simpleton. 😂',
        backgroundColor: '#1976D2',
        color: '#fff',
        avatar: 'https://api.dicebear.com/9.x/pixel-art/svg?seed=Jane',
      },
    ]);
  };

  const handleKeyDown = (event) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      sendMessage();
    }
  };

  return (
    <div style={{ width: '100vw', height: '100vh', backgroundColor: '#000', color: 'red', padding: 20, display: 'flex', flexDirection: 'column' }}>
      <h1 style={{ textAlign: 'center', fontSize: '2rem', color: 'red' }}>RudeAI</h1>

      <div style={{ flexGrow: 1, overflowY: 'auto', border: '1px solid white', padding: 16, borderRadius: 12 }}>
        {messages.map((msg, idx) => (
          <div key={idx} style={{
            display: 'flex',
            flexDirection: msg.role === 'assistant' ? 'row' : 'row-reverse',
            alignItems: 'flex-end',
            marginBottom: 16,
          }}>
            <img src={msg.avatar} alt="avatar" width={50} height={50} style={{ borderRadius: '50%' }} />
            <div style={{
              backgroundColor: msg.backgroundColor,
              color: msg.color,
              padding: '12px 16px',
              borderRadius: 12,
              marginLeft: msg.role === 'assistant' ? 8 : 0,
              marginRight: msg.role === 'user' ? 8 : 0,
              maxWidth: '70%',
            }}>
              {msg.content}
            </div>
          </div>
        ))}
      </div>

      <div style={{ display: 'flex', gap: 12, marginTop: 20 }}>
        <input
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Your Message"
          style={{ flexGrow: 1, padding: 12, borderRadius: 8 }}
        />
        <button onClick={sendMessage} style={{ padding: '12px 16px' }}>SEND</button>
        <button onClick={endChat} style={{ padding: '12px 16px', backgroundColor: 'red', color: 'white' }}>END CHAT</button>
      </div>
    </div>
  );
}
