import config from "../config";
import TokenService from "./token-service";

const PatternsApiService = {
  postPattern(pattern) {
    return fetch(`${config.API_BASE_URL}/patterns`, {
      method: "POST",
      headers: {
        "content-type": "application/json",
        authorization: `bearer ${TokenService.getAuthToken()}`,
      },
      body: JSON.stringify(pattern),
    }).then((res) =>
      !res.ok ? res.json().then((e) => Promise.reject(e)) : res.json()
    );
  },
  getUserPatterns(user_id) {
    return fetch(`${config.API_BASE_URL}/patterns/users/${user_id}`, {
      headers: {
        authorization: `bearer ${TokenService.getAuthToken()}`,
      },
    }).then((res) =>
      !res.ok ? res.json().then((e) => Promise.reject(e)) : res.json()
    );
  },
  deletePattern(pattern_id) {
    return fetch(`${config.API_BASE_URL}/patterns/${pattern_id}`, {
      method: "DELETE",
      headers: {
        authorization: `bearer ${TokenService.getAuthToken()}`,
      },
    }).then((res) => (!res.ok ? res.json().then((e) => Promise.reject(e)) : 1));
  },
  getPatternById(pattern_id) {
    return fetch(`${config.API_BASE_URL}/patterns/${pattern_id}`, {
      headers: {
        authorization: `bearer ${TokenService.getAuthToken()}`,
      },
    }).then((res) =>
      !res.ok ? res.json().then((e) => Promise.reject(e)) : res.json()
    );
  },
  patchPattern(pattern_id, newPatternData) {
    return fetch(`${config.API_BASE_URL}/patterns/${pattern_id}`, {
      method: "PATCH",
      headers: {
        "content-type": "application/json",
        authorization: `bearer ${TokenService.getAuthToken()}`,
      },
      body: JSON.stringify(newPatternData),
    }).then((res) => (!res.ok ? res.json().then((e) => Promise.reject(e)) : 1));
  },
};

export default PatternsApiService;
