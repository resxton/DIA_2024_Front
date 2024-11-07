import { FC, useState } from "react";
import { Row, Col, Spinner } from "react-bootstrap";
import { ITunesMusic, getMusicByName } from "./modules/itunesApi";
import InputField from "./components/InputField";
import { BreadCrumbs } from "./components/BreadCrumbs";
import { ROUTES, ROUTE_LABELS } from "./Routes";
import { MusicCard } from "./components/MusicCard";
import { useNavigate } from "react-router-dom";
import { ALBUMS_MOCK } from "./modules/mock";

const ITunesPage: FC = () => {
  const [searchValue, setSearchValue] = useState("");
  const [loading, setLoading] = useState(false);
  const [music, setMusic] = useState<ITunesMusic[]>([]);
  const [isMockData, setIsMockData] = useState(false);  // новое состояние для отслеживания моков

  const navigate = useNavigate();

  const handleSearch = () => {
    setLoading(true);
    setIsMockData(false);  // сбрасываем флаг перед запросом

    getMusicByName(searchValue)
      .then((response) => {
        const tracks = response.results.filter((item) => item.wrapperType === "track");
        if (tracks.length === 0) {
          // если API вернуло пустой ответ, переключаемся на моки
          setMusic(
            ALBUMS_MOCK.results.filter((item) =>
              item.collectionCensoredName
                .toLocaleLowerCase()
                .startsWith(searchValue.toLocaleLowerCase())
            )
          );
          setIsMockData(true); // помечаем, что данные из моков
        } else {
          setMusic(tracks);
        }
        setLoading(false);
      })
      .catch(() => {
        // если ошибка при запросе, используем моки
        setMusic(
          ALBUMS_MOCK.results.filter((item) =>
            item.collectionCensoredName
              .toLocaleLowerCase()
              .startsWith(searchValue.toLocaleLowerCase())
          )
        );
        setIsMockData(true);  // помечаем, что данные из моков
        setLoading(false);
      });
  };

  const handleCardClick = (id: number) => {
    // клик на карточку, переход на страницу альбома
    navigate(`${ROUTES.ALBUMS}/${id}`);
  };

  return (
    <div className="container">
      <BreadCrumbs crumbs={[{ label: ROUTE_LABELS.ALBUMS }]} />
      
      <InputField
        value={searchValue}
        setValue={(value) => setSearchValue(value)}
        loading={loading}
        onSubmit={handleSearch}
      />

      {loading && (
        <div className="loadingBg">
          <Spinner animation="border" />
        </div>
      )}
      {!loading && !music.length && !isMockData ? (
        <div>
          <h1>К сожалению, пока ничего не найдено :(</h1>
        </div>
      ) : (
        <Row xs={4} md={4} className="g-4">
          {music.map((item, index) => (
            <Col key={index}>
              <MusicCard
                imageClickHandler={() => handleCardClick(item.collectionId)}
                {...item}
              />
            </Col>
          ))}
        </Row>
      )}
    </div>
  );
};

export default ITunesPage;
