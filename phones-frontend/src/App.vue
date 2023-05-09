<script setup>
import { ref,reactive,computed} from "vue";
import { useQuery, useMutation } from '@vue/apollo-composable'
import gql from 'graphql-tag'

//Объявляем переменную реактивной
const inputnumber = ref(null);
//объявляем переменную для хранения новой записи
let inputPhone = reactive({
  number: "",
  name: "",
  id:""
});
//флаг режима, режим true - правка данных, false -ввод новых
const editmode = ref(false);


const READ_PHONES = gql`
      query readPhones {
        readPhones {
          id
          number
          name
        }
      }
    `;

const { result,loading, error } = useQuery(READ_PHONES)

const phones = computed(() => result.value?.readPhones ?? [])




function addPhone() {
//описываем на gql языке запрос на добавление
const CREATE_PHONE = gql`
mutation createPhone ($input:inputPhone!) {
  createPhone (input: $input) {
          id,
          number,
          name
        }
}`
const { mutate:runCreatePhone,onDone } = useMutation(CREATE_PHONE);
runCreatePhone({
    input:inputPhone
  },{
    refetchQueries:[
      {
        query: READ_PHONES
    }
  ]
  }
)
//Обрабатываем событие успешного действия
onDone(() => {
      resetPhone(); //очищаем все поля
    })
}
function resetPhone() {
  //тут обнуляем переменные и приводим все в исходное состояние
  inputPhone={
  number: "",
  name: "",
  id:""
}
  inputnumber.value.focus();
  editmode.value = false; //выключаем режим редактирования

}

function deletePhone(item) {
 //описываем на gql языке запрос на удаление
const DELETE_PHONE = gql`
mutation deletePhone ($id: String!) {
  deletePhone (id: $id) {
          id,
          number,
          name
        }
}`
//создаем мутацию и функцию для вызова 
const { mutate:runDeletePhone } = useMutation(DELETE_PHONE);
//выполняем функцию мутацию
runDeletePhone({
    id: item.id,
  },{
    refetchQueries:[
      {
        query: READ_PHONES
    }
  ]
  }
)
}

function setPhone(item) {
  // данная функция при режиме редактирования устанавливает в полях данные для редактирования
 
  //для вывода данных в полях, выводим их в связных переменных
  inputPhone = Object.assign({}, item);
  //удаляем системное поле
   delete  inputPhone.__typename
  //включаем режим редактирования, появляются кнопки
  editmode.value = true;
}
function savePhone() {
//описываем на gql языке запрос на обновление
const UPDATE_PHONE = gql`
mutation updatePhone ($input:inputPhone!) {
  updatePhone (input: $input) {
          id,
          number,
          name
        }
}`
const { mutate:runUpdatePhone,onDone } = useMutation(UPDATE_PHONE);
runUpdatePhone({
    input: inputPhone
  },{
    refetchQueries:[
      {
        query: READ_PHONES
    }
  ]
  }
)
//Обрабатываем событие успешного действия
  onDone(() => {
      resetPhone(); //очищаем все поля
    })
}
</script>

<template>
  <div>
    <!-- Описываем поле ввода номера -->
    <input
      ref="inputnumber"
      v-model="inputPhone.number"
      placeholder="Введите номер"

    />
      <!--Добавляем еще одно поле ввода данных - имя и вешаем обработчик на нажатие клавиши Enter-->
      <input
      placeholder="Введите имя"
      v-model="inputPhone.name"
      @keyup.enter="addPhone"
    />
    <button v-show="editmode" @click="savePhone">Сохранить</button>
    <button v-show="editmode" @click="resetPhone">Отмена</button>
     <!--вывод сообщения, если загрузка-->
     <div v-if="loading">Загрузка...</div>
    <!--Вывод сообщения, если ошибка-->
    <div v-else-if="error">Ошибка: {{ error.message }}</div>
    <table width="350px">
      <tr v-for="phone in phones" :key="phone.id">
        <td><a href="#" @click="setPhone(phone)">{{ phone.number }}</a></td>
        <td>{{ phone.name }}</td>
        <td><button @click="deletePhone(phone)">x</button></td>
      </tr>
    </table>
  </div>
  
</template>

<style scoped>
</style>
