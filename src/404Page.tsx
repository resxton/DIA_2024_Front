import React from 'react';
import { Container, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

const NotFoundPage = () => {
  const navigate = useNavigate();

  return (
    <Container className="mt-5 text-center">
      <h1>404 - Страница не найдена</h1>
      <p>Извините, мы не можем найти эту страницу.</p>
      <Button variant="primary" onClick={() => navigate('/')}>
        Вернуться на главную
      </Button>
    </Container>
  );
};

export default NotFoundPage;
