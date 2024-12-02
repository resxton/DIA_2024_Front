import "./ElementPage.css"; // создайте и подключите файл для кастомных стилей
import { FC, useEffect, useState } from "react";
import { BreadCrumbs } from "./components/BreadCrumbs";
import { ROUTES, ROUTE_LABELS } from "./Routes";
import { useParams } from "react-router-dom";
import { Spinner, Image, Button } from "react-bootstrap";
import defaultImage from "./assets/Default.jpeg";
import { ELEMENTS_MOCK } from "./modules/mock";
import { api } from "./api";
import { ConfigurationElement } from "./api/Api";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "./redux/store"; // импортируйте RootState вашего Redux хранилища

export const ElementPage: FC = () => {
  const [pageData, setPageData] = useState<ConfigurationElement>();
  const [loading, setLoading] = useState(true);

  const { id } = useParams(); // Получаем ID страницы
  const { isAuthenticated, user } = useSelector((state: RootState) => state.auth); // Получаем данные аутентификации из Redux

  const dispatch = useDispatch();

  useEffect(() => {
    if (!id) return;

    // Попробуем получить данные с API
    api.planeConfigurationElement
      .planeConfigurationElementRead(id)
      .then((response) => {
        const elementData = response.data as ConfigurationElement;
        setPageData(elementData);
      })
      .catch(() => {
        console.error("Ошибка при загрузке данных, используется мок.");
        const mockElement = ELEMENTS_MOCK.configuration_elements.find(
          (element) => element.pk === Number(id)
        );
        if (mockElement) {
          setPageData(mockElement);
        }
      })
      .finally(() => {
        setLoading(false);
      });
  }, [id]);

  const handleAddToConfiguration = () => {
    if (isAuthenticated) {
      console.log("Элемент добавлен в конфигурацию");
      // Логика добавления элемента в конфигурацию
    } else {
      console.log("Пользователь не авторизован");
    }
  };

  return (
    <div className="element-page-container">
      {loading && (
        <div className="loading-overlay">
          <Spinner animation="border" />
        </div>
      )}
      <BreadCrumbs
        crumbs={[
          { label: ROUTE_LABELS.ELEMENTS, path: ROUTES.ELEMENTS },
          { label: pageData?.name || "Элемент конфигурации" },
        ]}
      />
      {pageData ? (
        <div className="content">
          <div className="detail-card">
            <h1 className="detail-card-title">{pageData.name}</h1>
            <div className="detail-card-img-container">
              <Image
                src={pageData.image || defaultImage}
                alt={pageData.name}
                className="detail-card-img"
                fluid
              />
            </div>
            <p className="detail-card-text">{pageData.detail_text || "Описание недоступно."}</p>
            <h2 className="detail-card-price">
              Стоимость: ${pageData.price || "N/A"}
            </h2>
            {isAuthenticated ? (
              <Button variant="primary" onClick={handleAddToConfiguration}>
                Добавить в конфигурацию
              </Button>
            ) : (
              <p>Для добавления в конфигурацию необходимо авторизоваться.</p>
            )}
          </div>
        </div>
      ) : (
        !loading && <div>Элемент не найден</div>
      )}
    </div>
  );
};

export default ElementPage;
