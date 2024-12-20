import { FC } from 'react';
import { Card, Button } from 'react-bootstrap';
import defaultImage from "../assets/Default.jpeg";
import './ElementCard.css';
import { useDispatch, useSelector } from 'react-redux';
import { addElementToDraft, fetchConfigurationElements } from '../redux/configurationElementsSlice';  // Импортируем экшен
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '../Routes';
import { RootState } from '../redux/store';

interface Props {
  id: number;
  name: string;
  price: number;
  category: string;
  image?: string;
  detail_text: string;
  showAddButton?: boolean;  // Новый пропс для контроля отображения кнопки
}

export const ElementCard: FC<Props> = ({
  id,
  name,
  price,
  category,
  image,
  showAddButton = true,  // По умолчанию кнопка отображается
}) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { category: selectedCategory, minPrice, maxPrice } = useSelector(
    (state: RootState) => state.filter
  );

  const handleAddToDraft = async (id: number) => {
    try {
      console.log("Добавляем элемент с ID:", id);
      const action = await dispatch(addElementToDraft(id) as any);  // Запускаем asyncThunk
      if (addElementToDraft.fulfilled.match(action)) {
        dispatch(fetchConfigurationElements({ 
          category: selectedCategory, 
          price_min: minPrice, 
          price_max: maxPrice 
        }) as any);
      } else {
        alert("Произошла ошибка при добавлении элемента.");
      }
    } catch (error: unknown) {
      console.error("Ошибка при добавлении элемента:", error);
      alert("Произошла ошибка. Повторите попытку позже.");
    }
  };

  const handleMoreInfoClick = () => {
    navigate(`/configuration-elements/${id}`);
  };

  return (
    <Card className="element-card h-100">
      <Card.Img
        variant="top"
        src={image || defaultImage}
        alt={name}
        className="card-img-top"
        style={{
          objectFit: 'cover',
          width: '100%',
          height: '200px',
        }}
      />
      <Card.Body className="d-flex flex-column justify-content-between">
        <div>
          <Card.Title>{name}</Card.Title>
          <Card.Text>{category}</Card.Text>
          <Card.Text>Цена: $ {price}</Card.Text>
        </div>
        <div className="d-flex justify-content-between mt-3">
          {showAddButton && (
            <Button className="addButton" variant="success" onClick={() => handleAddToDraft(id)}>
              Добавить
            </Button>
          )}
          <Button variant="primary" onClick={handleMoreInfoClick} className="me-2 detailButton">
            Подробнее
          </Button>
        </div>
      </Card.Body>
    </Card>
  );
};

export default ElementCard;
