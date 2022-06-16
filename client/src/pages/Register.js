import React, { useState, useContext, useEffect } from 'react';
import { Link, Navigate } from 'react-router-dom';
import Canvas from '../components/Canvas';
import Field from '../components/Field';
import { UserContext } from '../context/UserContext';

const defaultErrorMessage = 'Something went wrong, please try again later';

const Register = () => {
  const [email, setEmail] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [userContext, setUserContext] = useContext(UserContext);
  const isLoggedIn = !!userContext.token;

  const handleSubmit = (event) => {
    event.preventDefault();
    setIsSubmitting(true);
    setError('');

    fetch(`${process.env.REACT_APP_API_ENDPOINT}users/signup`, {
      method: 'POST',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        username: email,
        firstName,
        lastName,
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
            case 500: {
              console.log(response);
              const data = await response.json();
              if (data.message) {
                setError(data.message || defaultErrorMessage);
              }
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
        }));
      })
      .catch((error) => {
        setIsSubmitting(false);
        console.error(error);
      });
  }

  useEffect(() => {
    setError('');
  }, [email, firstName, lastName, password]);

  if (isLoggedIn) {
    return (
      <Navigate to="/" />
    );
  }

  return(
    <Canvas>
      <form
        className="form"
        onSubmit={handleSubmit}
      >
        <h2 className="form__heading">Register</h2>
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
          id="firstName"
          className="form__field"
          label="First name"
          value={firstName}
          placeholder="First name"
          disabled={isSubmitting}
          onChange={setFirstName}
        />
        <Field
          id="lastName"
          className="form__field"
          label="Last name"
          value={lastName}
          placeholder="Last name"
          disabled={isSubmitting}
          onChange={setLastName}
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
          Register
        </button>
        {error && (
          <div className="form__error error">
            {error}
          </div>
        )}
        <p>Already have an account? <Link className="link" to="/login">Sign in</Link></p>
      </form>
    </Canvas>
  );
}

export default Register;
