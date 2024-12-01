import { FC, useState } from 'react';
import { Form, Button, Container, Row, Col, Alert } from 'react-bootstrap';
import { BreadCrumbs } from './components/BreadCrumbs';
import { ROUTES, ROUTE_LABELS } from './Routes';
import { api } from './api';

const RegisterPage: FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState<string | null>(null); // Состояние для ошибки

  const handleRegister = async () => {
    if (password !== confirmPassword) {
      setError('Пароли не совпадают');
      return;
    }

    try {
      // Пытаемся создать пользователя через API
      const userData = { username, password };
      await api.user.userCreate(userData);

      // Если регистрация прошла успешно
      alert('Регистрация прошла успешно!');
      setError(null); 
    } catch (error) {
      // Если ошибка при создании пользователя
      setError('Ошибка регистрации. Попробуйте снова.');
    }
  };

  return (
    <Container fluid className="d-flex justify-content-center align-items-center min-vh-100">
      <Row className="w-100">
        <BreadCrumbs
          crumbs={[
            { label: ROUTE_LABELS.REGISTER, path: ROUTES.REGISTER }
          ]}
        />
        <Col xs={12} sm={8} md={6} lg={4} className="mx-auto">
          <div className="auth-container p-4 border rounded shadow">
            <h2 className="text-center mb-4">Регистрация</h2>
            {error && <Alert variant="danger" className="mb-4">{error}</Alert>} {/* Отклик на ошибку */}
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

              <Form.Group controlId="formConfirmPassword" className="mt-3">
                <Form.Label>Подтвердите пароль</Form.Label>
                <Form.Control 
                  type="password" 
                  placeholder="Подтвердите пароль" 
                  value={confirmPassword} 
                  onChange={(e) => setConfirmPassword(e.target.value)} 
                />
              </Form.Group>

              <Button variant="primary" onClick={handleRegister} className="w-100 mt-4">
                Зарегистрироваться
              </Button>
            </Form>
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default RegisterPage;
