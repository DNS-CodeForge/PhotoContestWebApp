import { useState, useEffect } from 'react';
import ContestList from './components/ContestList'; // Import the ContestList component
import './App.css';

const BACKEND_BASE_URL = import.meta.env.VITE_BACKEND_URL;

function App() {
  const [contests, setContests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchContests = async () => {
      try {
        const response = await fetch(`${BACKEND_BASE_URL}api/contest`);
        if (!response.ok) {
          throw new Error('Failed to fetch contests');
        }
        const responseJson = await response.json();
        console.log(responseJson.data.pagination);
        setContests(Array.isArray(responseJson.data.contests) ? responseJson.data.contests : []);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchContests();
  }, []);

  if (loading) {
    return <div>Loading contests...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (contests.length === 0) {
    return <div>No contests available at the moment.</div>;
  }

  return (
      <div>
        <ContestList contests={contests} />
      </div>
  );
}

export default App;
