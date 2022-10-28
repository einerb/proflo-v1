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
  VERSE: (book: string, verse: string) =>
    `/api/books/`,
};
