import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button, Form, Container, Alert, Row, Col, Image, Dropdown } from 'react-bootstrap';
import { ConfigurationElement } from './api/Api';
import { useDispatch, useSelector } from 'react-redux';
import { createConfigurationElement, clearError } from './redux/createElementSlice';
import { RootState } from './redux/store';
import CustomNavbar from './components/CustomNavbar';
import { BreadCrumbs } from './components/BreadCrumbs';
import { ROUTES, ROUTE_LABELS } from './Routes';

const CreateConfigurationElementPage = () => {
  const { id } = useParams();
  const [formData, setFormData] = useState<ConfigurationElement | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { isAuthenticated, user } = useSelector((state: RootState) => state.auth);
  const { loading, error } = useSelector((state: RootState) => state.createElement);

  const categories = [
    'Компоновка салона',
    'Дизайн салона',
    'Авионика',
    'Двигатель',
    'Кресло',
  ];

  useEffect(() => {
    if (!isAuthenticated) {
      navigate(ROUTES.PAGE_403);
    }
  }, [isAuthenticated, navigate]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData!,
      [name]: value,
    });
  };

  const handleCategorySelect = (category: string) => {
    setFormData({
      ...formData!,
      category,
    });
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
      setImageFile(file);
    }
  };

  const handleCreateNew = async () => {
    if (formData) {
      const { name, price, key_info, category, detail_text } = formData;
      if (!name || !price || !key_info || !category || !detail_text) {
        return; // Можно показать ошибку по аналогии с прошлым кодом
      }

      dispatch(createConfigurationElement({ formData, imageFile }) as any);
      if (!loading && !error) {
        navigate(ROUTES.ELEMENTS_TABLE);
      }
    }
  };

  if (loading) {
    return <div>Загрузка...</div>;
  }

  if (error) {
    return <Alert variant="danger">{error}</Alert>;
  }

  return (
    <Container fluid className="mt-4">
      <CustomNavbar isAuthenticated={isAuthenticated} user={user} />
      <BreadCrumbs
        crumbs={[
          { label: ROUTE_LABELS.ELEMENTS_TABLE, path: ROUTES.ELEMENTS_TABLE },
          { label: ROUTE_LABELS.EDIT_ELEMENT, path: ROUTES.EDIT_ELEMENT },
        ]}
      />
      <h2 className="mt-4 p-4">Редактировать элемент конфигурации</h2>
      <Form className="mt-3 p-4">
        {/* Все формы и элементы инпута */}
        <Row>
          <Col md={6}>
            <Form.Group controlId="name">
              <Form.Label>Наименование</Form.Label>
              <Form.Control
                type="text"
                name="name"
                value={formData?.name || ''}
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
                value={formData?.price || ''}
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
                value={formData?.key_info || ''}
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
                  {formData?.category || 'Выберите категорию'}
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

        <Form.Group controlId="image" className="mt-3">
          <Form.Label>Изображение</Form.Label>
          <Form.Control
            type="file"
            name="image"
            accept="image/*"
            onChange={handleImageChange}
          />
          {imagePreview ? (
            <Image
              src={imagePreview}
              alt="Preview"
              fluid
              style={{ maxWidth: '400px', maxHeight: '400px', marginTop: '10px' }}
            />
          ) : (
            <Image
              src={formData?.image || ''}
              alt="Preview"
              fluid
              style={{ maxWidth: '400px', maxHeight: '400px', marginTop: '10px' }}
            />
          )}
        </Form.Group>

        <Form.Group controlId="detail_text" className="mt-3">
          <Form.Label>Подробное описание</Form.Label>
          <Form.Control
            as="textarea"
            rows={3}
            name="detail_text"
            value={formData?.detail_text || ''}
            onChange={handleInputChange}
            placeholder="Введите подробное описание"
          />
        </Form.Group>
        <div className="mt-4 d-flex justify-content-between">
          <Button variant="success" onClick={handleCreateNew}>
            Создать 
          </Button>
        </div>
      </Form>
    </Container>
  );
};

export default CreateConfigurationElementPage;
