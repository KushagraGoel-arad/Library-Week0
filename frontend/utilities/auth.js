// utilities/auth.js
import { jwtDecode } from "jwt-decode"

export function getUserIdFromToken() {
  const token = localStorage.getItem('token');
  if (!token) {
    console.error('No token found');
    return null;
  }
  try {
    const decodedToken = jwtDecode(token);
    console.log('Decoded token:', decodedToken); 
    return decodedToken.userId;
  } catch (error) {
    console.error('Error decoding token:', error);
    return null;
  }
}
