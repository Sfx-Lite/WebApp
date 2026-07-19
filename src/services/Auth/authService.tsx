import axios from "axios";

const BASE_URL = import.meta.env.PUBLIC_BASE_URL;
function axiosConfig(token) {
  return {
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: "application/json",
    },
  };
}

function handleResponse(response) {
  if (response.status >= 200 && response.status < 300) {
    return response.data;
  }
  else {
    throw new Error(`Request failed with status ${response.status}`);
  }
}
async function registerUser(params) {
  try {
    const url = `${BASE_URL}/auth/register`;
    const response = await axios.post(url, params);
    return handleResponse(response);
  }
  catch (error) {
    console.error("Error registering User:", error);
    throw error;
  }
}
async function checkUsername(token) {
  try {
    const url = `${BASE_URL}/auth/username-available`;
    const response = await axios.get(url, axiosConfig(token));
    return handleResponse(response);
  }
  catch (error) {
    console.error("Error checking username:", error);
    throw error;
  }
}

async function loginUser(params) {
  try {
    const url = `${BASE_URL}/auth/login`;
    const response = await axios.post(url, params);
    return handleResponse(response);
  }
  catch (error) {
    console.error("Error logging in:", error);
    throw error;
  }
}

async function newToken(params) {
  try {
    const url = `${BASE_URL}/auth/refresh`;
    const response = await axios.post(url, params);
    return handleResponse(response);
  }
  catch (error) {
    console.error("Error getting new token:", error);
    throw error;
  }
}

const AuthService = {
  registerUser,
  checkUsername,
  loginUser,
  newToken,
};

export default AuthService;
