import "./ElementPage.css"; // создайте и подключите файл для кастомных стилей
import { FC, useEffect, useState } from "react";
import { BreadCrumbs } from "./components/BreadCrumbs";
import { ROUTES, ROUTE_LABELS } from "./Routes";
import { useParams } from "react-router-dom";
// import { ConfigurationElement, getConfigurationElementById } from "./modules/configurationApi";
import { Spinner, Image } from "react-bootstrap";
import defaultImage from "./assets/Default.jpeg";
import { ELEMENTS_MOCK } from "./modules/mock";
import { api } from "./api";
import { ConfigurationElement } from "./api/Api";

export const ElementPage: FC = () => {
  const [pageData, setPageData] = useState<ConfigurationElement>();
  const [loading, setLoading] = useState(true); // Добавим состояние загрузки

  const { id } = useParams(); // Получаем ID страницы

  useEffect(() => {
    if (!id) return;

    // Попробуем получить данные с API
    api.planeConfigurationElement
      .planeConfigurationElementRead(id) // С использованием сгенерированного метода
      .then((response) => {
        // Извлекаем данные из response.data
        const elementData = response.data as ConfigurationElement;
        setPageData(elementData); // Устанавливаем данные элемента
      })
      .catch(() => {
        // В случае ошибки или если нет интернета, используем мок
        console.error("Ошибка при загрузке данных, используется мок.");

        // Ищем элемент с данным ID в моке
        const mockElement = ELEMENTS_MOCK.configuration_elements.find(
          (element) => element.pk === Number(id)
        );

        // Если элемент найден в моках, устанавливаем его как данные страницы
        if (mockElement) {
          setPageData(mockElement);
        }
      })
      .finally(() => {
        setLoading(false); // После загрузки данных выключаем индикатор загрузки
      });
  }, [id]);

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
          </div>
        </div>
      ) : (
        !loading && <div>Элемент не найден</div> // Сообщение, если элемент не найден
      )}
    </div>
  );
};

export default ElementPage;
