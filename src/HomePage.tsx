import { FC } from "react";
import { Link } from "react-router-dom";
import { ROUTES } from "./Routes";
import { Button, Col, Container, Row } from "react-bootstrap";

export const HomePage: FC = () => {
  return (
    <Container>
      <Row>
        <Col md={6}>
          <h1>Заказ на постройку самолета</h1>
          <p>
            Добро пожаловать в систему конфигурации самолета! Здесь вы можете выбрать различные элементы для воздушного судна вашей мечты.
          </p>
          <Link to={ROUTES.ELEMENTS}>
            <Button variant="primary">Просмотреть элементы конфигурации</Button>
          </Link>
        </Col>
      </Row>
    </Container>
  );
};