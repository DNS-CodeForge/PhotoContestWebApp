import { useState, useEffect } from 'react';

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
    console.log(contests)
    return <div>No contests available at the moment.</div>;

  }
  
  

  return (
    <div>
      <h2>Contests</h2>
      <ul>
        {contests.map((contest) => (
          <li key={contest.id}>
            <strong>Title:</strong> {contest.title} <br />
            <strong>Category:</strong> {contest.category}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
