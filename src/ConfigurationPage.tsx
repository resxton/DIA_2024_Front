import { FC, useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Container, Button, Row, Col, Spinner, Card, Form } from 'react-bootstrap';
import { api } from './api';
import { BreadCrumbs } from './components/BreadCrumbs';
import { ROUTES, ROUTE_LABELS } from './Routes';
import { PlaneConfigurationResponse, ConfigurationElement, Configuration } from './api/Api';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from './redux/store';
import CustomNavbar from './components/CustomNavbar';
import './ConfigurationPage.css';
import { clearDraft } from './redux/configurationElementsSlice';
import defaultImage from './assets/Default.jpeg';
import { confirmConfiguration, deleteConfiguration, deleteElement, fetchConfiguration, updateConfiguration, updateElementCount } from './redux/configurationSlice';


const ConfigurationPage: FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { configuration, loading, error } = useSelector((state: RootState) => state.configuration);
  const { isAuthenticated, user } = useSelector((state: RootState) => state.auth);


  const [customerName, setCustomerName] = useState(configuration?.configuration.customer_name || '');
  const [customerPhone, setCustomerPhone] = useState(configuration?.configuration.customer_phone || '');
  const [customerEmail, setCustomerEmail] = useState(configuration?.configuration.customer_email || '');


  useEffect(() => {
    if (id) {
      dispatch(fetchConfiguration(Number(id)) as any);
    }
  }, [id, dispatch]);

  useEffect(() => {
    if (configuration) {
      setCustomerName(configuration.configuration.customer_name || '');
      setCustomerPhone(configuration.configuration.customer_phone || '');
      setCustomerEmail(configuration.configuration.customer_email || '');
    }
  }, [configuration]);
  

  useEffect(() => {
    if (!isAuthenticated) {
      navigate(ROUTES.PAGE_403);
    }
  }, [isAuthenticated, navigate]);

  const handleDeleteElement = (elementId: number) => {
    if (configuration) {
      dispatch(deleteElement({ configurationId: configuration.configuration.pk, elementId }) as any);
    }
  };

  const handleUpdateQuantity = (elementId: number, action: 'increment' | 'decrement') => {
    if (!configuration || !configuration.counts) return;
  
    // Получаем текущее количество из объекта counts по элементу
    const currentCount = configuration.counts[elementId];
  
    // Если текущее количество существует, обновляем его
    const newCount = currentCount !== undefined
      ? (action === 'increment' ? currentCount + 1 : currentCount - 1)
      : 1; // Если количество не задано, инициализируем его как 1
  
    // Отправляем обновленное количество в запрос
    dispatch(updateElementCount({ configurationId: configuration.configuration.pk, elementId, count: newCount }) as any);
  };
  

// Обработчик для подтверждения конфигурации
const handleConfirmConfiguration = () => {
  if (!id) return;

  dispatch(confirmConfiguration(id) as any)
    .then(() => {
      navigate(ROUTES.ELEMENTS);
    })
    .catch((error: any) => {
      console.error('Ошибка при подтверждении конфигурации:', error);
    });
};

const handleEditConfiguration = () => {
  if (!id || !configuration) return;

  console.log(customerName, customerEmail, customerPhone)
  const updatedConfiguration = {
    ...configuration.configuration,
    customer_name: customerName,
    customer_phone: customerPhone,
    customer_email: customerEmail,
  };

  dispatch(updateConfiguration({ configurationId: id, updatedConfiguration }) as any)
    .then(() => {
      // navigate(ROUTES.ELEMENTS);
    })
    .catch((error: any) => {
      console.error('Ошибка при обновлении конфигурации:', error);
    });
};

