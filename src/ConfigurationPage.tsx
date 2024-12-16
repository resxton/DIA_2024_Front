import { FC, useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Container, Button, Row, Col, Spinner, Card, Form } from 'react-bootstrap';
import { api } from './api';
import { BreadCrumbs } from './components/BreadCrumbs';
import { ROUTES, ROUTE_LABELS } from './Routes';
import { PlaneConfigurationResponse, ConfigurationElement, Configuration } from './api/Api';
import { useSelector, useDispatch } from 'react-redux';
import { AppDispatch, RootState } from './redux/store';
import CustomNavbar from './components/CustomNavbar';
import './ConfigurationPage.css';
import CartElementCard from './components/CartElementCard';

const ConfigurationPage: FC = () => {
  const { id } = useParams(); // Get configuration ID from the URL
  const [configuration, setConfiguration] = useState<PlaneConfigurationResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [customerPhone, setCustomerPhone] = useState<string>('');
  const [customerName, setCustomerName] = useState<string>('');
  const [customerEmail, setCustomerEmail] = useState<string>('');
  const [configurationStatus, setConfigurationStatus] = useState<string>('');
  const dispatch: AppDispatch = useDispatch(); // Типизируем dispatch
  const navigate = useNavigate();  // Инициализируем navigate
  const [error, setError] = useState('');

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
        if (error.response && error.response.status === 403) {
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
    if (!configuration || !Array.isArray(configuration.counts)) return;  // Проверка на наличие и корректность типа
  
    const updatedCounts = [...configuration.counts];
    const elementIndex = configuration.configuration_elements.findIndex(
      (element) => element.pk === elementId
    );
  
    if (elementIndex !== -1) {
      let newCount = action === 'increment' ? updatedCounts[elementIndex] + 1 : updatedCounts[elementIndex] - 1;
  
      // Если количество уменьшилось до 0, вызываем удаление
      if (newCount <= 0) {
        api.configurationMap.configurationMapDelete(configuration.configuration.pk, elementId)
          .then(() => {
            updatedCounts[elementIndex] = 0; // Обновляем количество в локальном состоянии
            window.location.reload(); // Перезагружаем страницу после удаления
          })
          .catch((error) => {
            console.error('Ошибка при удалении элемента:', error);
          });
      } else {
        // Если количество больше 0, просто обновляем
        updatedCounts[elementIndex] = newCount;
  
        // Вызов API для обновления количества
        api.configurationMap.configurationMapUpdate({ count: newCount }, configuration.configuration.pk, elementId)
          .then(() => {
            window.location.reload();  // Перезагружаем страницу после обновления
          })
          .catch((error) => {
            console.error('Ошибка при обновлении количества:', error);
          });
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
        // Редирект на страницу с элементами
        navigate(ROUTES.ELEMENTS);  // Переход к роуту /elements (или другой путь, если нужно)

        // Здесь можно добавить уведомление об успешном удалении
        alert('Конфигурация успешно удалена.');
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
                          <Form.Label>Статус</Form.Label>
                          <Form.Control type="text" value={getHumanReadableStatus(configuration.configuration.status)} disabled />
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
                          <Form.Label>Статус</Form.Label>
                          <Form.Control type="text" value={getHumanReadableStatus(configuration.configuration.status)} disabled />
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
                    <Row key={element.pk} className="mb-4 align-items-center">
                    {/* Карточка элемента */}
                    {configuration.configuration.status !== 'draft' ? (
                      <Col xs={12} md={10} className="mb-3">
                        <CartElementCard 
                          id={element.pk}
                          name={element.name}
                          price={element.price}
                          category={element.category}
                          image={element.image}
                        />
                      </Col>
                    ) : (
                      <Col xs={12} md={9} className="mb-3">
                        <CartElementCard 
                          id={element.pk}
                          name={element.name}
                          price={element.price}
                          category={element.category}
                          image={element.image}
                        />
                      </Col>
                    )}


                    {/* Блок управления количеством */}
                      {configuration.configuration.status === 'draft' ?  (
                        <Col xs={12} md={3} className="d-flex flex-column align-items-start justify-content-center ps-md-5">
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
                            onClick={() => handleDeleteElement(element.pk)}
                            className="mt-3 w-100"
                            size="lg"
                          >
                            Удалить
                          </Button>
                        </Col>
                      ) : 
                      <Col xs={12} md={2} className="d-flex flex-column align-items-center justify-content-center ps-md-5">
                        <div className="d-flex align-items-center justify-content-center p-3 border rounded shadow-sm bg-light w-100">
                          {/* Отображение количества */}
                          <span className="badge text-black px-2 py-3 fs-5">
                            {configuration.counts[index] || 0}
                          </span>
                        </div>
                      </Col>
                      }
                  </Row>                                    
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
