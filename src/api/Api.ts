/* eslint-disable */
/* tslint:disable */
/*
 * ---------------------------------------------------------------
 * ## THIS FILE WAS GENERATED VIA SWAGGER-TYPESCRIPT-API        ##
 * ##                                                           ##
 * ## AUTHOR: acacode                                           ##
 * ## SOURCE: https://github.com/acacode/swagger-typescript-api ##
 * ---------------------------------------------------------------
 */

export interface LoginResponse {
  message: string;
  is_staff: boolean;
}

export interface ConfigurationMap {
  /** Id */
  id?: number;
  /**
   * Count
   * @min -2147483648
   * @max 2147483647
   */
  count: number;
  /** Configuration */
  configuration: number;
  /** Element */
  element: number;
}

export interface PlaneConfigurationListResponse {
  configurations: Array<{
    pk: number;
    name: string;
    status: string;
    created_at: string; // Дата создания в строковом формате (например, ISO 8601)
    creator: string | null; // Имя пользователя создателя
    moderator: string | null; // Имя пользователя модератора
    [key: string]: any; // Для других возможных полей, которые могут быть в ответе
  }>;
}


export interface Configuration {
  /** ID */
  pk: number;
  /** Status */
  status: "draft" | "deleted" | "created" | "completed" | "rejected";
  /**
   * Created at
   * @format date-time
   */
  created_at?: string;
  /**
   * Updated at
   * @format date-time
   */
  updated_at?: string | null;
  /**
   * Completed at
   * @format date-time
   */
  completed_at?: string | null;
  /**
   * Customer name
   * @minLength 1
   * @maxLength 255
   */
  customer_name?: string | null;
  /**
   * Customer phone
   * @minLength 1
   * @maxLength 20
   */
  customer_phone?: string | null;
  /**
   * Customer email
   * @minLength 1
   * @maxLength 255
   */
  customer_email?: string | null;
  /**
   * Total price
   * @format decimal
   */
  total_price?: string | null;
  /** Creator */
  creator?: number | null;
  /** Moderator */
  moderator?: number | null;
  /**
   * Plane
   * @minLength 1
   * @maxLength 255
   */
  plane?: string | null;
  /** User */
  user?: string;
}
export interface PlaneConfigurationResponse {
  configuration: Configuration;
  configuration_elements: ConfigurationElement[];
  counts: number[];
}

export interface ConfigurationElement {
  /** ID */
  pk: number;
  /**
   * Name
   * @minLength 1
   * @maxLength 255
   */
  name: string;
  /**
   * Price
   * @format decimal
   */
  price: number;
  /**
   * Key info
   * @minLength 1
   * @maxLength 255
   */
  key_info: string;
  /**
   * Category
   * @minLength 1
   * @maxLength 255
   */
  category: string;
  /**
   * Image
   * @format uri
   * @minLength 1
   * @maxLength 200
   */
  image: string;
  /**
   * Detail text
   * @minLength 1
   */
  detail_text: string;
  /** Is deleted */
  is_deleted: boolean;
}

export interface ConfigurationElementsResult {
	draft_configuration_id: number | undefined;
	draft_elements_count: number;
	configuration_elements: ConfigurationElement[] | [];
  }

export interface User {
  /** ID */
  id?: number;
  /**
   * Is staff
   * @default false
   */
  is_staff?: boolean;
  /**
   * Is superuser
   * @default false
   */
  is_superuser?: boolean;
  /**
   * Password
   * @minLength 1
   */
  password?: string;
  /**
   * Username
   * @minLength 1
   */
  username?: string;
  /**
   * First name
   * @maxLength 150
   */
  first_name?: string;
  /**
   * Last name
   * @maxLength 150
   */
  last_name?: string;
  /**
   * Email
   * @format email
   * @maxLength 254
   */
  email?: string;
  /** Is active? */
  is_active?: boolean;
  /**
   * Date joined
   * @format date-time
   */
  date_joined?: string;
  /**
   * Last login
   * @format date-time
   */
  last_login?: string | null;
  /**
   * The groups this user belongs to. A user will get all permissions granted to each of their groups.
   * @uniqueItems true
   */
  groups?: number[];
  /**
   * Specific permissions for this user.
   * @uniqueItems true
   */
  user_permissions?: number[];
}

