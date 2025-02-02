import { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

function UserDashboard() {
  const { user } = useAuth();
  const [polls, setPolls] = useState([]);
  const [selectedOption, setSelectedOption] = useState({});
  const [results, setResults] = useState({});

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
      setPolls(res.data); // Set the polls state
    } catch (error) {
      console.error('Error fetching polls:', error);
    }
  };

  const handleVote = async (pollId) => {
    try {
      const token = localStorage.getItem('token');
      await axios.post(
        'http://localhost:5000/api/polls/vote',
        { pollId, optionId: selectedOption[pollId] },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchResults(pollId); // Fetch updated results after voting
    } catch (error) {
      console.error('Error voting:', error);
    }
  };

  const fetchResults = async (pollId) => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get(`http://localhost:5000/api/polls/results/${pollId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setResults(prev => ({ ...prev, [pollId]: res.data }));
    } catch (error) {
      console.error('Error fetching results:', error);
    }
  };

  return (
    <div>
      <h1>User Dashboard</h1>
      {polls.length === 0 ? (
        <p>No active polls available.</p>
      ) : (
        polls.map(poll => (
          <div key={poll.id} style={{ border: '1px solid #ccc', padding: '10px', margin: '10px' }}>
            <h3>{poll.question}</h3>
            <p>Start Time: {new Date(poll.start_time).toLocaleString()}</p>
            <p>End Time: {new Date(poll.end_time).toLocaleString()}</p>
            <h4>Options:</h4>
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
            <h4>Results:</h4>
            {results[poll.id]?.map(result => (
              <p key={result.option_text}>
                {result.option_text}: {result.vote_count} votes
              </p>
            ))}
          </div>
        ))
      )}
    </div>
  );
}

export default UserDashboard;