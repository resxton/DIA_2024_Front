import { FC } from "react";
import { Link } from "react-router-dom";
import { ROUTES } from "./Routes";
import { Button, Container, Carousel, Image } from "react-bootstrap";
import carousel1 from "./assets/Carousel1.jpg"
import carousel2 from "./assets/Carousel2.jpg"
import carousel3 from "./assets/Carousel3.jpg"
import './HomePage.css'


export const HomePage: FC = () => {
  return (
    <Container className="d-flex flex-column align-items-center">
      <h1>Заказ на постройку самолета</h1>
      <p>
        Добро пожаловать в систему конфигурации самолета! Здесь вы можете выбрать различные элементы для воздушного судна вашей мечты.
      </p>
      <Carousel className="m-5">
            <Carousel.Item>
              <Image
                className="d-block w-100 carousel-image"
                src={ carousel1 }
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
                src={ carousel2 }
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
                src={ carousel3 }
                alt="Третий слайд"
                fluid
              />
              <Carousel.Caption className="">
                <h3>Challenger 650</h3>
              </Carousel.Caption>
            </Carousel.Item>
          </Carousel>
      <Link to={ROUTES.ELEMENTS}>
        <Button variant="primary">Просмотреть элементы конфигурации</Button>
      </Link>
    </Container>
  );
};