import type { AxiosInstance, AxiosRequestConfig, AxiosResponse, HeadersDefaults, ResponseType } from "axios";
import axios from "axios";

export type QueryParamsType = Record<string | number, any>;

export interface FullRequestParams extends Omit<AxiosRequestConfig, "data" | "params" | "url" | "responseType"> {
  /** set parameter to `true` for call `securityWorker` for this request */
  secure?: boolean;
  /** request path */
  path: string;
  /** content type of request body */
  type?: ContentType;
  /** query params */
  query?: QueryParamsType;
  /** format of response (i.e. response.json() -> format: "json") */
  format?: ResponseType;
  /** request body */
  body?: unknown;
}

export type RequestParams = Omit<FullRequestParams, "body" | "method" | "query" | "path">;

export interface ApiConfig<SecurityDataType = unknown> extends Omit<AxiosRequestConfig, "data" | "cancelToken"> {
  securityWorker?: (
    securityData: SecurityDataType | null,
  ) => Promise<AxiosRequestConfig | void> | AxiosRequestConfig | void;
  secure?: boolean;
  format?: ResponseType;
}

export enum ContentType {
  Json = "application/json",
  FormData = "multipart/form-data",
  UrlEncoded = "application/x-www-form-urlencoded",
  Text = "text/plain",
}

export class HttpClient<SecurityDataType = unknown> {
  public instance: AxiosInstance;
  private securityData: SecurityDataType | null = null;
  private securityWorker?: ApiConfig<SecurityDataType>["securityWorker"];
  private secure?: boolean;
  private format?: ResponseType;

  constructor({ securityWorker, secure, format, ...axiosConfig }: ApiConfig<SecurityDataType> = {}) {
    this.instance = axios.create({ ...axiosConfig, baseURL: axiosConfig.baseURL || "http://127.0.0.1:8000" });
    this.secure = secure;
    this.format = format;
    this.securityWorker = securityWorker;
  }

  public setSecurityData = (data: SecurityDataType | null) => {
    this.securityData = data;
  };

  protected mergeRequestParams(params1: AxiosRequestConfig, params2?: AxiosRequestConfig): AxiosRequestConfig {
    const method = params1.method || (params2 && params2.method);

    return {
      ...this.instance.defaults,
      ...params1,
      ...(params2 || {}),
      headers: {
        ...((method && this.instance.defaults.headers[method.toLowerCase() as keyof HeadersDefaults]) || {}),
        ...(params1.headers || {}),
        ...((params2 && params2.headers) || {}),
      },
    };
  }

  protected stringifyFormItem(formItem: unknown) {
    if (typeof formItem === "object" && formItem !== null) {
      return JSON.stringify(formItem);
    } else {
      return `${formItem}`;
    }
  }

  protected createFormData(input: Record<string, unknown>): FormData {
    if (input instanceof FormData) {
      return input;
    }
    return Object.keys(input || {}).reduce((formData, key) => {
      const property = input[key];
      const propertyContent: any[] = property instanceof Array ? property : [property];

      for (const formItem of propertyContent) {
        const isFileType = formItem instanceof Blob || formItem instanceof File;
        formData.append(key, isFileType ? formItem : this.stringifyFormItem(formItem));
      }

      return formData;
    }, new FormData());
  }

