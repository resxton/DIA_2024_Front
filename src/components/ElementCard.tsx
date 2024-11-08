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
    <Card className="element-card">
      <Card.Img
        variant="top"
        src={image || defaultImage}
        alt={name}
        style={{ height: '200px', objectFit: 'cover' }}
      />
      <Card.Body>
        <Card.Title>{name}</Card.Title>
        <Card.Text>{category}</Card.Text>
        <Card.Text>Цена: ${price}</Card.Text>
        <Button variant="primary" onClick={handleMoreInfoClick}>
          Подробнее
        </Button>
      </Card.Body>
    </Card>
  );
};
