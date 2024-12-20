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
import { BsCheck, BsX } from 'react-icons/bs';
import { ConfigurationFilterElement } from './components/ConfigurationFilterElement';

const ConfigurationsPage: FC = () => {
  const [configurations, setConfigurations] = useState<PlaneConfigurationListResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [filteredConfigurations, setFilteredConfigurations] = useState<PlaneConfigurationListResponse | null>(null);
  const [filters, setFilters] = useState({
    status: '',
    created_after: '',
    created_before: ''
  });
  const navigate = useNavigate();

  const { isAuthenticated, user } = useSelector((state: RootState) => state.auth);

  const handleGoToConfiguration = (id: number) => {
    navigate(`${ROUTES.CONFIGURATION}/${id}`);
  };

  const handleApprove = (id: number) => {
    const confirmApprove = window.confirm('Вы уверены, что хотите одобрить эту заявку?');
    if (confirmApprove) {
      api.planeConfiguration
        .planeConfigurationAcceptRejectUpdate(id, { status: 'completed' })
        .then((response) => {
          console.log('Статус обновлен успешно:', response.data);
        })
        .catch((error) => {
          console.error('Ошибка при обновлении статуса:', error);
        });
    }
  };

  const handleReject = (id: number) => {
    const confirmReject = window.confirm('Вы уверены, что хотите отклонить эту заявку?');
    if (confirmReject) {
      api.planeConfiguration
        .planeConfigurationAcceptRejectUpdate(id, { status: 'rejected' })
        .then((response) => {
          console.log('Статус обновлен успешно:', response.data);
        })
        .catch((error) => {
          console.error('Ошибка при обновлении статуса:', error);
        });
    }
  };

  const fetchConfigurations = (filters: { status?: string; created_after?: string; created_before?: string }) => {
    api.planeConfigurations
      .planeConfigurationList(filters)
      .then((response) => {
        const newConfigurations = response.data;
  
        // Проверяем, изменились ли данные
        if (JSON.stringify(newConfigurations) !== JSON.stringify(configurations)) {
          setConfigurations(newConfigurations);
          setFilteredConfigurations(newConfigurations); // Обновляем только при изменении
        }
      })
      .catch((error) => {
        console.error('Ошибка при загрузке конфигураций:', error);
      })
      .finally(() => {
        setLoading(false);
      });
  };
  
  const handleFilterChange = (status: string, startDate: string, endDate: string) => {
    setFilters({
      status,
      created_after: startDate,
      created_before: endDate
    });
  };


  useEffect(() => {
  const fetchData = () => fetchConfigurations(filters);
  fetchData();
  const intervalId = setInterval(fetchData, 2000);
  return () => clearInterval(intervalId);
}, [filters]);


  if (loading) {
    return <Spinner animation="border" role="status" variant="light" />;
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
  
    const formatter = new Intl.DateTimeFormat("ru-RU", {
      day: "numeric",
      month: "long",
      hour: "2-digit",
      minute: "2-digit",
    });
  
    const formattedDate = formatter.format(date).replace(/^[а-я]/, (c) => c.toUpperCase());
  
    return formattedDate;
  };

  const statusMap: Record<string, string> = {
    'draft': 'Черновик',
    'deleted': 'Удалена',
    'created': 'Сформирована',
    'completed': 'Завершена',
    'rejected': 'Отклонена',
  };

  const getHumanReadableStatus = (serverStatus: string) => {
    return statusMap[serverStatus] || 'Неизвестный статус';
  };

  return (
    <div className="configurations-page">
      <CustomNavbar isAuthenticated={isAuthenticated} user={user} />
      <BreadCrumbs
        crumbs={[
          { label: ROUTE_LABELS.ELEMENTS, path: ROUTES.ELEMENTS },
          { label: ROUTE_LABELS.CONFIGURATIONS, path: ROUTES.CONFIGURATIONS },
        ]}
      />

      <Container fluid className="mt-4 w-75">
        <h2 className="mb-4">Конфигурации</h2>

        <ConfigurationFilterElement 
          selectedStatus={filters.status} 
          selectedStartDate={filters.created_after} 
          selectedEndDate={filters.created_before} 
          onFilterChange={handleFilterChange} 
        />

        {filteredConfigurations && filteredConfigurations.configurations.length > 0 ? (
          <Table striped bordered hover responsive>
            <thead>
              <tr>
                <th>ID</th>
                <th>Статус</th>
                <th style={{ width: '300px' }}>Дата создания</th>
                <th>Цена</th>
                <th>Заказчик</th>
                <th style={{ width: '300px' }}>Действия</th>
              </tr>
            </thead>
            <tbody>
              {filteredConfigurations.configurations
                .sort((a, b) => a.pk - b.pk) 
                .map((configuration) => (
                  <tr key={configuration.pk}>
                    <td>{configuration.pk}</td>
                    <td>{getHumanReadableStatus(configuration.status)}</td>
                    <td>{formatDate(configuration.created_at || "")}</td>
                    <td>$ {configuration.total_price}</td>
                    <td>{configuration.creator}</td> 
                    <td className="d-flex">
                      {user?.is_staff ? (
                        <div className="d-flex justify-content-between" style={{ width: '300px', gap: '10px' }}>
                          <Button
                            variant="outline-primary"
                            onClick={() => handleGoToConfiguration(configuration.pk)}
                          >
                            Подробнее
                          </Button>
                          <Button
                            variant="success"
                            onClick={() => handleApprove(configuration.pk)}
                            title="Одобрить"
                            style={{ width: '40px', height: '40px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}
                          >
                            <BsCheck size={20} />
                          </Button>
                          <Button
                            variant="danger"
                            onClick={() => handleReject(configuration.pk)}
                            title="Отклонить"
                            style={{ width: '40px', height: '40px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}
                          >
                            <BsX size={20} />
                          </Button>
                        </div>
                      ) : (
                        <Button
                          variant="outline-primary"
                          onClick={() => handleGoToConfiguration(configuration.pk)}
                        >
                          Подробнее
                        </Button>
                      )}
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
