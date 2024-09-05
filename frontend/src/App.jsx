import { useState, useEffect } from 'react';

const BACKEND_BASE_URL = import.meta.env.VITE_BACKEND_URL; // Ensure this is correctly set in .env

function App() {
  const [contests, setContests] = useState([]); // Store contest data
  const [loading, setLoading] = useState(true); // Loading state to indicate data is being fetched
  const [error, setError] = useState(null); // Error state for any issues

  useEffect(() => {
    const fetchContests = async () => {
      try {
        const response = await fetch(`${BACKEND_BASE_URL}api/contest`); // Ensure correct URL
        if (!response.ok) {
          throw new Error('Failed to fetch contests');
        }
        const data = await response.json();
        
        // Assuming the API response structure is { data: [...] }
        setContests(Array.isArray(data.data.contests) ? data.data.contests : []); // Ensure contests is an array
      } catch (error) {
        setError(error.message); // Handle any errors
      } finally {
        setLoading(false); // Stop loading once data is fetched or an error occurs
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
