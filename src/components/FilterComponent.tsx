import React from "react";
import { Form, Button, Row, Col, Dropdown } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../redux/store";
import { setCategory, setMinPrice, setMaxPrice } from "../redux/filterSlice";

interface FilterComponentProps {
  selectedCategory: string;
  selectedPriceMin: number;
  selectedPriceMax: number;
  onFilterChange: (category: string, minPrice: number, maxPrice: number) => void;
}

export const FilterComponent: React.FC<FilterComponentProps> = ({ 
  onFilterChange 
}) => {
  // const [category, setCategory] = useState(selectedCategory || '');
  // const [minPrice, setMinPrice] = useState(selectedPriceMin);
  // const [maxPrice, setMaxPrice] = useState(selectedPriceMax);

  const dispatch = useDispatch();
  const { category, minPrice, maxPrice } = useSelector((state: RootState) => state.filter);


  const handleCategorySelect = (category: string) => {
    dispatch(setCategory(category));
  };
  
  const handleMinPriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    dispatch(setMinPrice(Number(e.target.value)));
  };
  
  const handleMaxPriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    dispatch(setMaxPrice(Number(e.target.value)));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onFilterChange(category, minPrice, maxPrice);
  };

  console.log("Current Filters: ", { category, minPrice, maxPrice }); // Добавьте это для отладки


  return (
    <Form onSubmit={handleSubmit} className="filter-form mb-4">
      {/* Первая строка — категория с Dropdown */}
      <Form.Group as={Row} className="mb-3">
        <Form.Label column sm={2} htmlFor="dropdown-category">
          Категория
        </Form.Label>
        <Col sm={5}>
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
        <Form.Label column sm={2} htmlFor="price_min">
          Цена от
        </Form.Label>
        <Col sm={4}>
          <Form.Control
            type="number"
            id="price_min"
            name="price_min"
            value={minPrice}
            onChange={handleMinPriceChange}
            placeholder="0"
          />
        </Col>
      </Form.Group>
      <Form.Group as={Row} className="mb-3">
        <Form.Label column sm={2} htmlFor="price_max">
          до
        </Form.Label>
        <Col sm={4}>
          <Form.Control
            type="number"
            id="price_max"
            name="price_max"
            value={maxPrice}
            onChange={handleMaxPriceChange}
            placeholder="100000000"
          />
        </Col>
      </Form.Group>

      <Button type="submit" className="filter-btn">
        Фильтровать
      </Button>
    </Form>
  );
};
