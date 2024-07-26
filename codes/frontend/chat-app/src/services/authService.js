import axios from "axios";

const API_URL = `${
  process.env.REACT_APP_API_BASE_URL || "http://localhost:4000"
}/api/users`;

const login = async (email, password) => {
  const response = await axios.post(`${API_URL}/login`, { email, password });
  return response.data;
};

export default { login };
