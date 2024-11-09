import React, { FC, useState, useEffect } from 'react';
import { Navbar, Nav, Container, Image, Badge, Row, Col } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { getConfigurationElements, ConfigurationElementsResult } from './modules/configurationApi';
import { ElementCard } from './components/ElementCard';
import './ElementsPage.css';
import { FilterComponent } from './components/FilterComponent';

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
  const [draft_elements_count, setDraftElementsCount] = useState(0);
  const [elements, setElements] = useState<ConfigurationElement[]>([]);
  const [category, setCategory] = useState('');
  const [minPrice, setMinPrice] = useState(1);
  const [maxPrice, setMaxPrice] = useState(100000000);
  const navigate = useNavigate();

  useEffect(() => {
    getConfigurationElements(category, minPrice, maxPrice)
      .then((response: ConfigurationElementsResult) => {
        setElements(response.configuration_elements);
        setDraftElementsCount(response.draft_elements_count);
      })
      .catch((error) => console.error("Ошибка при загрузке данных:", error));
  }, [category, minPrice, maxPrice]); // Добавляем зависимость от фильтров

  const handleFilterChange = (category: string, minPrice: number, maxPrice: number) => {
    setCategory(category);
    setMinPrice(minPrice);
    setMaxPrice(maxPrice);
  };

  const handleLogoClick = () => navigate('/');

  return (
    <div className="elements-page">
      <Navbar className="bg-body-tertiary" expand="lg" >
        {/* Логотип и Название */}
        <Navbar.Brand onClick={handleLogoClick} style={{ cursor: 'pointer' }} className='m-3'>
          <img
            src="http://127.0.0.1:9000/service/logo.svg"
            alt="Nimbus Logo"
            width={30}
            height={30}
            className="d-inline-block align-top"
          />{' '}
          Nimbus
        </Navbar.Brand>

        {/* Элементы навигации */}
        <Navbar.Toggle aria-controls="navbar-nav" />
        <Navbar.Collapse id="navbar-nav">
          <Nav className="ml-auto">
            <Nav.Link href="/configuration-elements">Элементы конфигурации</Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Navbar>

      <Container fluid className="mt-4 w-75" >
        <h2 className='mb-4'>Элементы конфигурации</h2>
        
        {/* Вставляем компонент фильтрации */}
        <FilterComponent 
          selectedCategory={category} 
          selectedPriceMin={minPrice} 
          selectedPriceMax={maxPrice} 
          onFilterChange={handleFilterChange} 
        />
        
        <Row className="w-100">
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
