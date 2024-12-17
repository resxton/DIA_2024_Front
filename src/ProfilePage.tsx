import { FC, useState } from 'react';
import { Form, Button, Alert, Container, Row, Col } from 'react-bootstrap';
import { BreadCrumbs } from './components/BreadCrumbs';
import { ROUTES, ROUTE_LABELS } from './Routes';
import { api } from './api';
import { User } from './api/Api';
import { useSelector } from 'react-redux';
import CustomNavbar from './components/CustomNavbar';

const ProfilePage: FC = () => {
  const [username, setUsername] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const { isAuthenticated, user } = useSelector((state: any) => state.auth);

  const userId = user?.id; // Получаем ID пользователя из стора, предполагая, что оно хранится там

  const handleProfileUpdate = async () => {
    if (!user || !user.token) {
      alert('Пользователь не авторизован');
      return;
    }

    const updatedData: User = {};

    // Добавляем только изменённые поля
    if (username?.trim()) updatedData.username = username.trim();
    if (firstName?.trim()) updatedData.first_name = firstName.trim();
    if (lastName?.trim()) updatedData.last_name = lastName.trim() || '';
    if (email?.trim()) updatedData.email = email.trim() || '';

    if (password && password.trim() !== '') {
      updatedData.password = password.trim();
    }

    // Если нет обновлённого пароля, не передаем его
    if (!updatedData.password) {
      delete updatedData.password;
    }

    if (!userId) {
      alert('Не указан ID пользователя');
      return;
    }

    try {
      const response = await api.user.userPartialUpdate(userId, updatedData, {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      });
      console.log(response.data)

      setSuccessMessage('Данные успешно обновлены');
    } catch (err) {
      console.error('Ошибка при обновлении данных', err);
      setError('Ошибка при обновлении данных');
    }
  };

  return (
    <Container fluid className="d-flex justify-content-center align-items-center min-vh-100">
      <Row className="w-100">
        <CustomNavbar isAuthenticated={isAuthenticated} user={user} />

        <BreadCrumbs
          crumbs={[
            { label: ROUTE_LABELS.USER_DASHBOARD, path: ROUTES.USER_DASHBOARD }
          ]}
        />
        <Col xs={12} sm={8} md={6} lg={4} className="mx-auto">
          <div className="auth-container p-4 border rounded shadow">
            <h2 className="text-center mb-4">Личный кабинет</h2>

            {/* Сообщение об успехе */}
            {successMessage && <Alert variant="success" className="mb-4">{successMessage}</Alert>}

            {/* Сообщение об ошибке */}
            {error && <Alert variant="danger" className="mb-4">{error}</Alert>}

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

              <Form.Group controlId="formFirstName" className="mt-3">
                <Form.Label>Имя</Form.Label>
                <Form.Control 
                  type="text" 
                  placeholder="Введите имя" 
                  value={firstName} 
                  onChange={(e) => setFirstName(e.target.value)} 
                />
              </Form.Group>

              <Form.Group controlId="formLastName" className="mt-3">
                <Form.Label>Фамилия</Form.Label>
                <Form.Control 
                  type="text" 
                  placeholder="Введите фамилию" 
                  value={lastName} 
                  onChange={(e) => setLastName(e.target.value)} 
                />
              </Form.Group>

              <Form.Group controlId="formEmail" className="mt-3">
                <Form.Label>Email</Form.Label>
                <Form.Control 
                  type="email" 
                  placeholder="Введите email" 
                  value={email} 
                  onChange={(e) => setEmail(e.target.value)} 
                />
              </Form.Group>

              <Form.Group controlId="formPassword" className="mt-3">
                <Form.Label>Новый пароль</Form.Label>
                <Form.Control 
                  type="password" 
                  placeholder="Введите новый пароль" 
                  value={password} 
                  onChange={(e) => setPassword(e.target.value)} 
                />
              </Form.Group>

              <Button variant="primary" onClick={handleProfileUpdate} className="w-100 mt-4">
                Обновить данные
              </Button>
            </Form>
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default ProfilePage;
