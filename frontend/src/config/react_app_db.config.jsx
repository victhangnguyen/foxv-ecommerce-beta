const REACT_APP_DB_PORT = 5000;
const REACT_APP_DB_HOST = "http://127.0.0.1";
const REACT_APP_DB_URL = "https://foxv-beta-server.onrender.com";
// const REACT_APP_DB_URL = "";

const REACT_APP_PORT = 3000;
const REACT_APP_HOST = "http://127.0.0.1";
const REACT_APP_URL = "https://foxvcom.onrender.com";
// const REACT_APP_URL = "";

const react_app_db = {
  reactAppURL: REACT_APP_URL || `${REACT_APP_HOST}:${REACT_APP_PORT}`,
  databaseURL: REACT_APP_DB_URL || `${REACT_APP_DB_HOST}:${REACT_APP_DB_PORT}`,
};
export default react_app_db;