  public request = async <T = any, _E = any>({
    secure,
    path,
    type,
    query,
    format,
    body,
    ...params
  }: FullRequestParams): Promise<AxiosResponse<T>> => {
    const secureParams =
      ((typeof secure === "boolean" ? secure : this.secure) &&
        this.securityWorker &&
        (await this.securityWorker(this.securityData))) ||
      {};
    const requestParams = this.mergeRequestParams(params, secureParams);
    const responseFormat = format || this.format || undefined;

    if (type === ContentType.FormData && body && body !== null && typeof body === "object") {
      body = this.createFormData(body as Record<string, unknown>);
    }

    if (type === ContentType.Text && body && body !== null && typeof body !== "string") {
      body = JSON.stringify(body);
    }

    return this.instance.request({
      ...requestParams,
      headers: {
        ...(requestParams.headers || {}),
        ...(type ? { "Content-Type": type } : {}),
      },
      params: query,
      responseType: responseFormat,
      data: body,
      url: path,
    });
  };
}

/**
 * @title Configuration Management API
 * @version v1
 * @license BSD License
 * @termsOfService https://www.nimbus.ru/terms/
 * @baseUrl http://127.0.0.1:8000
 * @contact <support@nimbus.ru>
 *
 * API для управления конфигурациями и услугами. Позволяет создавать, обновлять и удалять конфигурации, а также управлять элементами услуг, связанными с ними. Поддерживает аутентификацию пользователей и предоставляет интерфейс для взаимодействия с данными о клиентах и их запросами.
 */
export class Api<SecurityDataType extends unknown> extends HttpClient<SecurityDataType> {
  configurationMap = {
    /**
     * Обновить количество элемента в конфигурации
     * 
     * @tags configuration_map
     * @name ConfigurationMapUpdate
     * @summary Обновить количество элемента в конфигурации
     * @request PUT:/configuration_map/{configuration_id}/{element_id}/
     * @secure
     */
    configurationMapUpdate: (
      data: {
        count?: number;
      },
      configurationId: number,  // Параметр для конфигурации
      elementId: number,  // Параметр для элемента
      params: RequestParams = {},
    ) =>
      this.request<ConfigurationMap, void>({
        path: `/configuration_map/`,  // Путь без ID
        method: "PUT",
        body: data,  // Тело запроса передает count
        secure: true,
        type: ContentType.Json,
        format: "json",
        query: {
          configuration_id: configurationId,  // Параметр query для конфигурации
          element_id: elementId,  // Параметр query для элемента
          ...params,  // Добавляем другие параметры запроса
        },
      }),
  
    /**
     * Удалить элемент из конфигурации по идентификаторам
     *
     * @tags configuration_map
     * @name ConfigurationMapDelete
     * @summary Удалить элемент из конфигурации по идентификаторам
     * @request DELETE:/configuration_map/
     * @secure
     */
    configurationMapDelete: (
      configurationId: number,  // Параметр для конфигурации
      elementId: number,  // Параметр для элемента
      params: RequestParams = {},
    ) =>
      this.request<void, void>({
        path: `/configuration_map/`,  // Путь без ID
        method: "DELETE",
        secure: true,
        query: {
          configuration_id: configurationId,  // Параметр query для конфигурации
          element_id: elementId,  // Параметр query для элемента
          ...params,  // Добавляем другие параметры запроса
        },
      }),
  };
  
