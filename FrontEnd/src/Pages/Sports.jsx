import React, { useState } from 'react';
import axios from 'axios';

const Sports = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [file, setFile] = useState(null);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Prepare form data to send to backend
    const formData = new FormData();
    formData.append('name', name);
    formData.append('email', email);
    formData.append('file', file);
    console.log(formData);
    try {
      // Send POST request to backend endpoint
      const response = await axios.post('http://localhost:3000/tables/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      console.log(response.data); // Log server response
    } catch (error) {
      console.error('Error uploading file:', error);
    }
  };

  return (
    <div>
      <h2>Upload Form</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Name:</label>
          <input type="text" value={name} onChange={(e) => setName(e.target.value)} required />
        </div>
        <div>
          <label>Email:</label>
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        </div>
        <div>
          <label>Upload File:</label>
          <input type="file" onChange={handleFileChange} required />
        </div>
        <button type="submit">Submit</button>
      </form>
    </div>
  );
};

export default Sports;
