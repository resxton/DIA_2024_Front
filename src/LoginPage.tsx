import { FC, useState } from 'react';
import { useDispatch } from 'react-redux';
import { login } from './redux/authSlice';
import { useNavigate } from 'react-router-dom';
import { Form, Button, Container, Row, Col } from 'react-bootstrap';
import { ROUTES, ROUTE_LABELS } from './Routes';
import { BreadCrumbs } from './components/BreadCrumbs';
import { api } from './api';

const LoginPage: FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      // Send data to the server for authentication
      const response = await api.login.loginCreate({ username, password });
  
      // Request to get user id by username
      const userResponse = await api.user.userGetIdByUsername(username);
      console.log(username);
  
      const id = userResponse.data.id;
  
      // Save id in Redux
      dispatch(login({ username, token: "no-token", id }));
      navigate('/configuration-elements');
    } catch (error) {
      console.error('Ошибка авторизации:', error);
    }
  };

  const handleAdminLogin = () => {
    setUsername('admin');
    setPassword('admin');
    handleLogin();
  };

  const handleKirillLogin = () => {
    setUsername('kirill');
    setPassword('kirill');
    handleLogin();
  };

  return (
    <Container fluid className="d-flex justify-content-center align-items-center min-vh-100">
      <Row className="w-100">
        <BreadCrumbs
          crumbs={[
            { label: ROUTE_LABELS.LOGIN, path: ROUTES.LOGIN }
          ]}
        />
        <Col xs={12} sm={8} md={6} lg={4} className="mx-auto">
          <div className="auth-container p-4 border rounded shadow">
            <h2 className="text-center mb-4">Авторизация</h2>
            <Form>
              <Form.Group controlId="formUsername">
                <Form.Label>Логин</Form.Label>
                <Form.Control 
                  type="text" 
                  placeholder="Введите логин" 
                  value={username} 
                  onChange={(e) => setUsername(e.target.value)} 
                />
              </Form.Group>

              <Form.Group controlId="formPassword" className="mt-3">
                <Form.Label>Пароль</Form.Label>
                <Form.Control 
                  type="password" 
                  placeholder="Введите пароль" 
                  value={password} 
                  onChange={(e) => setPassword(e.target.value)} 
                />
              </Form.Group>

              <Button variant="primary" onClick={handleLogin} className="w-100 mt-4">
                Войти
              </Button>

              <div className="d-flex justify-content-between mt-3">
                <Button variant="secondary" onClick={handleAdminLogin}>
                  Войти как admin
                </Button>
                <Button variant="secondary" onClick={handleKirillLogin}>
                  Войти как kirill
                </Button>
              </div>
            </Form>
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default LoginPage;
