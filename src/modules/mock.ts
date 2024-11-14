import { ConfigurationElementsResult } from "./configurationApi";

export const ELEMENTS_MOCK: ConfigurationElementsResult = {
  draft_configuration_id: 123,
  draft_elements_count: 5,
  configuration_elements: [
    {
      pk: 1,
      name: 'Элемент 1',
      price: 1000,
      key_info: 'Информация о элементе 1',
      category: 'Категория 1',
      image: '',
      detail_text: 'Детальное описание элемента 1',
      is_deleted: false,
    },
    {
      pk: 2,
      name: 'Элемент 2',
      price: 2000,
      key_info: 'Информация о элементе 2',
      category: 'Категория 2',
      image: '',
      detail_text: 'Детальное описание элемента 2',
      is_deleted: false,
    },
    {
      pk: 3,
      name: 'Элемент 3',
      price: 3000,
      key_info: 'Информация о элементе 3',
      category: 'Категория 3',
      image: '',
      detail_text: 'Детальное описание элемента 3',
      is_deleted: false,
    },
  ],
};
