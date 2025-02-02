import { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import CreatePoll from './CreatePoll';

function AdminDashboard() {
  const { user } = useAuth();
  const [polls, setPolls] = useState([]); // Initialize as an empty array

  useEffect(() => {
    fetchPolls();
  }, []);

  const fetchPolls = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get('http://localhost:5000/api/polls/active', {
        headers: { Authorization: `Bearer ${token}` }
      });
      console.log('Fetched Polls:', res.data); // Log the response

      // Check if the response is an array before setting the state
      if (Array.isArray(res.data)) {
        setPolls(res.data); // Set the polls state if it's an array
      } else {
        console.error('Polls data is not an array:', res.data);
        setPolls([]); // Fallback to an empty array if the data is not an array
      }
    } catch (error) {
      console.error('Error fetching polls:', error);
      setPolls([]); // Fallback in case of an error
    }
  };

  const handleDelete = async (pollId) => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`http://localhost:5000/api/polls/${pollId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchPolls(); // Refresh the list after deletion
    } catch (error) {
      console.error('Error deleting poll:', error);
    }
  };

  return (
    <div>
      <h1>Admin Dashboard</h1>
      <CreatePoll onPollCreated={fetchPolls} />
      <h2>Active Polls</h2>
      {polls.length === 0 ? (
        <p>No active polls available.</p>
      ) : (
        polls.map(poll => (
          <div key={poll.id} style={{ border: '1px solid #ccc', padding: '10px', margin: '10px' }}>
            <h3>{poll.question}</h3>
            <p>Start Time: {new Date(poll.start_time).toLocaleString()}</p>
            <p>End Time: {new Date(poll.end_time).toLocaleString()}</p>
            <h4>Options:</h4>
            <ul>
              {poll.options.map(option => (
                <li key={option.id}>{option.option_text}</li>
              ))}
            </ul>
            <button onClick={() => handleDelete(poll.id)}>Delete Poll</button>
          </div>
        ))
      )}
    </div>
  );
}

export default AdminDashboard;
