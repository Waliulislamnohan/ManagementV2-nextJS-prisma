import Head from 'next/head';
import styles from '../styles/Home.module.css';
import React, { useState,useEffect } from 'react';

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


export default function Home() {
  const [upazilaName, setUpazilaName] = useState('');
  const [instituteType, setInstituteType] = useState('');
  const [eiin, setEiin] = useState('');
  const [studentsNumber, setStudentsNumber] = useState(''); // Parse as an integer
  const [instituteName, setInstituteName] = useState('');
  const [distance, setDistance] = useState('');
  const [location, setLocation] = useState('');

  const [selectedUpazila, setSelectedUpazila] = useState('');
  const [selectedType, setSelectedType] = useState('');
  const [institutes, setInstitutes] = useState([]);
  const [editingInstituteId, setEditingInstituteId] = useState(null);
  const [editedName, setEditedName] = useState('');
  const [editedLocation, setEditedLocation] = useState('');
  const [editedInstitutesNum, setEditedInstitutesNum] = useState('');
  const [editedEiin, setEditedEiin] = useState('');
  const [editedDistance, setEditedDistance] = useState('');

  const [upazilas, setUpazilas] = useState([]);
  const [instituteTypes, setInstituteTypes] = useState([]);

  const [submitClicked, setSubmitClicked] = useState(false);


  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch('/api/createInstitute', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: instituteName,
          location,
          distance,
          institutesNum: studentsNumber,
          eiin,
          upazila: upazilaName,
          type: instituteType,
        }),
      });

      if (response.ok) {
        const createdInstitute = await response.json();
        console.log('Institute created:', createdInstitute);
        setSubmitClicked(true);
        toast.success('Institute created successfully!', {
          position: toast.POSITION.TOP_RIGHT,
          autoClose: 3000, // Set the duration the notification will be shown (in milliseconds)
        });
      } else {
        console.error('Error creating institute:', response.statusText);
      }
    } catch (error) {
      console.error('Error creating institute:', error);
      toast.error('An error occurred!', {
        position: 'bottom-right', // You can set the desired position here
        autoClose: 3000, // Set the duration the toast will be shown (in milliseconds)
      });
    }
  };


  const handleEdit = (instituteId) => {
    setEditingInstituteId(instituteId);
    const institute = institutes.find((inst) => inst._id === instituteId);
    setEditedName(institute.name);
    setEditedLocation(institute.location);
    setEditedInstitutesNum(institute.institutesNum);
    setEditedEiin(institute.eiin);
    setEditedDistance(institute.distance);
  };

  const handleSaveEdit = async (instituteId) => {
    try {
      await fetch(`/api/editInstitute/${instituteId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: editedName,
          location: editedLocation,
          institutesNum: editedInstitutesNum,
          eiin: editedEiin,
          distance: editedDistance,
        }),
      });

      // Update the local state with the edited data
      const updatedInstitutes = institutes.map((inst) =>
        inst._id === instituteId
          ? {
              ...inst,
              name: editedName,
              location: editedLocation,
              institutesNum: editedInstitutesNum,
              eiin: editedEiin,
              distance: editedDistance,
            }
          : inst
      );
      setInstitutes(updatedInstitutes);
      toast.success('Institute edited successfully!', {
        position: 'top-right',
        autoClose: 3000,
      });
      // Clear the editing state
      setEditingInstituteId(null);
      setEditedName('');
      setEditedLocation('');
      setEditedInstitutesNum('');
      setEditedEiin('');
      setEditedDistance('');
    } catch (error) {
      console.error('Error editing institute:', error);
    }
  };

  const handleCancelEdit = () => {
    setEditingInstituteId(null);
    setEditedName('');
  };
  
  const handleSearch = async () => {
    try {
      const response = await fetch('/api/searchInstitute', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          upazilaName: selectedUpazila,
          instituteType: selectedType,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setInstitutes(data);
        console.log(data);
      } else {
        console.error('Error searching institutes:', response.statusText);
      }
    } catch (error) {
      console.error('Error searching institutes:', error);

    }
  };
const handleDelete = async (instituteId) => {
  try {
    const response = await fetch(`/api/deleteInstitute/${instituteId}`, {
      method: 'DELETE',
    });

    if (response.ok) {
      // Refresh the institute list after deletion
      handleSearch();
      toast.success('Institute Deleted successfully!', {
        position: 'top-right',
        autoClose: 3000,
      });
    } else {
      console.error('Error deleting institute:', response.statusText);
    }
  } catch (error) {
    console.error('Error deleting institute:', error);
  }
};

 

useEffect(() => {
  if (submitClicked || !submitClicked) {
    // Fetch available upazilas and institute types here
    // For example, using an API request or predefined data
    const fetchUpazilas = async () => {
      // Replace this with your actual API endpoint or data fetching logic
      const response = await fetch('/api/getUpazilas');
      if (response.ok) {
        const data = await response.json();
        setUpazilas(data);
      }
    };

    const fetchInstituteTypes = async () => {
      // Replace this with your actual API endpoint or data fetching logic
      const response = await fetch('/api/getInstituteTypes');
      if (response.ok) {
        const data = await response.json();
        setInstituteTypes(data);
      }
    };

    fetchUpazilas();
    fetchInstituteTypes();

    // Reset the submit trigger flag
    setSubmitClicked(false);
  }
}, [submitClicked, handleSubmit]);



      
  return (
    <div className={styles.container}>
      <Head>
        <title>Edu-Link</title>
        <meta name="description" content="A govment project for tracking information of existing institute of any territory" />
        <link rel="icon" href="https://i.ibb.co/RP8JRyp/logo.png" />
      </Head>

      <div className={styles.nav}>
      <img src="https://i.ibb.co/RP8JRyp/logo.png" />
          <h2>Edu-Link</h2>
        <h3> - A Institute Monitoring System</h3>
      </div>


      <main className={styles.main}>

      <div className={styles.createdata}>
      <ToastContainer />
      <h2>Insert Data </h2>      
      <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Upazila Name"
            value={upazilaName}
            onChange={(e) => setUpazilaName(e.target.value)}
            required
          />
          <input
            type="text"
            placeholder="Institute Type"
            value={instituteType}
            onChange={(e) => setInstituteType(e.target.value)}
            required
          />
          <input
            type="text"
            placeholder="EIIN"
            value={eiin}
            onChange={(e) => setEiin(e.target.value)}
            required
          />
          <input
            type="number"
            placeholder="Students Number"
            value={studentsNumber}
            onChange={(e) => setStudentsNumber(parseInt(e.target.value))}
            required
          />
          <input
            type="text"
            placeholder="Institute Name"
            value={instituteName}
            onChange={(e) => setInstituteName(e.target.value)}
            required
          />
          <input
            type="text"
            placeholder="Distance"
            value={distance}
            onChange={(e) => setDistance(e.target.value)}
            required
          />
          <input
            type="text"
            placeholder="Location"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            required
          />
          <button type="submit">Submit</button>
        </form>
      </div>

      <div>


      <div className={styles.searchdata}>
      <h2>Search Institutes</h2>
      <div>
    
        <select value={selectedUpazila} onChange={(e) => setSelectedUpazila(e.target.value)}>
          <option value="">Select Upazila</option>
          {upazilas.length > 0  &&
            upazilas.map((upazila) => (
              <option key={upazila} value={upazila}>
                {upazila}
              </option>
            ))}
        </select>
      </div>
      <div>
     
        <select value={selectedType} onChange={(e) => setSelectedType(e.target.value)}>
          <option value="">Select Institute Type</option>
          {instituteTypes.length > 0 &&
            instituteTypes.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
        </select>
      </div>
      <button onClick={handleSearch}>Search</button>
      <div>
      {institutes.length > 0 ? (
  <div>
    <h2>Search Results:</h2>
    <ul>
    {institutes.map((institute) => (
  <li key={institute._id}>
    {institute._id === editingInstituteId ? (
      <div>
      <input
            type="text"
            value={editedName}
            onChange={(e) => setEditedName(e.target.value)}
          />
          <input
            type="text"
            value={editedLocation}
            onChange={(e) => setEditedLocation(e.target.value)}
          />
          <input
            type="number"
            value={editedInstitutesNum}
            onChange={(e) => setEditedInstitutesNum(e.target.value)}
          />
          <input
            type="text"
            value={editedEiin}
            onChange={(e) => setEditedEiin(e.target.value)}
          />
          <input
            type="text"
            value={editedDistance}
            onChange={(e) => setEditedDistance(e.target.value)}
        />
        <button onClick={() => handleSaveEdit(institute._id)}>Save</button>
        <button onClick={() => handleCancelEdit()}>Cancel</button>
      </div>
    ) : (
      <div className={styles.institutes}>
        <p>Name: {institute.name}</p>
        <p>Location: {institute.location}</p>
        <p>Distance from Upazila: {institute.distance}</p>
        <p>Student Number: {institute.institutesNum}</p>
        <p>EIIN: {institute.eiin}</p>
      
        <button onClick={() => handleEdit(institute._id)}>Edit</button>
        <button onClick={() => handleDelete(institute._id)}>Delete</button>
      </div>
    )}
  </li>
))}

    </ul>
  </div>
) : (
  <p>No results found.</p>
)}

      </div>
    </div>


      </div>



      </main>
    </div>
  );
}
