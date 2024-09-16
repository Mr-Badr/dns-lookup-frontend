"use client"
import FileUpload from './_components/FileUpload';
import SearchBar from './_components/SearchBar';

const HomePage = () => {
  return (
    <div style={{ padding: '20px' }}>
      <FileUpload />
      <SearchBar />
    </div>
  );
};

export default HomePage;
