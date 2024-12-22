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


const ConfigurationPage: FC = () => {
  const { id } = useParams(); 
  const [configuration, setConfiguration] = useState<PlaneConfigurationResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [customerPhone, setCustomerPhone] = useState<string>('');
  const [customerName, setCustomerName] = useState<string>('');
  const [customerEmail, setCustomerEmail] = useState<string>('');
  const [, setConfigurationStatus] = useState<string>('');
  const navigate = useNavigate();
  const dispatch = useDispatch()
  const [error, setError] = useState('');

  const { isAuthenticated, user } = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    if (!id) return;
  
    api.planeConfiguration
      .planeConfigurationRead(Number(id))
      .then((response) => {
        const data = response.data as PlaneConfigurationResponse;
        setConfiguration(data);
      })
      .catch((error) => {
        if (error.response && (error.response.status === 403) || (error.response.status === 401)){
          setError('403');
        } else if (error.response && error.response.status === 404) {
          setError('404');
        } else {
          setError('not_found');
        }
        console.error('Ошибка при загрузке конфигурации:', error);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [id]);

    // Редирект при изменении isAuthenticated
    useEffect(() => {
      if (!isAuthenticated) {
        navigate(ROUTES.PAGE_403); // Предполагается, что "/" — это ROUTES.HOME
      }
    }, [isAuthenticated, navigate]);
  

  useEffect(() => {
    if (!id) return;
  
    api.planeConfiguration
      .planeConfigurationRead(Number(id))
      .then((response) => {
        const data = response.data as PlaneConfigurationResponse;
        console.log('Полученные данные:', data);
  
        // Преобразуем counts в массив, если это объект
        if (data.counts && typeof data.counts === 'object') {
          data.counts = Object.values(data.counts); // Преобразуем объект в массив
        }
  
        setConfiguration(data);
        setCustomerEmail(data.configuration.customer_email || "")
        setCustomerName(data.configuration.customer_name || "")
        setCustomerPhone(data.configuration.customer_phone || "")
        setConfigurationStatus(data.configuration.status || "")
      })
      .catch((error) => {
        console.error('Ошибка при загрузке конфигурации:', error);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [id]);

  if (error === '403') {
    navigate('/403')
  }

  if (error === '404') {
    navigate('/404')
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

  // Определение типов для статусов
  type ServerStatus = 'draft' | 'deleted' | 'created' | 'completed' | 'rejected';
  type HumanReadableStatus = 'Черновик' | 'Удалена' | 'Сформирована' | 'Завершена' | 'Отклонена';

  // Объект сопоставления статусов
  const statusMap: Record<ServerStatus, HumanReadableStatus> = {
    draft: 'Черновик',
    deleted: 'Удалена',
    created: 'Сформирована',
    completed: 'Завершена',
    rejected: 'Отклонена',
  };

  // Функция для преобразования статуса
  const getHumanReadableStatus = (serverStatus: ServerStatus): HumanReadableStatus | 'Неизвестный статус' => {
    return statusMap[serverStatus] || 'Неизвестный статус';
  };


  const handleUpdateQuantity = (elementId: number, action: 'increment' | 'decrement') => {
    if (!configuration || !Array.isArray(configuration.counts)) return;
  
    const elementIndex = configuration.configuration_elements.findIndex(
      (element) => element.pk === elementId
    );
  
    if (elementIndex !== -1) {
      const updatedCounts = [...configuration.counts];
      const newCount = action === 'increment' 
        ? updatedCounts[elementIndex] + 1 
        : updatedCounts[elementIndex] - 1;
  
      if (newCount <= 0) {
        handleDeleteElement(elementId);
      } else {
        api.configurationMap.configurationMapUpdate(
          { count: newCount },
          configuration.configuration.pk,
          elementId
        )
          .then(() => {
            updatedCounts[elementIndex] = newCount;
            setConfiguration({
              ...configuration,
              counts: updatedCounts,
            });
          })
          .catch((error) => console.error('Ошибка при обновлении количества:', error));
      }
    }
  };
  
  

  const handleDeleteElement = (elementId: number) => {
    if (!configuration) return;  // Проверка на наличие конфигурации
  
    api.configurationMap.configurationMapDelete(configuration.configuration.pk, elementId)
      .then(() => {
        // Удаление элемента из локального состояния
        const updatedConfiguration = {
          ...configuration,
          configuration_elements: configuration.configuration_elements.filter(
            (element) => element.pk !== elementId
          ),
          counts: configuration.counts.filter((_, index) => index !== elementId), // Удаляем соответствующий элемент из counts
        };
  
        setConfiguration(updatedConfiguration); // Обновляем состояние
      })
      .catch((error) => {
        console.error('Ошибка при удалении элемента:', error);
      });
  };  


  const handleDeleteConfiguration = (configurationId: number) => {
    api.planeConfiguration.planeConfigurationDelete(configurationId)
      .then(() => {
        clearDraft()
        // Редирект на страницу с элементами
        navigate(ROUTES.ELEMENTS);  // Переход к роуту /elements (или другой путь, если нужно)
      })
      .catch((error) => {
        // Обрабатываем ошибку удаления
        console.error('Ошибка при удалении конфигурации:', error);
        alert('Не удалось удалить конфигурацию.');
      });
  };

  const handleSubmit = () => {
    if (!id || !configuration) return;

    api.planeConfiguration
      .planeConfigurationSubmitUpdate(id)
      .then(() => {
        alert('Заявка успешно оформлена');
        setLoading(false);
        navigate(ROUTES.ELEMENTS);  // Переход к роуту /elements (или другой путь, если нужно)
      })
      .catch((error) => {
        console.error('Ошибка при обновлении конфигурации:', error);
        alert('Не удалось обновить конфигурацию');
      });
  };


  const handleEditConfiguration = () => {
    if (!id || !configuration) return;

    const updatedConfiguration: Configuration = {
      ...configuration.configuration,
      customer_name: customerName,
      customer_phone: customerPhone,  // Обновленный номер телефона
      customer_email: customerEmail,  // Обновленный email
    };

    api.planeConfiguration
      .planeConfigurationUpdate(id, updatedConfiguration)  // Используем новый метод обновления
      .then(() => {
        alert('Заявка успешно изменена');
        setLoading(false);
      })
      .catch((error) => {
        console.error('Ошибка при изменении конфигурации:', error);
        alert('Не удалось изменить конфигурацию');
      });
};


  if (loading) {
    return <Spinner animation="border" role="status" variant="light" />;
  }

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
                                {configuration.counts[index] || 0}
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
                              {configuration.counts[index] || 0}
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

            {configuration.configuration.status === 'draft' && (
              <div>
                <Button variant="primary" onClick={handleSubmit} className="m-2">Подтвердить конфигурацию</Button>
                <Button variant="warning" onClick={() => handleEditConfiguration()} className="m-2">Изменить конфигурацию</Button>
                <Button variant="danger" onClick={() => handleDeleteConfiguration(configuration.configuration.pk)} className="m-2">Удалить конфигурацию</Button>
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
