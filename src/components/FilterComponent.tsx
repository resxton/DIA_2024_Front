import React, { useState } from "react";
import { Form, Button, Row, Col, Dropdown } from "react-bootstrap";

interface FilterComponentProps {
  selectedCategory: string;
  selectedPriceMin: number;
  selectedPriceMax: number;
  onFilterChange: (category: string, minPrice: number, maxPrice: number) => void;
}

export const FilterComponent: React.FC<FilterComponentProps> = ({ 
  selectedCategory, 
  selectedPriceMin, 
  selectedPriceMax, 
  onFilterChange 
}) => {
  const [category, setCategory] = useState(selectedCategory);
  const [minPrice, setMinPrice] = useState(selectedPriceMin);
  const [maxPrice, setMaxPrice] = useState(selectedPriceMax);

  const handleCategorySelect = (category: string) => {
    setCategory(category);
  };

  const handleMinPriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMinPrice(Number(e.target.value));
  };

  const handleMaxPriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMaxPrice(Number(e.target.value));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onFilterChange(category, minPrice, maxPrice);
  };

  return (
    <Form onSubmit={handleSubmit} className="filter-form">
      <Row>
        {/* Первая строка — категория с Dropdown */}
        <Col xs={12}>
          <Form.Group controlId="categories">
            <Form.Label>Категория</Form.Label>
            <Dropdown>
              <Dropdown.Toggle variant="success" id="dropdown-category">
                {category || 'Выберите категорию'}
              </Dropdown.Toggle>

              <Dropdown.Menu>
                <Dropdown.Item onClick={() => handleCategorySelect('Компоновка салона')}>Компоновка салона</Dropdown.Item>
                <Dropdown.Item onClick={() => handleCategorySelect('Дизайн салона')}>Дизайн салона</Dropdown.Item>
                <Dropdown.Item onClick={() => handleCategorySelect('Авионика')}>Авионика</Dropdown.Item>
                <Dropdown.Item onClick={() => handleCategorySelect('Двигатель')}>Двигатель</Dropdown.Item>
                <Dropdown.Item onClick={() => handleCategorySelect('Кресло')}>Кресло</Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
          </Form.Group>
        </Col>
      </Row>

      <Row>
        {/* Вторая строка — цены */}
        <Col xs={12} md={6}>
          <Form.Group controlId="priceMin">
            <Form.Label>Цена от</Form.Label>
            <Form.Control
              type="number"
              name="price_min"
              value={minPrice}
              onChange={handleMinPriceChange}
              placeholder="0"
            />
          </Form.Group>
        </Col>

        <Col xs={12} md={6}>
          <Form.Group controlId="priceMax">
            <Form.Label>до</Form.Label>
            <Form.Control
              type="number"
              name="price_max"
              value={maxPrice}
              onChange={handleMaxPriceChange}
              placeholder="∞"
            />
          </Form.Group>
        </Col>
      </Row>

      <Button type="submit" className="filter-btn">
        Фильтровать
      </Button>
    </Form>
  );
};
