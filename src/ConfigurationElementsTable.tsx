import { useEffect, useState } from 'react';
import { Card, Button, Container } from 'react-bootstrap';
import { api } from './api';
import { ConfigurationElement } from './api/Api';
import CustomNavbar from './components/CustomNavbar';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from './Routes';
import defaultImage from './assets/Default.jpeg';

const ConfigurationElementsTable = () => {
  const [elements, setElements] = useState<ConfigurationElement[]>([]);
  const [loading, setLoading] = useState(true);
  const { isAuthenticated, user } = useSelector((state: any) => state.auth);
  const navigate = useNavigate();

  const fetchData = () => {
    api.planeConfigurationElements
      .planeConfigurationElementsList()
      .then((response) => {
        setElements(response.data.configuration_elements || []);
      })
      .catch((error) => {
        console.error('Ошибка загрузки элементов', error);
        if (error === '403') {
          navigate('/403');
        }
        if (error === '404') {
          navigate('/404');
        }
      })
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchData();

    const interval = setInterval(() => {
      fetchData(); // Fetch every 2 seconds
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate(ROUTES.PAGE_403);
    }
  }, [isAuthenticated, navigate]);

  const handleEditClick = (id: number) => {
    navigate(`${ROUTES.ELEMENTS_TABLE}/${id}`);
  };

  const handleAddClick = () => {
    navigate(ROUTES.CREATE_ELEMENT);
  };

  const handleDeleteClick = (id: number) => {
    const confirmDelete = window.confirm(
      'Вы уверены, что хотите удалить этот элемент? Данное действие нельзя отменить.'
    );
    if (confirmDelete) {
      api.planeConfigurationElement
        .planeConfigurationElementDelete(id.toString())
        .then(() => {
          alert('Элемент успешно удален.');
          fetchData();
        })
        .catch((error) => {
          console.error('Ошибка при удалении элемента:', error);
          alert('Ошибка при удалении элемента. Попробуйте еще раз.');
        });
    }
  };

  if (loading) {
    return <div>Загрузка...</div>;
  }

  return (
    <div className="configuration-elements-page">
      <CustomNavbar isAuthenticated={isAuthenticated} user={user} />
      <Container fluid className="mt-4" style={{ maxWidth: '80%' }}>
        <h2 className="mb-4">Элементы конфигурации</h2>

        {elements && elements.length > 0 ? (
          <div>
            {elements.map((element) => (
              <Card key={element.pk} className="mb-3 shadow-sm">
                <Card.Body style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  {/* Используем image из элемента */}
                  <div style={{ flex: '0 0 100px', marginRight: '10px', textAlign: 'center' }}>
                    <img
                      src={element.image || defaultImage}
                      alt={element.name}
                      style={{ width: '100px', height: '100px', objectFit: 'cover', borderRadius: '5px' }}
                    />
                  </div>
                  <div style={{ flex: '1', textAlign: 'center', marginRight: '10px' }}>
                    <p style={{ margin: '0', fontWeight: 'bold' }}>{element.name}</p>
                  </div>
                  <div style={{ flex: '0 0 100px', textAlign: 'center', marginRight: '10px' }}>
                    <p style={{ margin: '0' }}>${element.price}</p>
                  </div>
                  <div style={{ flex: '1', textAlign: 'center', marginRight: '10px' }}>
                    <p style={{ margin: '0' }}>{element.category}</p>
                  </div>
                  <div style={{ flex: '1', textAlign: 'center', marginRight: '10px' }}>
                    <p style={{ margin: '0' }}>{element.key_info}</p>
                  </div>
                  <div style={{ display: 'flex', gap: '10px', flexShrink: 0 }}>
                    <Button variant="primary" onClick={() => handleEditClick(element.pk)}>
                      Редактировать
                    </Button>
                    <Button variant="danger" onClick={() => handleDeleteClick(element.pk)}>
                      Удалить
                    </Button>
                  </div>
                </Card.Body>
              </Card>
            ))}
          </div>
        ) : (
          <p>Нет элементов для отображения.</p>
        )}

        <Button className="mt-4 mb-4" variant="primary" onClick={handleAddClick}>
          Создать новый элемент конфигурации
        </Button>
      </Container>
    </div>
  );
};

export default ConfigurationElementsTable;
