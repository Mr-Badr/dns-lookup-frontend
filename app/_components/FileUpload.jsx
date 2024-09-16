"use client";
import React, { useEffect, useState } from 'react';
import { message } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import { setUploading, setProgress, setDownloadLink } from '../../slices/fileSlice';
import { uploadFile, fetchRecordsByDomain } from '../../utils/api';
import styles from './FileUpload.module.css'; // Import the CSS Module for styling
import { FaUpload } from "react-icons/fa"; // Import the upload icon
import CustomProgressBar from './CustomProgressBar'; // Import the Custom Progress Bar component
import { setResults } from '../../slices/searchSlice'; // Import search actions for Redux

const FileUpload = () => {
  const dispatch = useDispatch(); // Access Redux dispatch function
  const { uploading, progress, downloadLink } = useSelector((state) => state.file); // Get file-related state from Redux
  const [fileName, setFileName] = useState(''); // State to hold the name of the uploaded file
  const [dnsRecords, setDnsRecords] = useState([]); // State to hold DNS records

  useEffect(() => {
    // Reset progress when the component mounts
    dispatch(setProgress(0));

    // Establish a server-sent events connection to track upload progress
    const eventSource = new EventSource('http://localhost:3000/dns-lookup/progress');

    eventSource.onmessage = (event) => {
      console.log('SSE message received:', event.data);
      try {
        const { progress } = JSON.parse(event.data);
        console.log('SSE progress:', progress);
        
        // Update progress state only if it's less than 100%
        if (progress < 100) {
          dispatch(setProgress(progress));
        }
      } catch (error) {
        console.error('Error parsing SSE message:', error);
      }
    };

    eventSource.onerror = (error) => {
      console.error('EventSource failed:', error);
      eventSource.close(); // Close the connection on error
    };

    // Clean up the EventSource connection when the component unmounts
    return () => {
      eventSource.close();
    };
  }, [dispatch]);

  const handleFileChange = async (e) => {
    const file = e.target.files[0]; // Get the selected file
    console.log('File selected:', file);
    if (file) {
      setFileName(file.name); // Set the file name in state

      // Reset progress to 0% when a new file is selected
      dispatch(setProgress(0));

      // Start the custom file upload process
      customRequest({
        file,
        onSuccess: (data) => {
          console.log('File uploaded successfully:', data);
          // Set the download link if available
          if (data.downloadLink) {
            dispatch(setDownloadLink(data.downloadLink));
          }
        },
        onError: (error) => {
          console.error('File upload error:', error);
          message.error('File upload failed. Please try again.');
        },
        onProgress: (progress) => {
          console.log('Upload progress:', progress);
        }
      });
      
      dispatch(setUploading(true)); // Indicate that the upload is in progress
    }
  };

  const customRequest = async ({ file, onSuccess = () => {}, onError = () => {}, onProgress = () => {} }) => {
    console.log('Custom request started with file:', file);
    const formData = new FormData();
    formData.append('file', file);
  
    dispatch(setUploading(true)); // Set uploading state to true
  
    try {
      // Upload the file and track progress
      const response = await uploadFile(formData, (event) => {
        if (onProgress) {
          const percentCompleted = Math.round((event.loaded * 100) / event.total);
          console.log('Upload progress:', percentCompleted);
          onProgress({ percent: percentCompleted });
          dispatch(setProgress(percentCompleted));
        }
      });
  
      console.log('Upload successful:', response.data);
  
      // Handle successful upload and set download link
      if (response.data.downloadLink) {
        dispatch(setDownloadLink(response.data.downloadLink));
      }
  
      onSuccess(response.data);
      dispatch(setUploading(false)); // Reset uploading state to false
  
      /* TODO: Adjust this section to correctly handle domain and DNS records */
      // Fetch DNS records after upload
      //const domain = response.data.domain; // Ensure 'domain' is correctly set in the response
      /* if (domain) {
        fetchDnsRecords(domain);
      } else {
        message.error('Domain not found in the response.');
      } */
  
      message.success('Great! Your file was uploaded successfully 👌');
    } catch (error) {
      console.error('Upload failed:', error);
      onError(error);
      dispatch(setUploading(false)); // Reset uploading state on error
      message.error('Upload failed. Please try again.');
    }
  };

  const fetchDnsRecords = async (domain) => {
    if (!domain) {
      message.error('Domain is not specified.');
      return;
    }
  
    try {
      // Fetch DNS records by domain and update state
      const response = await fetchRecordsByDomain(domain);
      console.log('DNS records:', response.data);
      setDnsRecords(response.data.spfRecords || []);
      dispatch(setResults(response.data.spfRecords || [])); // Update Redux state with search results
    } catch (error) {
      console.error('Failed to fetch DNS records:', error);
      message.error('Failed to fetch DNS records.');
    }
  };

  const handleDrop = (e) => {
    e.preventDefault(); // Prevent default browser behavior for drop event
    const file = e.dataTransfer.files[0]; // Get the dropped file
    console.log('File dropped:', file);
    if (file) {
      setFileName(file.name); // Set the file name in state
      customRequest({
        file,
        onSuccess: (data) => {
          console.log('File uploaded successfully:', data);
        },
        onError: (error) => {
          console.error('File upload error:', error);
        },
        onProgress: (progress) => {
          console.log('Upload progress:', progress);
        }
      });
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault(); // Prevent default browser behavior for drag over event
  };

  return (
    <div style={{ width: "50%", margin: "5rem auto" }}>
      <div
        className={styles.dropzone} // Apply CSS styling for the dropzone
        onDrop={handleDrop}
        onDragOver={handleDragOver}
      >
        <FaUpload size={40} /> {/* Render the upload icon */}
        <p className={styles.fileName}>{fileName ? `${fileName}` : 'Upload your file'}</p>
        <input
          type="file"
          onChange={handleFileChange} // Handle file selection
          className={styles.fileInput} // Apply CSS styling for file input
        />
      </div>
      {/* Render the progress bar only if uploading is true */}
      {uploading && <CustomProgressBar percent={progress} />}

      {/* TODO: Clean this part Because I do not need it here */}
      {/* {downloadLink && (
        <div style={{ marginTop: '20px' }}>
          <a href={downloadLink} download>
            Download Results
          </a>
        </div>
      )} */}

      {/* TODO: Clean this part Because I do not need it here */}
      {/* {dnsRecords.length > 0 && (
        <div style={{ marginTop: '20px' }}>
          <h3>DNS Records:</h3>
          <ul>
            {dnsRecords.map(record => (
              <li key={record.id}>{record.record} (Included Domain: {record.includedDomain || 'N/A'})</li>
            ))}
          </ul>
        </div>
      )} */}

    </div>
  );
};

export default FileUpload;
