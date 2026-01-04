import React, { useState, ChangeEvent, FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
// Authentication removed
import styled from 'styled-components';
import { Alert } from '@mui/material';

const LoginContainer = styled.div`
  max-width: 400px;
  margin: 0 auto;
  padding: 2rem;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const Input = styled.input`
  padding: 0.5rem;
  border: 1px solid #ccc;
  border-radius: 4px;
`;

const Button = styled.button`
  padding: 0.5rem;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;

  &:hover {
    background-color: #0056b3;
  }
`;

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  // Authentication removed - no signin functionality

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    // Authentication removed - just show a message
    setError('Authentication is currently disabled. Please contact support.');
    setLoading(false);
  };

  return (
    <LoginContainer>
      <Form onSubmit={handleSubmit}>
        <h2>Login</h2>
        {error && <Alert severity="error">{error}</Alert>}
        <Input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <Input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <Button type="submit" disabled={loading}>
          {loading ? 'Logging in...' : 'Login'}
        </Button>
      </Form>
    </LoginContainer>
  );
};

export default Login; 