import { FC, useState, useEffect } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import { Container, Button, Row, Col, Spinner, Card, Form } from 'react-bootstrap';
import { api } from './api';
import { BreadCrumbs } from './components/BreadCrumbs';
import { ROUTES, ROUTE_LABELS } from './Routes';
import { PlaneConfigurationResponse, ConfigurationElement } from './api/Api';
import defaultImage from './assets/Default.jpeg';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from './redux/store';
import { logout } from './redux/authSlice';
import CustomNavbar from './components/CustomNavbar';
import ElementCard from './components/ElementCard';  // Import ElementCard component
import './ConfigurationPage.css';

const ConfigurationPage: FC = () => {
  const { id } = useParams(); // Get configuration ID from the URL
  const [configuration, setConfiguration] = useState<PlaneConfigurationResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const location = useLocation();
  const dispatch = useDispatch();

  // Access authentication state from Redux store
  const { isAuthenticated, user } = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    if (!id) return;

    api.planeConfiguration
      .planeConfigurationRead(id)
      .then((response) => {
        const data = response.data as PlaneConfigurationResponse;
        setConfiguration(data);
      })
      .catch((error) => {
        console.error('Ошибка при загрузке конфигурации:', error);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [id]);

  const handleSubmit = () => {
    console.log('Заявка оформлена');
  };

  const handleDeleteElement = (elementId: number) => {
    console.log('Удален элемент с id:', elementId);
  };

  const handleUpdateQuantity = (elementId: number, action: 'increment' | 'decrement') => {
    console.log(`Изменить количество элемента с id: ${elementId}, действие: ${action}`);
  };

  if (loading) {
    return <Spinner animation="border" role="status" variant="light" />;
  }

  return (
    <div className="configuration-page">
      <CustomNavbar 
        isAuthenticated={isAuthenticated} 
        user={user} 
        onLogout={() => dispatch(logout())}
      />

      <BreadCrumbs
        crumbs={[
          { label: ROUTE_LABELS.ELEMENTS, path: ROUTES.ELEMENTS },
          { label: `Заявка #${id}`, path: `/configuration/${id}` },
        ]}
      />

      <Container fluid className="mt-4 w-75">
        <h2 className="mb-4">Конфигурация</h2>

        {configuration ? (
          <>
            <Col xs={12} md={6}>
              <Card className="mb-4">
                <Card.Body>
                  <Card.Title>Данные конфигурации</Card.Title>
                  <Form>
                    <Row>
                      <Col md={6}>
                        <Form.Group className="mb-3">
                          <Form.Label>Status</Form.Label>
                          <Form.Control type="text" value={configuration.configuration.status} disabled />
                        </Form.Group>
                      </Col>
                      <Col md={6}>
                        <Form.Group className="mb-3">
                          <Form.Label>Creation Date</Form.Label>
                          <Form.Control type="text" value={configuration.configuration.created_at} disabled />
                        </Form.Group>
                      </Col>
                    </Row>

                    <Row>
                      <Col md={6}>
                        <Form.Group className="mb-3">
                          <Form.Label>Update Date</Form.Label>
                          <Form.Control type="text" value={configuration.configuration.updated_at || ""} disabled />
                        </Form.Group>
                      </Col>
                      <Col md={6}>
                        <Form.Group className="mb-3">
                          <Form.Label>Completion Date</Form.Label>
                          <Form.Control type="text" value={configuration.configuration.completed_at || ""} disabled />
                        </Form.Group>
                      </Col>
                    </Row>

                    <Row>
                      <Col md={6}>
                        <Form.Group className="mb-3">
                          <Form.Label>Customer Name</Form.Label>
                          <Form.Control type="text" value={configuration.configuration.customer_name || ""} disabled/>
                        </Form.Group>
                      </Col>
                      <Col md={6}>
                        <Form.Group className="mb-3">
                          <Form.Label>Customer Phone</Form.Label>
                          <Form.Control type="text" value={configuration.configuration.customer_phone || ""} disabled/>
                        </Form.Group>
                      </Col>
                    </Row>

                    <Row>
                      <Col md={6}>
                        <Form.Group className="mb-3">
                          <Form.Label>Customer Email</Form.Label>
                          <Form.Control type="email" value={configuration.configuration.customer_email || ""} disabled/>
                        </Form.Group>
                      </Col>
                      <Col md={6}>
                        <Form.Group className="mb-3">
                          <Form.Label>Total Price</Form.Label>
                          <Form.Control type="text" value={`$ ${configuration.configuration.total_price }`} disabled />
                        </Form.Group>
                      </Col>
                    </Row>
                  </Form>
                </Card.Body>
              </Card>

              {configuration.configuration_elements.length > 0 ? (
                <div>
                  {configuration.configuration_elements.map((element: ConfigurationElement) => (
                    <Row className="mb-4 d-flex align-items-center">
                      <Col xs={12} md={10}>
                        <ElementCard 
                          id={element.pk}
                          name={element.name}
                          price={element.price}
                          category={element.category}
                          image={element.image}
                          detail_text={element.detail_text}
                          onAddToDraft={() => {}}
                          showAddButton={false}
                        />
                      </Col>
                      <Col xs={12} md={2} className="d-flex justify-content-between gap-2">
                        <Button variant="outline-secondary" onClick={() => handleUpdateQuantity(element.pk, 'decrement')}>-</Button>
                        <Button variant="outline-secondary" onClick={() => handleUpdateQuantity(element.pk, 'increment')}>+</Button>
                        <Button variant="outline-danger" onClick={() => handleDeleteElement(element.pk)}>Удалить</Button>
                      </Col>
                    </Row>
                  ))}
                </div> 
              ) : (
                <p>Нет элементов в конфигурации.</p>
              )}
            </Col>

            <Button variant="primary" onClick={handleSubmit}>Оформить заявку</Button>
          </>
        ) : (
          <p>Конфигурация не найдена.</p>
        )}
      </Container>
    </div>
  );
};

export default ConfigurationPage;
