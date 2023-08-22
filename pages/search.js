import { useState } from 'react';
import useSWR from 'swr';

export default function SearchPage() {
  const [selectedUpazila, setSelectedUpazila] = useState('');
  const [selectedType, setSelectedType] = useState('');
  const [institutes, setInstitutes] = useState([]);
  const [editingInstituteId, setEditingInstituteId] = useState(null);
  const [editedName, setEditedName] = useState('');
  const [editedLocation, setEditedLocation] = useState('');
  const [editedInstitutesNum, setEditedInstitutesNum] = useState('');
  const [editedEiin, setEditedEiin] = useState('');
  const [editedDistance, setEditedDistance] = useState('');


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
    } else {
      console.error('Error deleting institute:', response.statusText);
    }
  } catch (error) {
    console.error('Error deleting institute:', error);
  }
};

  const fetcher = (url) => fetch(url).then((res) => res.json());
  const { data: upazilas } = useSWR('/api/getUpazilas', fetcher);
  const { data: instituteTypes } = useSWR('/api/getInstituteTypes', fetcher);

  return (
    <div>
      <h1>Search Institutes</h1>
      <div>
        <label>Select Upazila:</label>
        <select value={selectedUpazila} onChange={(e) => setSelectedUpazila(e.target.value)}>
          <option value="">Select Upazila</option>
          {upazilas &&
            upazilas.map((upazila) => (
              <option key={upazila} value={upazila}>
                {upazila}
              </option>
            ))}
        </select>
      </div>
      <div>
        <label>Select Institute Type:</label>
        <select value={selectedType} onChange={(e) => setSelectedType(e.target.value)}>
          <option value="">Select Institute Type</option>
          {instituteTypes &&
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
      <div>
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
  );
}
