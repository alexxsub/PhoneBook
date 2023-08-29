//для языка sdl
import gql from "graphql-tag";

//Описание GraphQL запросы на sdl языке

const fragment = gql`
  fragment Phone on Phone {
    id
    number
    name
    address
  }
`;
//sdl запрос на чтение
export const READ_PHONES = gql`
  query readPhones($input: inputRead!) {
    readPhones(input: $input) {
      rows {
        id
        number
        name
        address
      }
      pageinfo {
        rowsNumber
        rowsPerPage
        page
      }
    }
  }
`;

//описываем на sdl языке запрос на добавление
export const CREATE_PHONE = gql`
  mutation createPhone($input: inputPhone!) {
    createPhone(input: $input) {
      ...Phone
    }
  }
  ${fragment}
`;
//описываем на sdl языке запрос на обновление
//в качестве входного параметра объект по структуре как state.inputPhone
export const UPDATE_PHONE = gql`
  mutation updatePhone($input: inputPhone!) {
    updatePhone(input: $input) {
      ...Phone
    }
  }
  ${fragment}
`;

//описываем на sdl языке запрос на удаление
export const DELETE_PHONE = gql`
  mutation deletePhone($id: String!) {
    deletePhone(id: $id) {
      ...Phone
    }
  }
  ${fragment}
`;

//Запросы на подписку
export const CREATED_PHONE = gql`
  subscription createdPhone {
    createdPhone {
      ...Phone
    }
  }
  ${fragment}
`;

export const UPDATED_PHONE = gql`
  subscription updatedPhone {
    updatedPhone {
      ...Phone
    }
  }
  ${fragment}
`;

export const DELETED_PHONE = gql`
  subscription deletedPhone {
    deletedPhone {
      ...Phone
    }
  }
  ${fragment}
`;
