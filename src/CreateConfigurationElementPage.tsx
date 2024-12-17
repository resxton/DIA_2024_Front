import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Form, Container, Alert, Row, Col, Dropdown } from 'react-bootstrap';
import { api } from './api';
import { ROUTES } from './Routes';
import { ConfigurationElement } from './api/Api';
import CustomNavbar from './components/CustomNavbar';
import { RootState } from './redux/store';
import { useSelector } from 'react-redux';
import { BreadCrumbs } from './components/BreadCrumbs';

const CreateConfigurationElementPage = () => {
  const navigate = useNavigate();
  const { isAuthenticated, user } = useSelector((state: RootState) => state.auth);

  const categories = [
    'Компоновка салона',
    'Дизайн салона',
    'Авионика',
    'Двигатель',
    'Кресло',
  ];

  const [formData, setFormData] = useState<Partial<ConfigurationElement>>({
    name: '',
    price: 0,
    key_info: '',
    category: '',
    image: '',
    detail_text: '',
    is_deleted: false,
  });
  const [error, setError] = useState<string | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleCategorySelect = (category: string) => {
    setFormData({
      ...formData,
      category,
    });
  };

  useEffect(() => {
    if (!isAuthenticated) {
      navigate(ROUTES.PAGE_403); // Предполагается, что "/" — это ROUTES.HOME
    }
  }, [isAuthenticated, navigate]);

  const handleSubmit = async () => {
    try {
      // Создаем объект ConfigurationElement
      const configurationElementData: ConfigurationElement= {
		pk: 0,
        name: formData.name || '',
        price: formData.price || 0,
        key_info: formData.key_info || '',
        category: formData.category || '',
        image: '', // URL изображения будет обновлен отдельно
        detail_text: formData.detail_text || '',
        is_deleted: false,
      };

      // Отправляем основной объект без изображения
      const response = await api.planeConfigurationElements.planeConfigurationElementsCreate(
        configurationElementData
      );
	  console.log(response.data)

      alert('Элемент успешно создан!');
      navigate(ROUTES.ELEMENTS);
    } catch (error) {
      console.error(error);
      setError('Ошибка при создании элемента.');
    }
  };

  return (
    <Container fluid className="mt-4">
      <CustomNavbar isAuthenticated={isAuthenticated} user={user} />
      <BreadCrumbs
        crumbs={[
          { label: 'Элементы', path: ROUTES.ELEMENTS },
          { label: 'Создать элемент', path: '' },
        ]}
      />
      <h2 className='m-4'>Создать новый элемент конфигурации</h2>
      {error && <Alert variant="danger">{error}</Alert>}
      <Form className="m-4">
        <Row>
          <Col md={6}>
            <Form.Group controlId="name">
              <Form.Label>Наименование</Form.Label>
              <Form.Control
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="Введите наименование"
              />
            </Form.Group>
          </Col>
          <Col md={6}>
            <Form.Group controlId="price">
              <Form.Label>Цена</Form.Label>
              <Form.Control
                type="number"
                name="price"
                value={formData.price}
                onChange={handleInputChange}
                placeholder="Введите цену"
              />
            </Form.Group>
          </Col>
        </Row>

        <Row className="mt-3">
          <Col md={6}>
            <Form.Group controlId="key_info">
              <Form.Label>Основная информация</Form.Label>
              <Form.Control
                type="text"
                name="key_info"
                value={formData.key_info}
                onChange={handleInputChange}
                placeholder="Введите основную информацию"
              />
            </Form.Group>
          </Col>
          <Col md={6}>
            <Form.Group controlId="category">
              <Form.Label>Категория</Form.Label>
              <Dropdown>
                <Dropdown.Toggle variant="outline-secondary">
                  {formData.category || 'Выберите категорию'}
                </Dropdown.Toggle>
                <Dropdown.Menu>
                  {categories.map((category) => (
                    <Dropdown.Item
                      key={category}
                      onClick={() => handleCategorySelect(category)}
                    >
                      {category}
                    </Dropdown.Item>
                  ))}
                </Dropdown.Menu>
              </Dropdown>
            </Form.Group>
          </Col>
        </Row>

        <Form.Group controlId="detail_text" className="mt-3">
          <Form.Label>Подробное описание</Form.Label>
          <Form.Control
            as="textarea"
            rows={3}
            name="detail_text"
            value={formData.detail_text}
            onChange={handleInputChange}
            placeholder="Введите подробное описание"
          />
        </Form.Group>

        <div className="mt-4 d-flex justify-content-between">
          <Button variant="primary" onClick={handleSubmit}>
            Создать элемент
          </Button>
          <Button variant="secondary" onClick={() => navigate(ROUTES.ELEMENTS_TABLE)}>
            Отмена
          </Button>
        </div>
      </Form>
    </Container>
  );
};

export default CreateConfigurationElementPage;
