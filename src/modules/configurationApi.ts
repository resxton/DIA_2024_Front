// Типы для элементов конфигурации

export interface ConfigurationElement {
	pk: number;  // Это id элемента
	name: string;
	price: number;
	key_info: string;
	category: string;
	image: string;
	detail_text: string;
	is_deleted: boolean;
  }
  
  // Тип для ответа от бэкенда
  export interface ConfigurationElementsResult {
	draft_configuration_id: number;
	draft_elements_count: number;
	configuration_elements: ConfigurationElement[];
  }
  
  // Получение элемента конфигурации по id
  export const getConfigurationElementById = async (
	id: number
  ): Promise<ConfigurationElement> => {
	try {
	  const response = await fetch(`/api/plane_configuration_element/${id}/`);
	  if (!response.ok) {
		throw new Error(`Не удалось получить элемент с id ${id}`);
	  }
	  return response.json();
	} catch (error) {
	  console.error(error);
	  throw error;
	}
  };
  
  // Функция с фильтрами
  export const getConfigurationElements = async (
	category: string = '',
	minPrice: number = 0,
	maxPrice: number = 100000000
  ): Promise<ConfigurationElementsResult> => {
	try {
	  // Изменяем параметры на `price_min` и `price_max`
	  const url = `/api/plane_configuration_elements/?category=${category}&price_min=${minPrice}&price_max=${maxPrice}`;
	  const response = await fetch(url);
	  if (!response.ok) {
		throw new Error('Не удалось получить элементы по фильтрам');
	  }
	  return response.json();
	} catch (error) {
	  console.error(error);
	  throw error;
	}
  };
  
  