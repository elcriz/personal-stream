import React, { useState, useContext, useEffect } from 'react';
import { Link, Navigate } from 'react-router-dom';
import Canvas from '../components/Canvas';
import Field from '../components/Field';
import { UserContext } from '../context/UserContext';

const defaultErrorMessage = 'Something went wrong, please try again later';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [userContext, setUserContext] = useContext(UserContext);
  const isAuthenticated = !!userContext.token

  const handleSubmit = (event) => {
    event.preventDefault();
    setIsSubmitting(true);
    setError('');

    fetch(`${process.env.REACT_APP_API_ENDPOINT}users/login`, {
      method: 'POST',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        username: email,
        password,
      }),
    })
      .then(async (response) => {
        setIsSubmitting(false);
        if (!response.ok) {
          const { status } = response;
          switch (status) {
            case 400: {
              setError('Please fill all the fields correctly');
              break;
            }
            case 401: {
              setError('Invalid email and password combination');
              break;
            }
            default: {
              setError(defaultErrorMessage)
            }
          }
          return;
        }
        const data = await response.json();
        setUserContext(previous => ({
          ...previous,
          token: data.token,
          role: data.role,
        }));
      })
      .catch((error) => {
        setIsSubmitting(false);
        console.error(error);
      });
  };

  useEffect(() => {
    setError('');
  }, [email, password]);

  if (isAuthenticated) {
    return (
      <Navigate to="/" />
    );
  }

  return (
    <Canvas>
      <form
        className="form"
        onSubmit={handleSubmit}
      >
        <h2 className="form__heading">Sign in</h2>
        <Field
          id="email"
          className="form__field"
          type="email"
          label="Email address"
          value={email}
          placeholder="Email address"
          disabled={isSubmitting}
          onChange={setEmail}
        />
        <Field
          id="password"
          className="form__field"
          type="password"
          label="Password"
          value={password}
          disabled={isSubmitting}
          onChange={setPassword}
        />
        <button
          className="button"
          type="submit"
          disabled={isSubmitting}
        >
          Sign In
        </button>
        {error && (
          <div className="form__error error">
            {error}
          </div>
        )}
        <p>Or <Link className="link" to="/register">register a new account</Link></p>
      </form>
    </Canvas>
  );
};

export default Login;
