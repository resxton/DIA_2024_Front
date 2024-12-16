import React from "react";
import { Form, Button, Row, Col, Dropdown } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../redux/store";
import { setStatus, setStartDate, setEndDate } from "../redux/filterSlice";

interface ConfigurationFilterElementProps {
  selectedStatus: string;
  selectedStartDate: string;
  selectedEndDate: string;
  onFilterChange: (status: string, startDate: string, endDate: string) => void;
}

export const ConfigurationFilterElement: React.FC<ConfigurationFilterElementProps> = ({ 
  onFilterChange 
}) => {
  const dispatch = useDispatch();
  const { status, startDate, endDate } = useSelector((state: RootState) => state.filter);

  const statusMap: Record<string, string> = {
    'draft': 'Черновик',
    'deleted': 'Удалена',
    'created': 'Сформирована',
    'completed': 'Завершена',
    'rejected': 'Отклонена',
  };

  const getHumanReadableStatus = (serverStatus: string) => {
    return statusMap[serverStatus] || 'Выберите статус';
  };

  const handleStatusSelect = (status: string) => {
    dispatch(setStatus(status));
  };

  const handleStartDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    dispatch(setStartDate(e.target.value));
  };

  const handleEndDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    dispatch(setEndDate(e.target.value));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onFilterChange(status, startDate, endDate);
  };

  return (
    <Form onSubmit={handleSubmit} className="filter-form mb-4">
      {/* Первая строка — статус с Dropdown */}
      <Form.Group as={Row} className="mb-3">
        <Form.Label column sm={2} htmlFor="dropdown-status">
          Статус
        </Form.Label>
        <Col sm={5}>
          <Dropdown>
            <Dropdown.Toggle id="dropdown-status">
              {getHumanReadableStatus(status) || 'Выберите статус'}
            </Dropdown.Toggle>

            <Dropdown.Menu>
              <Dropdown.Item onClick={() => handleStatusSelect('')}>
                Выберите статус
              </Dropdown.Item>
              <Dropdown.Item onClick={() => handleStatusSelect('created')}>
                Сформирована
              </Dropdown.Item>
              <Dropdown.Item onClick={() => handleStatusSelect('rejected')}>
                Отклонена
              </Dropdown.Item>
			  <Dropdown.Item onClick={() => handleStatusSelect('completed')}>
                Завершена
              </Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        </Col>
      </Form.Group>

      {/* Вторая строка — дата от */}
      <Form.Group as={Row} className="mb-3">
        <Form.Label column sm={2} htmlFor="start_date">
          От
        </Form.Label>
        <Col sm={4}>
          <Form.Control
            type="date"
            id="start_date"
            name="start_date"
            value={startDate}
            onChange={handleStartDateChange}
          />
        </Col>
      </Form.Group>

      {/* Третья строка — дата до */}
      <Form.Group as={Row} className="mb-3">
        <Form.Label column sm={2} htmlFor="end_date">
          До
        </Form.Label>
        <Col sm={4}>
          <Form.Control
            type="date"
            id="end_date"
            name="end_date"
            value={endDate}
            onChange={handleEndDateChange}
          />
        </Col>
      </Form.Group>

      <Button type="submit" className="filter-btn">
        Фильтровать
      </Button>
    </Form>
  );
};
