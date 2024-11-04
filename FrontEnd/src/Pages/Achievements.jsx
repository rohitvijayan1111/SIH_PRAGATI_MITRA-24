import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Achievements = () => {
  const [documents, setDocuments] = useState([]);

  useEffect(() => {
    const fetchDocuments = async () => {
      try {
        const response = await axios.get('http://localhost:3000/tables/files');
        setDocuments(response.data);
      } catch (error) {
        console.error('Error fetching documents:', error);
      }
    };

    fetchDocuments();
  }, []);

  return (
    <div>
      <h2>Uploaded Documents</h2>
      <ul>
        {documents.map((document, index) => (
          <li key={index}>
            {document}
            <a
              href={`http://localhost:3000/uploads/${encodeURIComponent(document)}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              View Document
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Achievements;
