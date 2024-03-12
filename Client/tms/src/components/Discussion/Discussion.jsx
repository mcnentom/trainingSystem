import React, { useState, useEffect } from 'react';
import axios from 'axios'; 

const DiscussionForum = () => {
  const [content, setContent] = useState('');
  const [discussions, setDiscussions] = useState([]);

  useEffect(() => {
    // Fetch discussions when component mounts
    fetchDiscussions();

    // Establish WebSocket connection
    const socket = new WebSocket('http://localhost:3000');

    // Listen for new discussions
    socket.onmessage = (event) => {
      const newDiscussion = JSON.parse(event.data);
      setDiscussions((prevDiscussions) => [newDiscussion, ...prevDiscussions]);
    };

    // Cleanup function to close the WebSocket connection
    return () => {
      socket.close();
    };
  }, []);

  const fetchDiscussions = async () => {
    try {
      const response = await axios.get('http://localhost:3000/userActions/discussions');
      setDiscussions(response.data);
    } catch (error) {
      console.error('Error fetching discussions:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('/api/discussions', { content });
      setDiscussions([...discussions, response.data]);
      setContent('');
    } catch (error) {
      console.error('Error posting discussion:', error);
    }
  };

  return (
    <div>
      <h1>Discussion Forum</h1>
      <form onSubmit={handleSubmit}>
        <textarea value={content} onChange={(e) => setContent(e.target.value)} />
        <button type="submit">Post Discussion</button>
      </form>
      <div>
        <h2>Recent Discussions</h2>
        <ul>
          {discussions.map((discussion) => (
            <li key={discussion.discussion_id}>{discussion.content}</li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default DiscussionForum;
