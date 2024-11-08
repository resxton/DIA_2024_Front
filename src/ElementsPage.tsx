import React, { FC, useState, useEffect } from 'react';
import { Navbar, Nav, Container, Image, Badge, Row, Col, Form, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { getConfigurationElements, ConfigurationElementsResult } from './modules/configurationApi';
import { ElementCard } from './components/ElementCard';
import './ElementsPage.css';

interface ConfigurationElement {
  pk: number;
  name: string;
  price: number;
  key_info: string;
  category: string;
  image: string;
  detail_text: string;
  is_deleted: boolean;
}

const ElementsPage: FC = () => {
  const [draftElementsCount, setDraftElementsCount] = useState(0);
  const [elements, setElements] = useState<ConfigurationElement[]>([]);
  const [category, setCategory] = useState('');
  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(100000000);
  const navigate = useNavigate();

  useEffect(() => {
    getConfigurationElements()
      .then((response: ConfigurationElementsResult) => {
        setElements(response.configuration_elements);
        setDraftElementsCount(response.draft_elements_count);
      })
      .catch((error) => console.error("Ошибка при загрузке данных:", error));
  }, []);

  const handleFilterSubmit = () => {
    getConfigurationElements(category, minPrice, maxPrice)
      .then((response: ConfigurationElementsResult) => {
        setElements(response.configuration_elements);
      })
      .catch((error) => console.error("Ошибка при фильтрации:", error));
  };

  const handleCartClick = () => navigate('/cart');
  const handleLogoClick = () => navigate('/');

  return (
    <div className="elements-page">
      <Navbar bg="light" expand="lg">
        <Container>
          <Navbar.Brand onClick={handleLogoClick} style={{ cursor: 'pointer' }}>
            <img
              src="http://127.0.0.1:9000/service/logo.svg"
              alt="Nimbus Logo"
              width={30}
              height={30}
              className="d-inline-block align-top"
            />
            Nimbus
          </Navbar.Brand>
          <Nav className="ml-auto">
            <Nav.Link href="/plane-configuration-elements">Элементы</Nav.Link>
            <Nav.Link onClick={handleCartClick}>
              <Image
                src="http://127.0.0.1:9000/service/plane.svg"
                alt="Корзина"
                width={30}
                height={30}
                style={{ cursor: 'pointer' }}
              />
              <Badge bg="secondary" style={{ position: 'absolute', top: 0, right: 0 }}>
                {draftElementsCount}
              </Badge>
            </Nav.Link>
          </Nav>
        </Container>
      </Navbar>

      <Container className="mt-4">
        <h2>Элементы конфигурации</h2>
        <Form className="filter-form">
          <Row>
            <Col>
              <Form.Group controlId="categorySelect">
                <Form.Label>Категория:</Form.Label>
                <Form.Control as="select" value={category} onChange={(e) => setCategory(e.target.value)}>
                  <option value="">Выберите категорию</option>
                  <option value="Дизайн салона">Дизайн салона</option>
                  <option value="Компоновка салона">Компоновка салона</option>
                  <option value="Двигатель">Двигатель</option>
                  <option value="Авионика">Авионика</option>
                  <option value="Кресло">Кресло</option>
                </Form.Control>
              </Form.Group>
            </Col>
            <Col>
              <Form.Group controlId="minPrice">
                <Form.Label>Цена от</Form.Label>
                <Form.Control type="number" value={minPrice} onChange={(e) => setMinPrice(Number(e.target.value))} />
              </Form.Group>
            </Col>
            <Col>
              <Form.Group controlId="maxPrice">
                <Form.Label>до</Form.Label>
                <Form.Control type="number" value={maxPrice} onChange={(e) => setMaxPrice(Number(e.target.value))} />
              </Form.Group>
            </Col>
            <Col className="d-flex align-items-end">
              <Button onClick={handleFilterSubmit}>Фильтровать</Button>
            </Col>
          </Row>
        </Form>

        <Row>
          {elements.map((element) => (
            <Col key={element.pk} xs={12} sm={6} md={4} className="mb-4">
              <ElementCard
                id={element.pk}
                name={element.name}
                price={element.price}
                category={element.category}
                image={element.image || './assets/DefaultImage.png'}
                detail_text={element.detail_text}
              />
            </Col>
          ))}
        </Row>
      </Container>
    </div>
  );
};

export default ElementsPage;
