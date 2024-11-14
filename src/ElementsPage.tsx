import React, { FC, useState, useEffect } from 'react';
import { Navbar, Nav, Container, Image, Badge, Row, Col } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { getConfigurationElements, ConfigurationElementsResult } from './modules/configurationApi';
import { ElementCard } from './components/ElementCard';
import './ElementsPage.css';
import { FilterComponent } from './components/FilterComponent';
import { ELEMENTS_MOCK } from './modules/mock';

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
  const [minPrice, setMinPrice] = useState(1);
  const [maxPrice, setMaxPrice] = useState(100000000);
  const navigate = useNavigate();

  useEffect(() => {
    // Попытка получить данные с API
    getConfigurationElements(category, minPrice, maxPrice)
      .then((response: ConfigurationElementsResult) => {
        setElements(response.configuration_elements);
        setDraftElementsCount(response.draft_elements_count);
      })
      .catch((error) => {
        console.error("Ошибка при загрузке данных:", error);
        // В случае ошибки использовать моковые данные
        setElements(ELEMENTS_MOCK.configuration_elements);
        setDraftElementsCount(ELEMENTS_MOCK.draft_elements_count);
      });
  }, [category, minPrice, maxPrice]);

  const handleFilterChange = (category: string, minPrice: number, maxPrice: number) => {
    setCategory(category);
    setMinPrice(minPrice);
    setMaxPrice(maxPrice);
  };

  const handleLogoClick = () => navigate('/');

  return (
    <div className="elements-page">
      <Navbar className="bg-body-tertiary" expand="lg" >
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
        <Navbar.Toggle aria-controls="navbar-nav" />
        <Navbar.Collapse id="navbar-nav">
          <Nav className="ml-auto">
            <Nav.Link href="/configuration-elements">Элементы конфигурации</Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Navbar>

      <Container fluid className="mt-4 w-75">
        <h2 className='mb-4'>Элементы конфигурации</h2>
        
        {/* Фильтр и корзина */}
        <div className="filter-cart-container">
          <FilterComponent 
            selectedCategory={category} 
            selectedPriceMin={minPrice} 
            selectedPriceMax={maxPrice} 
            onFilterChange={handleFilterChange} 
          />
          <div className="cart-icon" onClick={() => navigate('')}>
            <img src="http://127.0.0.1:9000/service/plane.svg" alt="Cart Icon" width={30} height={30} />
            <Badge pill bg="primary" className="draft-count-badge">
              {draftElementsCount}
            </Badge>
          </div>
        </div>
        
        {/* Проверяем, есть ли элементы для отображения */}
        {elements.length > 0 ? (
          <Row className="w-100">
            {elements.map((element) => (
              <Col key={element.pk} xs={12} sm={6} md={4} className="mb-4">
                <ElementCard
                  id={element.pk}
                  name={element.name}
                  price={element.price}
                  category={element.category}
                  image={element.image}
                  detail_text={element.detail_text}
                />
              </Col>
            ))}
          </Row>
        ) : (
          <div className="no-results">Ничего не найдено</div>
        )}
      </Container>
    </div>
  );
};

export default ElementsPage;
