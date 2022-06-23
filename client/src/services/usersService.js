export default {
  /**
   * Retrieve a (new) token.
   * @returns Promise
   */
  retrieveRefreshToken: async () => {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_ENDPOINT}users/refreshToken`,
        {
          method: 'POST',
          credentials: 'include',
          headers: { 'Content-Type': 'application/json' },
        },
      );
      if (!response.ok) {
        throw new Error(response.status);
      }
      return await response.json();
    } catch (error) {
      throw error;
    }
  },

  /**
   * Retrieve logged in user by their credentials.
   * @param {string} username
   * @param {string} password
   * @returns Promise
   */
  retrieveLogin: async (username, password) => {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_ENDPOINT}users/login`,
        {
          method: 'POST',
          credentials: 'include',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ username, password }),
        },
      );
      if (!response.ok) {
        throw response.status;
      }
      return await response.json();

    } catch (error) {
      throw error;
    }
  },

  /**
   * Log out the current user.
   * @param {string} _token
   * @returns Promise
   */
  retrieveLogout: async (_token) => {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_ENDPOINT}users/logout`,
        {
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${_token}`,
          },
        },
      );
      if (!response.ok) {
        throw new Error(response.status);
      }
      return await response.json();
    } catch (error) {
      throw error;
    }
  },

  /**
   * Retrieve newly signed up in user by credentials.
   * @param {string} username
   * @param {string} firstName
   * @param {string} lastName
   * @param {string} password
   * @returns Promise
   */
  retrieveSignup: async (username, firstName, lastName, password) => {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_ENDPOINT}users/signup`,
        {
          method: 'POST',
          credentials: 'include',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            username,
            firstName,
            lastName,
            password,
          }),
        },
      );
      if (!response.ok) {
        throw response.status;
      }
      return await response.json();
    } catch (error) {
      throw error;
    }
  },
};