const handleDeleteConfiguration = () => {
  if (!id) return;

  dispatch(deleteConfiguration(id) as any)
    .then(() => {
      alert('Конфигурация успешно удалена');
      navigate(ROUTES.ELEMENTS);
    })
    .catch((error: any) => {
      console.error('Ошибка при удалении конфигурации:', error);
      alert('Не удалось удалить конфигурацию');
    });
};

  if (loading) {
    return <Spinner animation="border" role="status" variant="light" />;
  }

  if (error) {
    return <div>{error}</div>;
  }

  // Функция для преобразования даты
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);

    // Форматирование числа, месяца словами и времени
    const formatter = new Intl.DateTimeFormat("ru-RU", {
      day: "numeric",
      month: "long",
      hour: "2-digit",
      minute: "2-digit",
    });

    // Приводим первый символ месяца к заглавной букве
    const formattedDate = formatter.format(date).replace(/^[а-я]/, (c) => c.toUpperCase());

    return formattedDate;
  };

  return (
    <div className="configuration-page">
      <CustomNavbar 
        isAuthenticated={isAuthenticated} 
        user={user} 
      />

      <BreadCrumbs
        crumbs={[
          { label: ROUTE_LABELS.CONFIGURATIONS, path: ROUTES.CONFIGURATIONS },
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
                  {configuration.configuration.status === 'draft' ?  (
                    <Form>
                    <Row>
                      <Col md={6}>
                        <Form.Group className="mb-3">
                          <Form.Label>Самолет</Form.Label>
                          <Form.Control type="text" value={configuration.configuration.plane ?? "Global 7500"} />
                        </Form.Group>
                      </Col>
                      <Col md={6}>
                        <Form.Group className="mb-3">
                          <Form.Label>Дата создания</Form.Label>
                          <Form.Control type="text" value={formatDate(configuration.configuration.created_at || "")} disabled />
                        </Form.Group>
                      </Col>
                    </Row>

                    <Row>
                      <Col md={6}>
                        <Form.Group className="mb-3">
                          <Form.Label>Покупатель</Form.Label>
                          <Form.Control
                            type="text"
                            value={customerName}
                            onChange={(e) => setCustomerName(e.target.value)}
                          />
                        </Form.Group>
                      </Col>
                      <Col md={6}>
                        <Form.Group className="mb-3">
                          <Form.Label>Номер телефона</Form.Label>
                          <Form.Control
                            type="text"
                            value={customerPhone}
                            onChange={(e) => setCustomerPhone(e.target.value)}
                          />
                        </Form.Group>
                      </Col>
                    </Row>

                    <Row>
                      <Col md={6}>
                        <Form.Group className="mb-3">
                          <Form.Label>Email</Form.Label>
                          <Form.Control
                            type="email"
                            value={customerEmail}
                            onChange={(e) => setCustomerEmail(e.target.value)}
                          />
                        </Form.Group>
                      </Col>
                      <Col md={6}>
                        <Form.Group className="mb-3">
                          <Form.Label>Итоговая стоимость</Form.Label>
                          <Form.Control type="text" value="Будет рассчитано позже" disabled />
                        </Form.Group>
                      </Col>
                    </Row>
                    </Form>
                  ) : (
                    <Form>
                    <Row>
                      <Col md={6}>
                        <Form.Group className="mb-3">
                          <Form.Label>Самолет</Form.Label>
                          <Form.Control type="text" value={configuration.configuration.plane ?? "Global 7500"} disabled />
                        </Form.Group>
                      </Col>
                      <Col md={6}>
                        <Form.Group className="mb-3">
                          <Form.Label>Дата создания</Form.Label>
                          <Form.Control type="text" value={formatDate(configuration.configuration.created_at || "")} disabled />
                        </Form.Group>
                      </Col>
                    </Row>

                    <Row>
                      <Col md={6}>
                        <Form.Group className="mb-3">
                          <Form.Label>Покупатель</Form.Label>
                          <Form.Control 
                            type="text" 
                            value={customerName}
                            onChange={(e) => setCustomerName(e.target.value)}
                            disabled
                          />
                        </Form.Group>
                      </Col>
                      <Col md={6}>
                        <Form.Group className="mb-3">
                          <Form.Label>Номер телефона</Form.Label>
                          <Form.Control
                            type="text"
                            value={customerPhone}
                            onChange={(e) => setCustomerPhone(e.target.value)}
                            disabled
                          />
                        </Form.Group>
                      </Col>
                    </Row>

                    <Row>
                      <Col md={6}>
                        <Form.Group className="mb-3">
                          <Form.Label>Email</Form.Label>
                          <Form.Control
                            type="email"
                            value={customerEmail}
                            onChange={(e) => setCustomerEmail(e.target.value)}
                            disabled
                          />
                        </Form.Group>
                      </Col>
                      <Col md={6}>
                        <Form.Group className="mb-3">
                          <Form.Label>Итоговая стоимость</Form.Label>
                          <Form.Control type="text" value={`$ ${configuration.configuration.total_price}`} disabled />
                        </Form.Group>
                      </Col>
                    </Row>
                    </Form>
                  )}
                </Card.Body>
              </Card>

              {configuration.configuration_elements.length > 0 ? (
                <div>
                  {configuration.configuration_elements.map((element: ConfigurationElement, index: number) => (
                    <Card key={element.pk} className="mb-3 shadow-sm">
                      <Card.Body style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        {/* Используем image из элемента */}
                        <div style={{ flex: '0 0 100px', marginRight: '10px', textAlign: 'center' }}>
                          <img
                            src={element.image || defaultImage}
                            alt={element.name}
                            style={{ width: '100px', height: '100px', objectFit: 'cover', borderRadius: '5px' }}
                          />
                        </div>
                        <div style={{ flex: '1', textAlign: 'center', marginRight: '10px' }}>
                          <p style={{ margin: '0', fontWeight: 'bold' }}>{element.name}</p>
                        </div>
                        <div style={{ flex: '0 0 100px', textAlign: 'center', marginRight: '10px' }}>
                          <p style={{ margin: '0' }}>${element.price}</p>
                        </div>
                        <div style={{ flex: '1', textAlign: 'center', marginRight: '10px' }}>
                          <p style={{ margin: '0' }}>{element.category}</p>
                        </div>
                        <div style={{ flex: '1', textAlign: 'center', marginRight: '10px' }}>
                          <p style={{ margin: '0' }}>{element.key_info}</p>
                        </div>
                        <div style={{ display: 'flex', gap: '12px', flexShrink: 0, alignItems: 'center' }}>
                          {configuration.configuration.status === 'draft' ? (
                            <>
                              {/* Кнопка уменьшения количества */}
                              <Button 
                                variant="outline-secondary" 
                                onClick={() => handleUpdateQuantity(element.pk, 'decrement')}
                                size="sm"
                                className="quantity-btn"
                                style={{ padding: '0.5rem 1rem', fontSize: '1.2rem' }}
                              >
                                -
                              </Button>

                              {/* Отображение количества */}
                              <span className="badge text-black px-3 py-2 fs-5" style={{ minWidth: '50px', textAlign: 'center' }}>
                                {configuration.counts[element.pk] || 0}
                              </span>

                              {/* Кнопка увеличения количества */}
                              <Button 
                                variant="outline-secondary" 
                                onClick={() => handleUpdateQuantity(element.pk, 'increment')}
                                size="sm"
                                className="quantity-btn"
                                style={{ padding: '0.5rem 1rem', fontSize: '1.2rem' }}
                              >
                                +
                              </Button>
                            </>
                          ) : (
                            // Когда статус не "draft", только отображение количества
                            <span className="badge text-black px-3 py-2 fs-5" style={{ minWidth: '50px', textAlign: 'center' }}>
                              {configuration.counts[element.pk] || 0}
                            </span>
                          )}
                          <Button 
                            variant="danger" 
                            onClick={() => handleDeleteElement(element.pk)}
                            size="sm"
                            style={{ padding: '0.5rem 1rem', fontSize: '1.2rem' }}
                          >
                            Удалить
                          </Button>
                        </div>
                      </Card.Body>
                    </Card>
                  ))}
                </div>
              ) : (
                <p>Нет элементов в конфигурации.</p>
              )}
            </Col>

            {configuration && configuration.configuration.status === 'draft' && (
              <div>
                <Button variant="primary" onClick={handleConfirmConfiguration} className="m-2">Подтвердить конфигурацию</Button>
                <Button variant="warning" onClick={handleEditConfiguration} className="m-2">Изменить конфигурацию</Button>
                <Button variant="danger" onClick={handleDeleteConfiguration} className="m-2">Удалить конфигурацию</Button>
              </div>
            )}

          </>
        ) : (
          <p>Конфигурация не найдена.</p>
        )}
      </Container>

      
    </div>
  );
};

export default ConfigurationPage;
