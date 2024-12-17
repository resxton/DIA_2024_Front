import { FC, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { loginAsync } from './redux/authSlice';
import { useNavigate } from 'react-router-dom';
import { Form, Button, Container, Row, Col, Alert } from 'react-bootstrap';
import { BreadCrumbs } from './components/BreadCrumbs';
import { ROUTES, ROUTE_LABELS } from './Routes';
import { RootState } from './redux/store';
import CustomNavbar from './components/CustomNavbar';

const LoginPage: FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isAuthenticated, user } = useSelector((state: any) => state.auth);

  const { loading, error } = useSelector((state: RootState) => state.auth);

  const handleLogin = async () => {
    const resultAction = await dispatch(
      loginAsync({ username, password }) as any
    );

    if (loginAsync.fulfilled.match(resultAction)) {
      navigate(ROUTES.HOME);
    }
  };

  const handleQuickLogin = (username: string, password: string) => {
    setUsername(username);
    setPassword(password);
  };

  return (
    <Container fluid className="d-flex justify-content-center align-items-center min-vh-100">
      <Row className="w-100">
        <CustomNavbar
          isAuthenticated={isAuthenticated}
          user={user}
        />
        <BreadCrumbs crumbs={[{ label: ROUTE_LABELS.LOGIN, path: ROUTES.LOGIN }]} />
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

              {error && <Alert variant="danger" className="mt-3">{error}</Alert>}

              <Button
                variant="primary"
                onClick={handleLogin}
                className="w-100 mt-4"
                disabled={loading === 'pending'}
              >
                {loading === 'pending' ? 'Вход...' : 'Войти'}
              </Button>
            </Form>

            {/* Quick login buttons for developer */}
            <div className="mt-3">
              <Button
                variant="secondary"
                onClick={() => handleQuickLogin('kirill', 'kirill')}
                className="w-100 mb-2"
              >
                Быстрый вход: kirill / kirill
              </Button>
              <Button
                variant="secondary"
                onClick={() => handleQuickLogin('admin', 'admin')}
                className="w-100"
              >
                Быстрый вход: admin / admin
              </Button>
            </div>
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default LoginPage;
