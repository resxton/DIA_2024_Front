import React, { FC } from 'react';
import { Card, Button } from 'react-bootstrap';
import defaultImage from "../assets/DefaultImage.png";
import './ElementCard.css';

interface Props {
  id: number;
  name: string;
  price: number;
  category: string;
  image: string;
  detail_text: string;
}

export const ElementCard: FC<Props> = ({ id, name, price, category, image, detail_text }) => {
  const handleMoreInfoClick = () => {
    window.location.href = `/configuration-element/${id}`;
  };

  return (
    <Card className="element-card h-100"> {/* Используем h-100 для полной высоты карточки */}
      <Card.Img
        variant="top"
        src={image || defaultImage}
        alt={name}
        className="card-img-top"
        style={{ 
          objectFit: 'cover', 
          width: '100%',  
          height: '200px'
        }}
      />
      <Card.Body className="d-flex flex-column justify-content-between">
        <div>
          <Card.Title>{name}</Card.Title>
          <Card.Text>{category}</Card.Text>
          <Card.Text>Цена: $ {price}</Card.Text>
        </div>
        <Button variant="primary" onClick={handleMoreInfoClick} className="mt-3">
          Подробнее
        </Button>
      </Card.Body>
    </Card>
  );
};
