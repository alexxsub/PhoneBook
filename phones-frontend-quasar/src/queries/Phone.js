//для языка sdl
import gql from 'graphql-tag'

//Описание GraphQL запросы на sdl языке
//sdl запрос на чтение
export const READ_PHONES = gql`
      query readPhones {
        readPhones {
          id,
          number
          name
        }
      }
    `;
//описываем на sdl языке запрос на добавление
export const CREATE_PHONE = gql`
mutation createPhone ($input:inputPhone!) {
  createPhone (input: $input) {
          id,
          number,
          name
        }
}`;
//описываем на sdl языке запрос на обновление
//в качестве входного параметра объект по структуре как state.inputPhone
export const UPDATE_PHONE = gql`
mutation updatePhone ($input:inputPhone!) {
  updatePhone (input: $input) {
          id,
          number,
          name
        }
}`;

//описываем на sdl языке запрос на удаление
export const DELETE_PHONE = gql`
mutation deletePhone ($id: String!) {
  deletePhone (id: $id) {
          id,
          number,
          name
        }
}`;