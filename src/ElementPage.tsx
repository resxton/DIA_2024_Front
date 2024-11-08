import "./ElementPage";
import { FC, useEffect, useState } from "react";
import { BreadCrumbs } from "./components/BreadCrumbs";
import { ROUTES, ROUTE_LABELS } from "./Routes";
import { useParams } from "react-router-dom";
import { ConfigurationElement, getConfigurationElementById } from "./modules/configurationApi";
import { Col, Row, Spinner, Image } from "react-bootstrap";
// import { ALBUMS_MOCK } from "./modules/mock";
import defaultImage from "./assets/DefaultImage.png";

export const AlbumPage: FC = () => {
  const [pageData, setPageDdata] = useState<ConfigurationElement>();

  const { id } = useParams(); // ид страницы, пример: "/albums/12"

  useEffect(() => {
    if (!id) return;
    getConfigurationElementById(0)
      .then((response) => setPageDdata(response))
      // .catch(
      //   () =>
      //     setPageDdata(
      //       ALBUMS_MOCK.results.find(
      //         (album) => String(album.collectionId) == id
      //       )
      //     ) /* В случае ошибки используем мок данные, фильтруем по ид */
      // );
  }, [id]);

  return (
    <div>
      <BreadCrumbs
        crumbs={[
          { label: ROUTE_LABELS.ELEMENTS, path: ROUTES.ELEMENTS },
          { label: pageData?.name || "Элемент конфигурации" },
        ]}
      />
      {pageData ? ( // проверка на наличие данных, иначе загрузка
        <div className="container">
          <Row>
            <Col md={6}>
              <p>
                Альбом: <strong>{pageData.name}</strong>
              </p>
              <p>
                Исполнитель: <strong>{pageData.category}</strong>
              </p>
            </Col>
            <Col md={6}>
              <Image
                src={pageData.image || defaultImage} // дефолтное изображение, если нет artworkUrl100
                alt="Картинка"
                width={100}
              />
            </Col>
          </Row>
        </div>
      ) : (
        <div className="album_page_loader_block">{/* загрузка */}
          <Spinner animation="border" />
        </div>
      )}
    </div>
  );
};