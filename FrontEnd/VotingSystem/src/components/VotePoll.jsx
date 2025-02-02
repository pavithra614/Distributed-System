import { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

function VotePoll() {
  const { user } = useAuth();
  const [polls, setPolls] = useState([]);
  const [selectedOption, setSelectedOption] = useState({});
  const token = localStorage.getItem('token'); // Get token

  useEffect(() => {
    const fetchPolls = async () => {
      if (!token) {
        console.error("No token found, user not authenticated.");
        return;
      }

      try {
        const res = await axios.get('http://localhost:5000/api/polls/active', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setPolls(res.data);
      } catch (error) {
        console.error("Error fetching polls:", error.response?.data || error.message);
      }
    };

    fetchPolls();
  }, [token]);

  const handleVote = async (pollId) => {
    if (!token) {
      alert("You must be logged in to vote.");
      return;
    }

    try {
      await axios.post('http://localhost:5000/api/polls/vote', {
        pollId,
        optionId: selectedOption[pollId]
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      alert('Vote recorded successfully!');
    } catch (error) {
      console.error("Error voting:", error.response?.data || error.message);
      alert('Failed to vote. Please try again.');
    }
  };

  return (
    <div>
      <h1>Active Polls</h1>
      {polls.length === 0 && <p>No active polls available.</p>}
      {polls.map(poll => (
        <div key={poll.id} style={{ border: '1px solid #ccc', padding: '10px', margin: '10px' }}>
          <h3>{poll.question}</h3>
          <p>Start Time: {new Date(poll.start_time).toLocaleString()}</p>
          <p>End Time: {new Date(poll.end_time).toLocaleString()}</p>
          {poll.options.map(option => (
            <div key={option.id}>
              <input
                type="radio"
                name={`poll-${poll.id}`}
                value={option.id}
                onChange={() => setSelectedOption({ ...selectedOption, [poll.id]: option.id })}
              />
              {option.option_text}
            </div>
          ))}
          <button onClick={() => handleVote(poll.id)}>Vote</button>
        </div>
      ))}
    </div>
  );
}

export default VotePoll;
