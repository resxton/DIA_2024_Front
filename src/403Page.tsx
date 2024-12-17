import { Container, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

const ForbiddenPage = () => {
  const navigate = useNavigate();

  return (
    <Container className="mt-5 text-center">
      <h1>403 - Forbidden</h1>
      <p>У вас нет прав для доступа к этому ресурсу.</p>
      <Button variant="primary" onClick={() => navigate('/')}>
        Вернуться на главную
      </Button>
    </Container>
  );
};

export default ForbiddenPage;