  login = {
    /**
     * Вход в систему.
     *
     * @tags login
     * @name LoginCreate
     * @summary Войти в систему
     * @request POST:/login/
     * @secure
     */
    loginCreate: (
      data: {
        username?: string;
        password?: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<LoginResponse, void>({
        path: `/login/`,
        method: "POST",
        body: data,
        secure: true,
        withCredentials: true,  // Включаем отправку кук
        type: ContentType.Json,
        ...params,
      }),
  };
  logout = {
    /**
     * No description
     *
     * @tags logout
     * @name LogoutCreate
     * @summary Выйти из системы
     * @request POST:/logout/
     * @secure
     */
    logoutCreate: (params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/logout/`,
        method: "POST",
        secure: true,
        ...params,
      }),
  };
  planeConfigurations = {
    /**
     * Получить список конфигураций с возможностью фильтрации по статусу и дате создания
     *
     * @tags plane_configuration
     * @name PlaneConfigurationList
     * @summary Получить список конфигураций с фильтрацией
     * @request GET:/plane_configuration/
     * @secure
     */
    planeConfigurationList: (query: { status?: string; created_after?: string; created_before?: string } = {}, params: RequestParams = {}) =>
      this.request<PlaneConfigurationListResponse, any>({
        path: "/plane_configurations/",
        method: "GET",
        query: query,
        secure: true,
        ...params,
      })
    }

  planeConfiguration = {
  /**
   * Получить конфигурацию по идентификатору с её элементами и изображениями
   *
   * @tags plane_configuration
   * @name PlaneConfigurationRead
   * @summary Получить конфигурацию по идентификатору с её элементами и изображениями
   * @request GET:/plane_configuration/{id}/
   * @secure
   */
  planeConfigurationRead: (id: string, params: RequestParams = {}) =>
    this.request<PlaneConfigurationResponse, any>({
      path: `/plane_configuration/${id}/`,
      method: "GET",
      secure: true,
      ...params,
    }),


    /**
     * No description
     *
     * @tags plane_configuration
     * @name PlaneConfigurationUpdate
     * @summary Обновить конфигурацию по идентификатору
     * @request PUT:/plane_configuration/{id}/
     * @secure
     */
    planeConfigurationUpdate: (id: string, data: Configuration, params: RequestParams = {}) =>
      this.request<Configuration, void>({
        path: `/plane_configuration/${id}/`,
        method: "PUT",
        body: data,
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags plane_configuration
     * @name PlaneConfigurationDelete
     * @summary Удалить конфигурацию, обновив её статус на 'deleted'
     * @request DELETE:/plane_configuration/{id}/
     * @secure
     */
    planeConfigurationDelete: (id: number, params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/plane_configuration/${id}/`,
        method: "DELETE",
        secure: true,
        ...params,
      }),

    /**
     * No description
     *
     * @tags plane_configuration
     * @name PlaneConfigurationAcceptRejectUpdate
     * @summary Завершить или отклонить заявку, обновив её статус
     * @request PUT:/plane_configuration/{id}/accept-reject/
     * @secure
     */
    planeConfigurationAcceptRejectUpdate: (id: string, data: Configuration, params: RequestParams = {}) =>
      this.request<Configuration, any>({
        path: `/plane_configuration/${id}/accept-reject/`,
        method: "PUT",
        body: data,
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags plane_configuration
     * @name PlaneConfigurationSubmitUpdate
     * @summary Сформировать заявку, обновив её статус на 'Сформирована'
     * @request PUT:/plane_configuration/{id}/submit/
     * @secure
     */
    planeConfigurationSubmitUpdate: (id: string, params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/plane_configuration/${id}/submit/`,
        method: "PUT",
        secure: true,
        ...params,
      }),
  };
  planeConfigurationElement = {
    /**
     * No description
     *
     * @tags plane_configuration_element
     * @name PlaneConfigurationElementRead
     * @summary Получить информацию об элементе конфигурации по его идентификатору
     * @request GET:/plane_configuration_element/{id}/
     * @secure
     */
    planeConfigurationElementRead: (id: string, params: RequestParams = {}) =>
      this.request<ConfigurationElement, any>({
        path: `/plane_configuration_element/${id}/`,
        method: "GET",
        secure: true,
        ...params,
      }),

    /**
     * No description
     *
     * @tags plane_configuration_element
     * @name PlaneConfigurationElementCreate
     * @summary Добавить элемент в заявку-черновик пользователя
     * @request POST:/plane_configuration_element/{id}/
     * @secure
     */
    planeConfigurationElementCreate: (id: number, params: RequestParams = {}) =>
      this.request<void, void>({
        path: `/plane_configuration_element/${id}/`,
        method: "POST",
        secure: true,
        ...params,
      }),

    /**
     * No description
     *
     * @tags plane_configuration_element
     * @name PlaneConfigurationElementDelete
     * @summary Удалить элемент конфигурации и связанное с ним изображение
     * @request DELETE:/plane_configuration_element/{id}/
     * @secure
     */
    planeConfigurationElementDelete: (id: string, params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/plane_configuration_element/${id}/`,
        method: "DELETE",
        secure: true,
        ...params,
      }),

    /**
     * No description
     *
     * @tags plane_configuration_element
     * @name PlaneConfigurationElementEditCreate
     * @summary Заменить изображение элемента конфигурации, удалив предыдущее
     * @request POST:/plane_configuration_element/{id}/edit/
     * @secure
     */
    planeConfigurationElementEditCreate: (
      id: string,
      data: {
        /** @format binary */
        pic?: File;
      },
      params: RequestParams = {},
    ) =>
      this.request<
        {
          message?: string;
        },
        void
      >({
        path: `/plane_configuration_element/${id}/edit/`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.FormData,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags plane_configuration_element
     * @name PlaneConfigurationElementEditUpdate
     * @summary Обновить информацию об элементе конфигурации
     * @request PUT:/plane_configuration_element/{id}/edit/
     * @secure
     */
    planeConfigurationElementEditUpdate: (id: string, data: ConfigurationElement, params: RequestParams = {}) =>
      this.request<ConfigurationElement, void>({
        path: `/plane_configuration_element/${id}/edit/`,
        method: "PUT",
        body: data,
        secure: true,
        format: "json",
        ...params,
      }),
  };
  planeConfigurationElements = {
    /**
     * No description
     *
     * @tags plane_configuration_elements
     * @name PlaneConfigurationElementsList
     * @summary Получить список элементов с фильтрацией и добавлением id заявки-черновика
     * @request GET:/plane_configuration_elements/
     * @secure
     */
    planeConfigurationElementsList: (
      query?: {
        /** Фильтрация по категории */
        category?: string;
        /** Минимальная цена для фильтрации */
        price_min?: number;
        /** Максимальная цена для фильтрации */
        price_max?: number;
      },
      params: RequestParams = {},
    ) =>
      this.request<
        {
          draft_configuration_id?: number | null;
          draft_elements_count?: number;
          configuration_elements?: ConfigurationElement[];
        },
        void
      >({
        path: `/plane_configuration_elements/`,
        method: "GET",
        query: query,
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags plane_configuration_elements
     * @name PlaneConfigurationElementsCreate
     * @summary Создать новый элемент конфигурации
     * @request POST:/plane_configuration_elements/
     * @secure
     */
    planeConfigurationElementsCreate: (data: ConfigurationElement, params: RequestParams = {}) =>
      this.request<ConfigurationElement, void>({
        path: `/plane_configuration_elements/`,
        method: "POST",
        body: data,
        secure: true,
        format: "json",
        ...params,
      }),
  };

  user = {
    /**
     * @description Класс, описывающий методы работы с пользователями. Осуществляет связь с таблицей пользователей в базе данных.
     *
     * @tags user
     * @name UserList
     * @request GET:/user/
     * @secure
     */
    userList: (params: RequestParams = {}) =>
      this.request<User[], any>({
        path: `/user/`,
        method: "GET",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * @description Функция регистрации новых пользователей. Если пользователя с указанным username ещё нет, в БД будет добавлен новый пользователь.
     *
     * @tags user
     * @name UserCreate
     * @request POST:/user/
     * @secure
     */
    userCreate: (data: User, params: RequestParams = {}) =>
      this.request<User, any>({
        path: `/user/`,
        method: "POST",
        body: data,
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * @description Класс, описывающий методы работы с пользователями. Осуществляет связь с таблицей пользователей в базе данных.
     *
     * @tags user
     * @name UserRead
     * @request GET:/user/{id}/
     * @secure
     */
    userRead: (id: number, params: RequestParams = {}) =>
      this.request<User, any>({
        path: `/user/${id}/`,
        method: "GET",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * @description Класс, описывающий методы работы с пользователями. Осуществляет связь с таблицей пользователей в базе данных.
     *
     * @tags user
     * @name UserUpdate
     * @request PUT:/user/{id}/
     * @secure
     */
    userUpdate: (id: number, data: User, params: RequestParams = {}) =>
      this.request<User, any>({
        path: `/user/${id}/`,
        method: "PUT",
        body: data,
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * @description Класс, описывающий методы работы с пользователями. Осуществляет связь с таблицей пользователей в базе данных.
     *
     * @tags user
     * @name UserPartialUpdate
     * @request PATCH:/user/{id}/
     * @secure
     */
    userPartialUpdate: (id: number, data: User, params: RequestParams = {}) =>
      this.request<User, any>({
        path: `/user/${id}/`,
        method: "PATCH",
        body: data,
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * @description Класс, описывающий методы работы с пользователями. Осуществляет связь с таблицей пользователей в базе данных.
     *
     * @tags user
     * @name UserDelete
     * @request DELETE:/user/{id}/
     * @secure
     */
    userDelete: (id: number, params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/user/${id}/`,
        method: "DELETE",
        secure: true,
        ...params,
      }),

      /**
       * @description Метод для получения ID пользователя по логину.
       *
       * @tags user
       * @name UserGetIdByUsername
       * @request GET:/user/get-id-by-username
       * @secure
       */
      userGetIdByUsername: (username: string, params: RequestParams = {}) =>
      this.request<{ id: number }, any>({
        path: `/user/get-id-by-username`,
        method: "GET",
        query: { username },
        secure: true,
        format: "json",
        ...params,
      }),
  };
  users = {
    /**
     * No description
     *
     * @tags users
     * @name UsersList
     * @summary Получить список всех пользователей
     * @request GET:/users/
     * @secure
     */
    usersList: (params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/users/`,
        method: "GET",
        secure: true,
        ...params,
      }),

    /**
     * No description
     *
     * @tags users
     * @name UsersCreate
     * @summary Создать нового пользователя
     * @request POST:/users/
     * @secure
     */
    usersCreate: (data: User, params: RequestParams = {}) =>
      this.request<User, any>({
        path: `/users/`,
        method: "POST",
        body: data,
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags users
     * @name UsersUpdate
     * @summary Обновить информацию о пользователе
     * @request PUT:/users/
     * @secure
     */
    usersUpdate: (data: User, params: RequestParams = {}) =>
      this.request<User, any>({
        path: `/users/`,
        method: "PUT",
        body: data,
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags users
     * @name UsersRead
     * @summary Получить список всех пользователей
     * @request GET:/users/{id}/
     * @secure
     */
    usersRead: (id: string, params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/users/${id}/`,
        method: "GET",
        secure: true,
        ...params,
      }),

    /**
     * No description
     *
     * @tags users
     * @name UsersCreate2
     * @summary Создать нового пользователя
     * @request POST:/users/{id}/
     * @originalName usersCreate
     * @duplicate
     * @secure
     */
    usersCreate2: (id: string, data: User, params: RequestParams = {}) =>
      this.request<User, any>({
        path: `/users/${id}/`,
        method: "POST",
        body: data,
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags users
     * @name UsersUpdate2
     * @summary Обновить информацию о пользователе
     * @request PUT:/users/{id}/
     * @originalName usersUpdate
     * @duplicate
     * @secure
     */
    usersUpdate2: (id: string, data: User, params: RequestParams = {}) =>
      this.request<User, any>({
        path: `/users/${id}/`,
        method: "PUT",
        body: data,
        secure: true,
        format: "json",
        ...params,
      }),
  };
}
