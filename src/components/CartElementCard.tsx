import { FC } from 'react';
import { Card, Button } from 'react-bootstrap';
import defaultImage from "../assets/Default.jpeg";
import './ElementCard.css';
import { useNavigate } from 'react-router-dom';

interface Props {
  id: number;
  name: string;
  price: number;
  category: string;
  image?: string;
}

export const CartElementCard: FC<Props> = ({
  id,
  name,
  price,
  category,
  image,
}) => {
  const navigate = useNavigate();

  const handleMoreInfoClick = () => {
    navigate(`/configuration-elements/${id}`);
  };

  return (
    <Card className="element-card cart-element-card h-100 d-flex flex-row justify-content-between">
      <div className="card-image-container" style={{ height: '200px', position: 'relative' }}>
		<Card.Img
			variant="top"
			src={image || defaultImage}
			alt={name}
			className="card-img-top"
			style={{
			objectFit: 'cover', // Обеспечивает сохранение пропорций и заполняет контейнер
			width: '100%',
			height: '100%', // Высота изображения будет равна высоте контейнера
			}}
		/>
		</div>
      <Card.Body className="d-flex flex-column justify-content-between card-details">
        <div>
          <Card.Title>{name}</Card.Title>
          <Card.Text>{category}</Card.Text>
          <Card.Text>Цена: $ {price}</Card.Text>
        </div>
        <Button variant="primary" onClick={handleMoreInfoClick}>
          Подробнее
        </Button>
      </Card.Body>
    </Card>
  );
};

export default CartElementCard;
