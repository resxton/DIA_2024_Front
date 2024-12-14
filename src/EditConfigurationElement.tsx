import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button, Form, Container, Alert, Row, Col, Image } from 'react-bootstrap';
import { ConfigurationElement } from './api/Api';
import { api } from './api';
import { ROUTES } from './Routes';

const EditConfigurationElementPage = () => {
  const { id } = useParams();
  const [element, setElement] = useState<ConfigurationElement | null>(null);
  const [formData, setFormData] = useState<ConfigurationElement | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null); // для хранения файла изображения
  const navigate = useNavigate();

  useEffect(() => {
    if (!id) {
      setError("ID элемента не найден");
      return;
    }
    api.planeConfigurationElement
      .planeConfigurationElementRead(id)
      .then((response: { data: ConfigurationElement }) => {
        const elementData = response.data;
        setElement(elementData);
        setFormData(elementData);
        setImagePreview(elementData.image || null); // Инициализируем изображение для предпросмотра
      })
      .catch(() => {
        setError('Ошибка при загрузке данных.');
      })
      .finally(() => {
        setLoading(false);
      });
  }, [id]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData!,
      [name]: value,
    });
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string); // Устанавливаем изображение для предпросмотра
      };
      reader.readAsDataURL(file);
      setImageFile(file); // Сохраняем сам файл
    }
  };

  const handleSubmit = async () => {
    if (formData && element) {
      setLoading(true);
  
      try {
        // Обновляем данные конфигурационного элемента без картинки
        await api.planeConfigurationElement
          .planeConfigurationElementEditUpdate(id || '', {
            ...formData, // отправляем только данные без картинки
          })
          .then(() => {
            navigate(ROUTES.ELEMENTS); // Навигация на страницу элементов после сохранения
          })
          .catch((error) => {
            setError("Ошибка при сохранении изменений");
            console.error(error);
          });
      } catch (error) {
        setError("Ошибка при сохранении изменений");
        console.error(error);
      } finally {
        setLoading(false);
      }
    }
  };
  
  const handleImageUpdate = async () => {
    if (imageFile && id) {
      setLoading(true);
  
      try {
        // Отправляем изображение отдельно
        await api.planeConfigurationElement
          .planeConfigurationElementEditCreate(id, { pic: imageFile })
          .then(() => {
            navigate(ROUTES.ELEMENTS); // Навигация на страницу элементов после обновления изображения
          })
          .catch((error) => {
            setError("Ошибка при обновлении изображения");
            console.error(error);
          });
      } catch (error) {
        setError("Ошибка при обновлении изображения");
        console.error(error);
      } finally {
        setLoading(false);
      }
    }
  };  
  

  if (loading) {
    return <div>Загрузка...</div>;
  }

  if (error) {
    return <Alert variant="danger">{error}</Alert>;
  }

  if (!element) {
    return <div>Элемент не найден.</div>;
  }

  return (
    <Container className="mt-4">
      <h2>Редактировать услугу</h2>
      <Form className="mt-3">
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
              <Form.Control
                type="text"
                name="category"
                value={formData?.category || ''}
                onChange={handleInputChange}
                placeholder="Введите категорию"
              />
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
              src={element?.image || ''} 
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
          <Button variant="primary" onClick={handleSubmit}>
            Сохранить изменения
          </Button>
          <Button variant="secondary" onClick={() => navigate('/configurations')}>
            Отмена
          </Button>
        </div>

        {imageFile && (
          <Button variant="success" className="mt-3" onClick={handleImageUpdate}>
            Обновить изображение
          </Button>
        )}
      </Form>
    </Container>
  );
};

export default EditConfigurationElementPage;
