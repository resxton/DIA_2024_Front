import { useEffect, useState } from 'react';
import { Table, Button, Container } from 'react-bootstrap';
import { api } from './api';
import { ConfigurationElement } from './api/Api';
import CustomNavbar from './components/CustomNavbar';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from './Routes';

const ConfigurationElementsTable = () => {
  const [elements, setElements] = useState<ConfigurationElement[]>([]);
  const [loading, setLoading] = useState(true);
  const { isAuthenticated, user } = useSelector((state: any) => state.auth);
  const navigate = useNavigate();


  useEffect(() => {
    // Получаем данные с API
    api.planeConfigurationElements
      .planeConfigurationElementsList()
      .then((response) => {
        // Если response.data.configuration_elements не существует, используем пустой массив
        setElements(response.data.configuration_elements || []); 
      })
      .catch((error) => {
        console.error('Ошибка загрузки элементов', error);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  // Редирект при изменении isAuthenticated
  useEffect(() => {
    if (!isAuthenticated) {
      navigate(ROUTES.ELEMENTS); // Предполагается, что "/" — это ROUTES.HOME
    }
  }, [isAuthenticated, navigate]);

  const handleEditClick = (id: number) => {
    navigate(`${ROUTES.ELEMENTS_TABLE}/${id}`);
  };

  const handleDeleteClick = (id: number) => {
    const confirmDelete = window.confirm(
      'Вы уверены, что хотите удалить этот элемент? Данное действие нельзя отменить.'
    );
    if (confirmDelete) {
      api.planeConfigurationElement.planeConfigurationElementDelete(id.toString())
        .then(() => {
          alert('Элемент успешно удален.');
          navigate(ROUTES.ELEMENTS_TABLE)
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
      <Container fluid className="mt-4" style={{ maxWidth: '95%' }}>
        <h2 className="mb-4">Элементы конфигурации</h2>

        {elements && elements.length > 0 ? (
          <Table striped bordered hover responsive className="w-100">
            <thead>
              <tr>
                <th>Наименование</th>
                <th>Цена</th>
                <th>Категория</th>
                <th style={{ width: '350px', wordWrap: 'break-word' }}>Основная информация</th> {/* Сужаем столбец */}
                <th>Действия</th>
              </tr>
            </thead>
            <tbody>
              {elements.map((element) => (
                <tr key={element.pk}>
                  <td>{element.name}</td>
                  <td>$ {element.price}</td>
                  <td>{element.category}</td>
                  <td>{element.key_info}</td>
                  <td style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Button variant="outline-primary" onClick={() => handleEditClick(element.pk)}>
                      Редактировать
                    </Button>
                    <Button
                      variant="danger"
                      style={{ flexGrow: 1, marginLeft: '5px' }}
                      onClick={() => handleDeleteClick(element.pk)}
                    >
                      Удалить
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        ) : (
          <p>Нет элементов для отображения.</p>
        )}
      </Container>
    </div>
  );
};

export default ConfigurationElementsTable;
