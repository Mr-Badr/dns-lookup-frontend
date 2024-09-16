import axios from 'axios';

// Create an Axios instance with a base URL for API requests
const instance = axios.create({
  baseURL: 'http://localhost:3000', // Base URL for the API. For production, this should be moved to an environment variable (.env)
});

// Upload file and get a link to download the result
export const uploadFile = (formData, onProgress) => {
  return instance.post('/dns-lookup/upload', formData, {
    headers: {
      'Content-Type': 'multipart/form-data', // Set the correct Content-Type for file uploads
    },
    onUploadProgress: (progressEvent) => {
      // Call the provided onProgress function with the progress event
      if (onProgress) {
        onProgress(progressEvent);
      }
    },
  });
};

// Fetch all SPF records
export const fetchRecords = () => {
  return instance.get('/dns-lookup/records'); // Send GET request to fetch all SPF records
};

// Fetch SPF records by domain
export const fetchRecordsByDomain = (domain) => {
  return instance.get(`/dns-lookup/records/${domain}`); // Send GET request to fetch SPF records for a specific domain
};

// Fetch search results based on a keyword
export const searchRecords = (keyword) => {
  return instance.get(`/dns-lookup/search`, {
    params: { keyword }, // Include the search keyword as a query parameter
  });
};

// Note: The baseURL is currently hardcoded for testing purposes. In a production environment, it should be set via an environment variable (.env).
