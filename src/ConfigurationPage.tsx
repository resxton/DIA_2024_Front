import { FC, useState, useEffect } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import { Container, Button, Row, Col, Spinner, Card, Form, Modal } from 'react-bootstrap';
import { api } from './api';
import { BreadCrumbs } from './components/BreadCrumbs';
import { ROUTES, ROUTE_LABELS } from './Routes';
import { PlaneConfigurationResponse, ConfigurationElement } from './api/Api';
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
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [elementToDelete, setElementToDelete] = useState<number | null>(null);
  const [action, setAction] = useState<'increment' | 'decrement' | null>(null);
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

  useEffect(() => {
    if (!id) return;
  
    api.planeConfiguration
      .planeConfigurationRead(id)
      .then((response) => {
        const data = response.data as PlaneConfigurationResponse;
        console.log('Полученные данные:', data);
  
        // Преобразуем counts в массив, если это объект
        if (data.counts && typeof data.counts === 'object') {
          data.counts = Object.values(data.counts); // Преобразуем объект в массив
        }
  
        setConfiguration(data);
      })
      .catch((error) => {
        console.error('Ошибка при загрузке конфигурации:', error);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [id]);
  
  
  
  const handleUpdateQuantity = (elementId: number, action: 'increment' | 'decrement') => {
    if (!configuration || !Array.isArray(configuration.counts)) return;  // Проверка на наличие и корректность типа
  
    const updatedCounts = [...configuration.counts];
    const elementIndex = configuration.configuration_elements.findIndex(
      (element) => element.pk === elementId
    );
  
    if (elementIndex !== -1) {
      const newCount = action === 'increment' ? updatedCounts[elementIndex] + 1 : updatedCounts[elementIndex] - 1;
  
      // Вызов API для обновления количества
      api.configurationMap.configurationMapUpdate({ count: newCount }, configuration.configuration.pk, elementId)
        .then(() => {
          updatedCounts[elementIndex] = newCount;  // Обновляем локально
          window.location.reload();  // Перезагружаем страницу
        })
        .catch((error) => {
          console.error('Ошибка при обновлении количества:', error);
        });
    }
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
          { label: `Конфигурация #${id}`, path: `/configuration/${id}` },
        ]}
      />

      <Container fluid className="mt-4 w-75 mb-4">
        <h2 className="mb-4">Конфигурация</h2>

        {configuration ? (
          <>
            <Col xs={12} md={10}>
              <Card className="mb-4">
                <Card.Body>
                  <Card.Title>Данные конфигурации</Card.Title>
                  <Form>
                    <Row>
                      <Col md={6}>
                        <Form.Group className="mb-3">
                          <Form.Label>Статус</Form.Label>
                          <Form.Control type="text" value={configuration.configuration.status} disabled />
                        </Form.Group>
                      </Col>
                      <Col md={6}>
                        <Form.Group className="mb-3">
                          <Form.Label>Дата создания</Form.Label>
                          <Form.Control type="text" value={configuration.configuration.created_at} disabled />
                        </Form.Group>
                      </Col>
                    </Row>

                    <Row>
                      <Col md={6}>
                        <Form.Group className="mb-3">
                          <Form.Label>Дата оформления</Form.Label>
                          <Form.Control type="text" value={configuration.configuration.updated_at || ""} disabled />
                        </Form.Group>
                      </Col>
                      <Col md={6}>
                        <Form.Group className="mb-3">
                          <Form.Label>Дата завершения</Form.Label>
                          <Form.Control type="text" value={configuration.configuration.completed_at || ""} disabled />
                        </Form.Group>
                      </Col>
                    </Row>

                    <Row>
                      <Col md={6}>
                        <Form.Group className="mb-3">
                          <Form.Label>Покупатель</Form.Label>
                          <Form.Control type="text" value={configuration.configuration.customer_name || ""} disabled/>
                        </Form.Group>
                      </Col>
                      <Col md={6}>
                        <Form.Group className="mb-3">
                          <Form.Label>Номер телефона</Form.Label>
                          <Form.Control type="text" value={configuration.configuration.customer_phone || ""} disabled/>
                        </Form.Group>
                      </Col>
                    </Row>

                    <Row>
                      <Col md={6}>
                        <Form.Group className="mb-3">
                          <Form.Label>Email</Form.Label>
                          <Form.Control type="email" value={configuration.configuration.customer_email || ""} disabled/>
                        </Form.Group>
                      </Col>
                      <Col md={6}>
                        <Form.Group className="mb-3">
                          <Form.Label>Итоговая стоимость</Form.Label>
                          <Form.Control type="text" value={`$ ${configuration.configuration.total_price }`} disabled />
                        </Form.Group>
                      </Col>
                    </Row>
                  </Form>
                </Card.Body>
              </Card>

              {configuration.configuration_elements.length > 0 ? (
                <div>
                  {configuration.configuration_elements.map((element: ConfigurationElement, index: number) => (
                    <Row key={element.pk} className="mb-4 align-items-center">
                    {/* Карточка элемента */}
                    <Col xs={12} md={7} className="mb-3">
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
                  
                    {/* Блок управления количеством */}
                    <Col xs={12} md={4} className="d-flex flex-column align-items-start justify-content-center ps-md-5">
                      <div className="quantity-control d-flex align-items-center gap-3 p-3 border rounded shadow-sm bg-light w-100">
                        {/* Кнопка уменьшения количества */}
                        <Button 
                          variant="outline-secondary" 
                          onClick={() => handleUpdateQuantity(element.pk, 'decrement')}
                          size="lg"
                          className="quantity-btn"
                        >
                          -
                        </Button>
                  
                        {/* Отображение количества */}
                        <span className="badge text-black px-2 py-3 fs-5">
                          {configuration.counts[index] || 0}
                        </span>
                  
                        {/* Кнопка увеличения количества */}
                        <Button 
                          variant="outline-secondary" 
                          onClick={() => handleUpdateQuantity(element.pk, 'increment')}
                          size="lg"
                          className="quantity-btn"
                        >
                          +
                        </Button>
                      </div>
                  
                      {/* Кнопка удаления элемента */}
                      <Button 
                        variant="danger" 

                        className="mt-3 w-100"
                        size="lg"
                      >
                        Удалить
                      </Button>
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
