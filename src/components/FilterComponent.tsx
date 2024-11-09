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
  const [category, setCategory] = useState(selectedCategory || '');
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
    <Form onSubmit={handleSubmit} className="filter-form mb-4">
      {/* Первая строка — категория с Dropdown */}
      <Form.Group as={Row} className="mb-3" controlId="categories">
        <Form.Label column sm={1}>
          Категория
        </Form.Label>
        <Col sm={6}>
          <Dropdown>
            <Dropdown.Toggle id="dropdown-category">
              {category || 'Выберите категорию'}
            </Dropdown.Toggle>

            <Dropdown.Menu>
              <Dropdown.Item onClick={() => handleCategorySelect('')}>
                Выберите категорию
              </Dropdown.Item>
              <Dropdown.Item onClick={() => handleCategorySelect('Компоновка салона')}>
                Компоновка салона
              </Dropdown.Item>
              <Dropdown.Item onClick={() => handleCategorySelect('Дизайн салона')}>
                Дизайн салона
              </Dropdown.Item>
              <Dropdown.Item onClick={() => handleCategorySelect('Авионика')}>
                Авионика
              </Dropdown.Item>
              <Dropdown.Item onClick={() => handleCategorySelect('Двигатель')}>
                Двигатель
              </Dropdown.Item>
              <Dropdown.Item onClick={() => handleCategorySelect('Кресло')}>
                Кресло
              </Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        </Col>
      </Form.Group>

      {/* Вторая строка — цена от и до */}
      <Form.Group as={Row} className="mb-3">
        <Form.Label column sm={1}>
          Цена от
        </Form.Label>
        <Col sm={3}>
          <Form.Control
            type="number"
            name="price_min"
            value={minPrice}
            onChange={handleMinPriceChange}
            placeholder="0"
          />
        </Col>
      </Form.Group>
      <Form.Group as={Row} className="mb-3">
        <Form.Label column sm={1}>
          до
        </Form.Label>
        <Col sm={3}>
          <Form.Control
            type="number"
            name="price_max"
            value={maxPrice}
            onChange={handleMaxPriceChange}
            placeholder="∞"
          />
        </Col>
      </Form.Group>

      <Button type="submit" className="filter-btn">
        Фильтровать
      </Button>
    </Form>
  );
};
