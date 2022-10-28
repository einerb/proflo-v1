import { environment } from '../../environments/environment';

const addPagination = (page: number, elements: number) =>
  `?pageNumber=${page}&pageElements=${elements}`;
const addPaginationWithDates = (
  page: number,
  elements: number,
  start: string,
  end: string
) => `${addPagination(page, elements)}&start=${start}&end=${end}`;

export const Endpoint = {
  AUTH: {
    LOGIN: environment.apiHost + environment.apiVersion + 'auth/login',
  },
  SCHEDULE: {
    BASE: environment.apiHost + environment.apiVersion + 'schedule',
    ALL: (
      page: number,
      elements: number,
      start: string,
      end: string,
      journey: string
    ) =>
      environment.apiHost +
      environment.apiVersion +
      'schedule' +
      addPaginationWithDates(page, elements, start, end) +
      `&journey=${journey}`,
  },
  PROJECT: {
    BASE: environment.apiHost + environment.apiVersion + 'project',
    ID: (name: string, start: string, end: string) =>
      environment.apiHost +
      environment.apiVersion +
      `project/${name}?start=${start}&end=${end}`,
  },
  EMPLOYEE: {
    BASE: environment.apiHost + environment.apiVersion + 'employee',
    ALL: (occupation: string) => environment.apiHost + environment.apiVersion + `project/occupation/${occupation}`,
    BYID: (
      identification: number,
      page: number,
      elements: number,
      start: string,
      end: string
    ) =>
      environment.apiHost +
      environment.apiVersion +
      `employee/${identification}` +
      addPaginationWithDates(page, elements, start, end),
    GETOCCUPATION: environment.apiHost + environment.apiVersion + 'project/occupations',
  },
  USER: {
    BASE: environment.apiHost + environment.apiVersion + 'user',
  },
};
