import { FC } from 'react';
import { Card, Button } from 'react-bootstrap';
import defaultImage from "../assets/Default.jpeg";
import './ElementCard.css';
import { api } from '../api';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

interface Props {
  id: number;
  name: string;
  price: number;
  category: string;
  image?: string;
  detail_text: string;
  onAddToDraft: () => void;  // Функция для обновления количества
  showAddButton?: boolean;  // Новый пропс для контроля отображения кнопки
}

export const ElementCard: FC<Props> = ({
  id,
  name,
  price,
  category,
  image,
  onAddToDraft,
  showAddButton = true,  // По умолчанию кнопка отображается
}) => {

  const handleAddToDraft = async (id: number) => {
    try {
      console.log("Добавляем элемент с ID:", id);  // Печатаем ID добавляемого элемента
      const response = await api.planeConfigurationElement.planeConfigurationElementCreate(id, {
        withCredentials: true, // Убедитесь, что с запросом передаются куки
      });
      console.log("Элемент успешно добавлен:", response);
      alert("Элемент добавлен в заявку");
      onAddToDraft();  // Обновляем количество в корзине
    } catch (error: unknown) {
      console.error("Ошибка при добавлении элемента:", error);
  
      if (axios.isAxiosError(error)) {
        switch (error.response?.status) {
          case 400:
            alert("Этот элемент уже добавлен в конфигурацию.");
            break;
          case 401:
            alert("Необходима аутентификация. Пожалуйста, войдите в систему.");
            break;
          case 404:
            alert("Пользователь не найден.");
            break;
          default:
            alert("Произошла ошибка при добавлении элемента.");
        }
      } else {
        alert("Произошла ошибка. Повторите попытку позже.");
      }
    }
  };

  const navigate = useNavigate();

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
            <Button variant="success" onClick={() => handleAddToDraft(id)}>
              Добавить
            </Button>
          )}
          <Button variant="primary" onClick={handleMoreInfoClick} className="me-2">
            Подробнее
          </Button>
        </div>
      </Card.Body>
    </Card>
  );
};


export default ElementCard;