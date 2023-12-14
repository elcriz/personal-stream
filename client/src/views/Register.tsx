import { useEffect, useState, FormEvent } from 'react';
import { Link, Navigate } from 'react-router-dom';
import Canvas from 'src/components/Canvas';
import Field from 'src/components/Field';
import useAuth from 'src/hooks/useAuth';
import usersService from 'src/services/usersService';

function Register() {
  const [email, setEmail] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const auth = useAuth();

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitting(true);
    setError('');

    usersService
      .retrieveSignup(email, firstName, lastName, password)
      .then((data) => {
        setIsSubmitting(false);
        auth.setUser({
          role: 0,
          token: data.token,
        });
      })
      .catch((errorOrStatus) => {
        setIsSubmitting(false);
        if (errorOrStatus instanceof Error) {
          console.log(error);
          return;
        }
        switch (errorOrStatus) {
          case 400:
          case 401: {
            setError('Please fill all the fields correctly');
            break;
          }
          default: {
            setError('Something went wrong, please try again later');
          }
        }
      });
  };

  useEffect(() => {
    setError('');
  }, [email, firstName, lastName, password]);

  if (auth.user.isAuthenticated) {
    return <Navigate to="/" />;
  }

  return (
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
        {error && <div className="form__error error">{error}</div>}
        <p>
          Already have an account?{' '}
          <Link
            className="link"
            to="/login"
          >
            Sign in
          </Link>
        </p>
      </form>
    </Canvas>
  );
}

export default Register;
