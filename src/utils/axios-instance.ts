import store from "@/store";
import { setRefreshToken } from "@/store/slices/auth-slice";
import axios from "axios";
import moment from "moment";
// const baseURL =
//   import.meta.env.BOILERPLATE_API_URL ||
//   "http://ec2-13-48-43-58.eu-north-1.compute.amazonaws.com:3333/api";

const baseURL =
  import.meta.env.BOILERPLATE_API_URL ||
  "http://ec2-13-60-94-109.eu-north-1.compute.amazonaws.com:3333/api";
// const baseURL =
//   import.meta.env.BOILERPLATE_API_URL || "http://192.168.1.78:3333/api";

const axiosInstance = axios.create({
  baseURL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Add a request interceptor
axiosInstance.interceptors.request.use(async (config) => {
  const state = store.getState().auth;
  const tokenExpiryDate = moment(state.tokenExpiryDate);
  const currentDate = moment();

  const differenceInMinutes = tokenExpiryDate.diff(currentDate, "minutes");

  if (differenceInMinutes < 30 && state.refreshToken) {
    try {
      const response = await axios.post(`${baseURL}/auth/refreshToken`, {
        refreshToken: state.refreshToken,
      });
      console.log(response.data);
      const { token, refreshToken, tokenExpiryDate } = response.data.data;
      // console.log("New tokens:", newToken, newRefreshToken, newExpiryDate);
      // alert(JSON.stringify(response));
      // Update the Redux store and localStorage with the new tokens
      // store.dispatch(
      //   login({
      //     token: newToken,
      //     refreshToken: newRefreshToken,
      //     tokenExpiryDate: newExpiryDate,
      //     userType: state.userType!,
      //     adminInfo: state.adminInfo!,
      //   })
      // );
      store.dispatch(
        setRefreshToken({
          newToken: token,
          newRefreshToken: refreshToken,
          newExpiryDate: tokenExpiryDate,
        })
      );

      // Update the config with the new token
      config.headers.Authorization = `Bearer ${token}`;
    } catch (err) {
      console.error("Failed to refresh token", err);
    }
  } else if (state.token) {
    config.headers.Authorization = `Bearer ${state.token}`;
  }

  return config;
});

// axiosInstance.interceptors.response.use(
//   (response) => response, // Return response if no error
//   async (error) => {
//     const originalRequest = error.config;
//     if (
//       error.response &&
//       error.response.status === 401 &&
//       !originalRequest._retry
//     ) {
//       originalRequest._retry = true; // Mark request as retried to avoid loops
//       const refreshToken = localStorage.getItem("refreshToken");
//       const tokenExpiryDate = localStorage.getItem("tokenExpiryDate");
//       const currentDate = new Date();
//       // Check if a refreshToken exists and is still valid
//       if (refreshToken && new Date(tokenExpiryDate) > currentDate) {
//         try {
//           // Use axios directly to avoid interceptor conflicts
//           const response = await axios.post(`${baseURL}/auth/refreshToken`, {
//             refreshToken,
//           });
//           const { newToken, newRefreshToken, newExpiryDate } =
//             response.data.data;
//           // Update tokens and expiry date in localStorage
//           localStorage.setItem("token", newToken);
//           localStorage.setItem("refreshToken", newRefreshToken);
//           localStorage.setItem("tokenExpiryDate", newExpiryDate);
//           // Update Authorization header and retry the original request
//           originalRequest.headers["Authorization"] = `Bearer ${newToken}`;
//           return axios(originalRequest); // Retry the original request
//         } catch (refreshError) {
//           console.error("Failed to refresh token:", refreshError);
//           // Redirect to login if token refresh fails
//           window.location.href = "/admin-login";
//         }
//       } else {
//         console.warn("Refresh token expired or missing. Redirecting to login.");
//         window.location.href = "/admin-login";
//       }
//     }
//     return Promise.reject(error); // Reject all other errors
//   }
// );

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      localStorage.removeItem("token");
      //? don't remove token, we need fresh token. we got key and time, by default we have token, we have expiry time, don't use axiosInstance, use axios  directly,
      // window.location.href = "/admin-login";
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
