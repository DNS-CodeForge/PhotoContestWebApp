import { useState, useEffect } from 'react';
import Modal from './components/Modal/Modal';
import './App.css';

const BACKEND_BASE_URL = import.meta.env.VITE_BACKEND_URL;

function App() {
  const [contests, setContests] = useState([]);
  const [loading, setLoading] = useState(true); 
  const [error, setError] = useState(null);
  const [isModalOpen, setModalOpen] = useState(false);

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
    return <div>No contests available at the moment.</div>;
  }

  const openModal = () => {
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
  };
  
  return (
    <div>
      <button className="open-modal-btn" onClick={openModal}>Show Posts</button>

      {isModalOpen && (
        <Modal onClose={closeModal}>
          <h2>Contests</h2>
          <ul style={{ listStyle: 'none' }}>
            {contests.map((contest) => (
              <li key={contest.id}>
                <strong>Title:</strong> {contest.title} <br />
                <strong>Category:</strong> {contest.category}
              </li>
            ))}
          </ul>
          <button className="close-modal-btn" onClick={closeModal}>Close</button>
        </Modal>
      )}
    </div>
  );
}

export default App;
