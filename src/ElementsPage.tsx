import { FC, useState, useEffect } from 'react';
import { Container, Badge, Row, Col, Spinner } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from './redux/authSlice'; // Импортируем действия
import { FilterComponent } from './components/FilterComponent';
import { ELEMENTS_MOCK } from './modules/mock';
import planeIcon from './assets/plane.svg';
import { BreadCrumbs } from './components/BreadCrumbs';
import { ROUTES, ROUTE_LABELS } from './Routes';
import { api } from './api';
import { ConfigurationElementsResult, ConfigurationElement } from './api/Api';
import { ElementCard } from './components/ElementCard';
import './ElementsPage.css';
import { resetFilters } from './redux/filterSlice';
import CustomNavbar from './components/CustomNavbar';

const ElementsPage: FC = () => {
  const [draftElementsCount, setDraftElementsCount] = useState(0);
  const [elements, setElements] = useState<ConfigurationElement[]>([]);
  const [category, setCategory] = useState('');
  const [minPrice, setMinPrice] = useState(1);
  const [maxPrice, setMaxPrice] = useState(100000000);
  const [loading, setLoading] = useState(true);
  const [draftID, setDraftID] = useState(0);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { isAuthenticated, user } = useSelector((state: any) => state.auth);

  useEffect(() => {
    api.planeConfigurationElements
      .planeConfigurationElementsList({
        category: category,
        price_min: minPrice,
        price_max: maxPrice,
      })
      .then((response) => {
        const data = response.data as ConfigurationElementsResult;
        if (data.configuration_elements) {
          setElements(data.configuration_elements);
        } else {
          setElements([]);
        }
        setDraftElementsCount(data.draft_elements_count || 0);
        setDraftID(data.draft_configuration_id || 0);
      })
      .catch((error) => {
        console.error('Ошибка при загрузке данных:', error);
        setElements(ELEMENTS_MOCK.configuration_elements);
        setDraftElementsCount(0);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [category, minPrice, maxPrice]);

  const handleFilterChange = (category: string, minPrice: number, maxPrice: number) => {
    setCategory(category);
    setMinPrice(minPrice);
    setMaxPrice(maxPrice);
  };

  const handleLogoClick = () => navigate('/');

  const handleLogout = () => {
    api.logout
      .logoutCreate()
      .then(() => {
        dispatch(logout()); // Логаут пользователя
        dispatch(resetFilters()); // Сброс фильтров в Redux
  
        setDraftElementsCount(0); // Сбрасываем количество элементов в корзине
  
        navigate('/configuration-elements'); // Перенаправление на нужную страницу
      })
      .catch((error) => {
        console.error('Ошибка при выходе из системы:', error);
      });
  };
  
  

  // Функция для обновления количества элементов в корзине
  const handleAddToDraft = () => {
    setDraftElementsCount(prevCount => prevCount + 1);
  };

  const handleGoToDraft = () => {
    if (draftID) {
      navigate(`/configuration/${draftID}`);
    }
  };

  return (
    <div className="elements-page">
      {loading && (
        <div className="loading-overlay">
          <Spinner animation="border" role="status" variant="light" />
        </div>
      )}

      <CustomNavbar
        isAuthenticated={isAuthenticated}
        user={user}
        onLogout={handleLogout}
      />

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
            style={{ cursor: isAuthenticated ? 'pointer' : 'not-allowed' }}
          >
            <img src={planeIcon} alt="Cart Icon" width={30} height={30} />
            <Badge pill bg={isAuthenticated ? 'primary' : 'danger'} className="draft-count-badge">
              {draftElementsCount}
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
                  onAddToDraft={handleAddToDraft}
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
