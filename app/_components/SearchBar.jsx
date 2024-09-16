"use client";
import React from 'react';
import { Input, message } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import { setKeyword, setResults } from '../../slices/searchSlice';
import { searchRecords } from '../../utils/api';
import styles from './SearchBar.module.css'; // Import CSS module for styling

const { Search } = Input;

const SearchBar = () => {
  const dispatch = useDispatch(); // Access Redux dispatch function
  const { keyword, results } = useSelector((state) => state.search); // Get keyword and search results from Redux state

  // Function to handle search action
  const handleSearch = async (value) => {
    // Check if the search term is empty or only whitespace
    if (!value || value.trim() === '') {
      message.error('Please enter a valid search term');
      return;
    }

    // Update the keyword in Redux state
    dispatch(setKeyword(value));

    try {
      // Perform the search request
      const response = await searchRecords(value);
      // Update the search results in Redux state
      dispatch(setResults(response.data));
    } catch (error) {
      // Handle any errors during the search process
      message.error('Error searching records');
    }
  };

  // Function to handle downloading the search results as a JSON file
  const handleDownload = () => {
    // Create a Blob from the search results and generate a download link
    const blob = new Blob([JSON.stringify(results, null, 2)], { type: 'application/json' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'results.json';
    a.click(); // Trigger the download
  };

  return (
    <div className={styles.container}>
      {/* Ant Design Search component for keyword input */}
      <Search
        placeholder="KeyWord"
        enterButton
        size="large"
        value={keyword}
        onChange={(e) => dispatch(setKeyword(e.target.value))} // Update keyword on input change
        onSearch={handleSearch} // Trigger search when Enter is pressed or search button is clicked
        className={styles.searchInput}
      />
      {/* Render the download section if there are search results */}
      {results.length > 0 && (
        <div className={styles.downloadSection}>
          <div className={styles.title}>Download Link</div>
          <div className={styles.subtitle}>
            This is the result of your keyword. Click to download:
          </div>
          <a onClick={handleDownload} className={styles.downloadLink}>
            - downloadResult...
          </a>
        </div>
      )}
    </div>
  );
};

export default SearchBar;
