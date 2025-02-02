import { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import CreatePoll from './CreatePoll';
import 'bootstrap/dist/css/bootstrap.min.css';

function AdminDashboard() {
  const { user } = useAuth();
  const [polls, setPolls] = useState([]);

  useEffect(() => {
    fetchPolls();
  }, []);

  const fetchPolls = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get('http://localhost:5000/api/polls/active', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setPolls(Array.isArray(res.data) ? res.data : []);
    } catch (error) {
      console.error('Error fetching polls:', error);
      setPolls([]);
    }
  };

  const handleDelete = async (pollId) => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`http://localhost:5000/api/polls/${pollId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchPolls();
    } catch (error) {
      console.error('Error deleting poll:', error);
    }
  };

  return (
    <div className="container mt-4">
      <h1 className="text-center text-primary">Admin Dashboard</h1>
      <CreatePoll onPollCreated={fetchPolls} />
      <h2 className="mt-4">Active Polls</h2>
      {polls.length === 0 ? (
        <div className="alert alert-warning" role="alert">
          No active polls available.
        </div>
      ) : (
        <div className="row">
          {polls.map(poll => (
            <div key={poll.id} className="col-md-6 mb-3">
              <div className="card shadow-sm">
                <div className="card-body">
                  <h5 className="card-title text-dark">{poll.question}</h5>
                  <p className="text-muted">
                    <strong>Start:</strong> {new Date(poll.start_time).toLocaleString()}<br />
                    <strong>End:</strong> {new Date(poll.end_time).toLocaleString()}
                  </p>
                  <h6>Options:</h6>
                  <ul className="list-group mb-3">
                    {poll.options.map(option => (
                      <li key={option.id} className="list-group-item">
                        {option.option_text}
                      </li>
                    ))}
                  </ul>
                  <button className="btn btn-danger" onClick={() => handleDelete(poll.id)}>Delete Poll</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default AdminDashboard;
