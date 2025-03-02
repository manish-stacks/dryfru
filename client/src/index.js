import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import Header from './components/Header/Header';
import Footer from './components/Footer/Footer';
import store from './store/Store';
import { Toaster } from 'react-hot-toast';
import { findSettings } from './utils/Api';
import Maintenance from './Maintenance';
import Loader from './components/Loader/Loader';

const root = ReactDOM.createRoot(document.getElementById('root'));

function AppWithMaintenance() {
  const [mode, setMode] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchSettingsApp = async () => {
      try {
        const data = await findSettings();
        if (data.maintenanceMode === true) {
          setMode(true);
        }
      } catch (error) {
        console.error("Error fetching settings:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSettingsApp();
  }, []);

  if (isLoading) {
    // Display loader while settings are being fetched
    return (
      <Loader/>
    );
  }

  if (mode) {
    return <Maintenance />;
  }

  return (
    <>
      <Header />
      <App />
      <Toaster />
      <Footer />
    </>
  );
}

root.render(
  <Provider store={store}>
    <BrowserRouter>
      <AppWithMaintenance />
    </BrowserRouter>
  </Provider>
);

reportWebVitals();
