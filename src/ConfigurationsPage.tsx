import { FC, useState, useEffect } from 'react';
import { Container, Button, Table, Spinner } from 'react-bootstrap';
import { api } from './api';
import { BreadCrumbs } from './components/BreadCrumbs';
import { ROUTES, ROUTE_LABELS } from './Routes';
import { PlaneConfigurationListResponse } from './api/Api';
import { useSelector } from 'react-redux';
import { RootState } from './redux/store';
import { useNavigate } from 'react-router-dom';
import CustomNavbar from './components/CustomNavbar';

const ConfigurationsPage: FC = () => {
  const [configurations, setConfigurations] = useState<PlaneConfigurationListResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Access authentication state from Redux store
  const { isAuthenticated, user } = useSelector((state: RootState) => state.auth);

  const handleGoToConfiguration = (id: number) => {
    navigate(`${ROUTES.CONFIGURATION}/${id}`);
  };

  // Fetch the list of configurations when the page loads
  const fetchConfigurations = () => {
    api.planeConfigurations
      .planeConfigurationList()
      .then((response) => {
        setConfigurations(response.data);
      })
      .catch((error) => {
        console.error('Ошибка при загрузке конфигураций:', error);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchConfigurations(); // Initial fetch

    const interval = setInterval(() => {
      fetchConfigurations(); // Fetch every 2 seconds
    }, 2000);

    // Clear interval on component unmount
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return <Spinner animation="border" role="status" variant="light" />;
  }

  return (
    <div className="configurations-page">
      <CustomNavbar 
        isAuthenticated={isAuthenticated} 
        user={user}
      />

      <BreadCrumbs
        crumbs={[
          { label: ROUTE_LABELS.ELEMENTS, path: ROUTES.ELEMENTS },
          { label: ROUTE_LABELS.CONFIGURATIONS, path: ROUTES.CONFIGURATIONS },
        ]}
      />

      <Container fluid className="mt-4 w-75">
        <h2 className="mb-4">Мои конфигурации</h2>

        {configurations && configurations.configurations.length > 0 ? (
          <Table striped bordered hover responsive>
            <thead>
              <tr>
                <th>ID</th>
                <th>Статус</th>
                <th>Дата создания</th>
                <th>Цена</th>
                <th>Действия</th>
              </tr>
            </thead>
            <tbody>
              {configurations.configurations.map((configuration) => (
                <tr key={configuration.pk}>
                  <td>{configuration.pk}</td>
                  <td>{configuration.status}</td>
                  <td>{configuration.created_at}</td>
                  <td>${configuration.total_price}</td>
                  <td>
					<Button 
						variant="outline-primary" 
						onClick={() => handleGoToConfiguration(configuration.pk)}
						>
						Подробнее
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        ) : (
          <p>Нет конфигураций для отображения.</p>
        )}
      </Container>
    </div>
  );
};

export default ConfigurationsPage;
