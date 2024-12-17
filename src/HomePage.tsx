import { FC } from "react";
import { Container, Carousel, Image, Row, Col } from "react-bootstrap";
import carousel1 from "./assets/Carousel1.jpg";
import carousel2 from "./assets/Carousel2.jpg";
import carousel3 from "./assets/Carousel3.jpg";
import "./HomePage.css";
import { useSelector } from "react-redux";
import CustomNavbar from "./components/CustomNavbar";

export const HomePage: FC = () => {
  const { isAuthenticated, user } = useSelector((state: any) => state.auth);

  return (
    <Container fluid className="p-0">
      <Row className="m-0">
        {/* Навбар на всю ширину */}
        <CustomNavbar isAuthenticated={isAuthenticated} user={user} />
      </Row>
      {/* Контент страницы */}
      <Row className="justify-content-center m-0 mt-4">
        <Col xs={12} md={10} className="text-center">
          <h1>Заказ на постройку самолета</h1>
          <p>
            Добро пожаловать в систему конфигурации самолета! Здесь вы можете
            выбрать различные элементы для воздушного судна вашей мечты.
          </p>
          <Carousel className="m-5 carousel-container">
            <Carousel.Item>
              <Image
                className="d-block w-100 carousel-image"
                src={carousel1}
                alt="Первый слайд"
                fluid
              />
              <Carousel.Caption>
                <h3>Global 8000</h3>
              </Carousel.Caption>
            </Carousel.Item>
            <Carousel.Item>
              <Image
                className="d-block w-100 carousel-image"
                src={carousel2}
                alt="Второй слайд"
                fluid
              />
              <Carousel.Caption>
                <h3>Global 7500</h3>
              </Carousel.Caption>
            </Carousel.Item>
            <Carousel.Item>
              <Image
                className="d-block w-100 carousel-image"
                src={carousel3}
                alt="Третий слайд"
                fluid
              />
              <Carousel.Caption>
                <h3>Challenger 650</h3>
              </Carousel.Caption>
            </Carousel.Item>
          </Carousel>
        </Col>
      </Row>
    </Container>
  );
};
