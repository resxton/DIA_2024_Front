import { FC, useState, useEffect } from 'react';
import { Container, Badge, Row, Col, Spinner } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { FilterComponent } from './components/FilterComponent';
import planeIcon from './assets/plane.svg';
import { BreadCrumbs } from './components/BreadCrumbs';
import { ROUTES, ROUTE_LABELS } from './Routes';
import { ElementCard } from './components/ElementCard';
import './ElementsPage.css';
import CustomNavbar from './components/CustomNavbar';
import { RootState } from './redux/store';
import { fetchConfigurationElements } from './redux/configurationElementsSlice';

const ElementsPage: FC = () => {
  // Локальное состояние для фильтров
  const [category, setCategory] = useState('');
  const [minPrice, setMinPrice] = useState(1);
  const [maxPrice, setMaxPrice] = useState(100000000);
  const navigate = useNavigate();
  const dispatch = useDispatch();

   // Redux-состояние
   const { draftConfigurationId, draftElementsCount, elements, loading } = useSelector(
    (state: RootState) => state.configurationElements
  );
  const { isAuthenticated, user } = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    dispatch(fetchConfigurationElements({ category, price_min: minPrice, price_max: maxPrice }) as any);
  }, [dispatch, category, minPrice, maxPrice]);

  const handleFilterChange = (category: string, minPrice: number, maxPrice: number) => {
    setCategory(category);
    setMinPrice(minPrice);
    setMaxPrice(maxPrice);
  };

  const handleGoToDraft = () => {
    if (draftConfigurationId != null) {
      navigate(`/configuration/${draftConfigurationId}`);
    }
  };

  return (
    <div className="elements-page">
      {loading && (
        <div className="loading-overlay">
          <Spinner animation="border" role="status" variant="light" />
        </div>
      )}

      <CustomNavbar isAuthenticated={isAuthenticated} user={user} />

      <BreadCrumbs
        crumbs={[
          { label: ROUTE_LABELS.ELEMENTS, path: ROUTES.ELEMENTS },
        ]}
      />

      <Container fluid className="mt-4 w-75">
        <h2 className="mb-4">Элементы конфигурации</h2>

        <div className="filter-cart-container">
          <FilterComponent
            selectedCategory={category}
            selectedPriceMin={minPrice}
            selectedPriceMax={maxPrice}
            onFilterChange={handleFilterChange}
          />
          <div
            className="cart-icon"
            onClick={handleGoToDraft}
            style={{ cursor: isAuthenticated ? 'pointer' : 'normal' }}
          >
            <img src={planeIcon} alt="Cart Icon" width={30} height={30} />
            <Badge pill bg={isAuthenticated && draftConfigurationId != null ? 'success' : 'secondary'} className="draft-count-badge">
              {isAuthenticated && draftConfigurationId != null ? draftElementsCount : '–'}
            </Badge>
          </div>
        </div>

        {elements.length > 0 ? (
          <Row className="w-100">
            {elements.map((element) => (
              <Col key={element.pk} xs={12} md={6} lg={4} className="mb-4">
                <ElementCard
                  id={element.pk}
                  name={element.name}
                  price={element.price}
                  category={element.category}
                  image={element.image}
                  detail_text={element.detail_text}
                  showAddButton={isAuthenticated}
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