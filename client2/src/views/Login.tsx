import { useEffect, useState, FormEvent } from 'react';
import { Link, Navigate } from 'react-router-dom';
import Canvas from 'src/components/Canvas';
import Field from 'src/components/Field';
import useAuth from 'src/hooks/useAuth';
import usersService from 'src/services/usersService';

const defaultErrorMessage = 'Something went wrong, please try again later';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const auth = useAuth();

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitting(true);
    setError('');

    usersService
      .retrieveLogin(email, password)
      .then((data) => {
        setIsSubmitting(false);
        auth.setUser({
          token: data.token,
          role: data.role,
        });
      })
      .catch((errorOrStatus) => {
        setIsSubmitting(false);
        if (errorOrStatus instanceof Error) {
          console.log(error);
          return;
        }
        switch (errorOrStatus) {
          case 400: {
            setError('Please fill all the fields correctly');
            break;
          }
          case 401: {
            setError('Invalid email and password combination');
            break;
          }
          default: {
            setError(defaultErrorMessage);
          }
        }
      });
  };

  useEffect(() => {
    setError('');
  }, [email, password]);

  if (auth.user.isAuthenticated) {
    return <Navigate to="/" />;
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
        {error && <div className="form__error error">{error}</div>}
        <p>
          Or{' '}
          <Link
            className="link"
            to="/register"
          >
            register a new account
          </Link>
        </p>
      </form>
    </Canvas>
  );
}

export default Login;
