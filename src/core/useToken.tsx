import {useState} from "react";

const ACCESS_TOKEN = "accessToken";

export default function useToken() {
  const getToken = () => {
    return localStorage.getItem(ACCESS_TOKEN);
  };

  const [token, setToken] = useState(getToken());

  const saveToken = (token) => {
    localStorage.setItem(ACCESS_TOKEN, token);
    setToken(token);
  };

  return {
    token,
    setToken: saveToken,
  };
}
