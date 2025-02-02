import { useState } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

function CreatePoll() {
  const { user } = useAuth();
  const [question, setQuestion] = useState('');
  const [options, setOptions] = useState(['', '']);
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [error, setError] = useState(''); // For error messages

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(''); // Clear previous errors

    const token = localStorage.getItem('token');
    if (!token) {
      alert('Please log in to create a poll');
      return;
    }

    // Validate options to ensure there are at least two options
    const validOptions = options.filter(opt => opt.trim() !== '');
    if (validOptions.length < 2) {
      alert('Please provide at least two options.');
      return;
    }

    // Validate start time and end time
    if (new Date(startTime) >= new Date(endTime)) {
      alert('Start time must be before end time.');
      return;
    }

    try {
      const res = await axios.post(
        'http://localhost:5000/api/polls',
        {
          question,
          options: validOptions,
          startTime,
          endTime,
          adminId: user.id,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      // Check if the response is successful
      if (res.data.success) {
        alert('Poll created successfully!');
        setQuestion('');
        setOptions(['', '']);
        setStartTime('');
        setEndTime('');
      } else {
        setError(res.data.message || 'Failed to create poll.');
      }
    } catch (error) {
      console.error(error);
      setError(error.response?.data?.message || 'Failed to create poll. Please try again.');
    }
  };

  return (
    <div>
      <h1>Create New Poll</h1>
      {error && <p style={{ color: 'red' }}>{error}</p>} {/* Display error message */}
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Poll question"
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          required
        />
        {options.map((option, index) => (
          <input
            key={index}
            type="text"
            placeholder={`Option ${index + 1}`}
            value={option}
            onChange={(e) => {
              const newOptions = [...options];
              newOptions[index] = e.target.value;
              setOptions(newOptions);
            }}
            required
          />
        ))}
        <button type="button" onClick={() => setOptions([...options, ''])}>
          Add Option
        </button>
        <input
          type="datetime-local"
          value={startTime}
          onChange={(e) => setStartTime(e.target.value)}
          required
        />
        <input
          type="datetime-local"
          value={endTime}
          onChange={(e) => setEndTime(e.target.value)}
          required
        />
        <button type="submit">Create Poll</button>
      </form>
    </div>
  );
}

export default CreatePoll;
