import { useState } from 'react';
import useSWR from 'swr';

export default function SearchPage() {
  const [selectedUpazila, setSelectedUpazila] = useState('');
  const [selectedType, setSelectedType] = useState('');
  const [institutes, setInstitutes] = useState([]);

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
                <li key={institute.id}>
                  <p>Name: {institute.name}</p>
                  <p>Location: {institute.location}</p>
                  {/* Display other relevant information */}
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
