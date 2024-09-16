"use client"
import { Provider } from 'react-redux';
import { store } from '../store';
import './globals.css'; // Global CSS

const Layout = ({ children }) => {
  return (
    <html>
      <body>
        
    <Provider store={store}>
      <div>
        <main>{children}</main>
      </div>
    </Provider>
      </body>
    </html>
  );
};

export default Layout;
