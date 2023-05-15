<script setup>
import { reactive,computed,watch,ref } from 'vue';

//использование плагинов
import { useQuasar, useDialogPluginComponent,Notify } from 'quasar'

//клиент Apollo вариант 1
import {apolloClient} from 'boot/apollo'
//клиент Apollo  в варианте 2 
import { useQuery } from '@vue/apollo-composable'

//подключаем диалог из плагина, будем спрашивать удаление
const { dialogRef, onDialogHide, onDialogOK, onDialogCancel } = useDialogPluginComponent();

//для языка sdl
import gql from 'graphql-tag'


//глобальная переменная на простраство квазар
const $q = useQuasar()

//объект состояния приложения
const state = reactive({     
  
  loading: false, //статус активного запроса
  filter:'',//строка фильтра
  formTitle:'Добавить телефон', //заголовок формы редактирования
  inputPhone:{  //объект ввода данных
    id:'',
    number:'',
    name:''
  }
});

//описание столбцов таблицы
const columns = [
 
 {
     align: 'left',
     field: 'number',
     label: 'Телефон',
     name: 'number',
     style: 'width: 40%;',
     sortable: true
 },
 {
     align: 'left',
     field: 'name',
     label: 'Имя',
     name: 'name',
     style: 'width: 40%;',
     sortable: true
 },
 {
   name: 'actions',
   label: '',
   field: 'actions',
   style: 'width: 20%'
 }
];

//Описание GraphQL запросы на sdl языке
//sdl запрос на чтение
const READ_PHONES = gql`
      query readPhones {
        readPhones {
          id,
          number
          name
        }
      }
    `;
//описываем на sdl языке запрос на добавление
const CREATE_PHONE = gql`
mutation createPhone ($input:inputPhone!) {
  createPhone (input: $input) {
          id,
          number,
          name
        }
}`;
//описываем на sdl языке запрос на обновление
//в качестве входного параметра объект по структуре как state.inputPhone
const UPDATE_PHONE = gql`
mutation updatePhone ($input:inputPhone!) {
  updatePhone (input: $input) {
          id,
          number,
          name
        }
}`;

//описываем на sdl языке запрос на удаление
const DELETE_PHONE = gql`
mutation deletePhone ($id: ID!) {
  deletePhone (id: $id) {
          id,
          number,
          name
        }
}`;
  

  //читаем данные, запрос на бэкенд 
const { result,loading } = useQuery(READ_PHONES)

//обновляем статус загрузки
watch(loading,(value) =>{
  state.loading=value
})

//массив с данными получаем с сервера  как результат выполнения запроса
const phones = computed(() => result.value?.readPhones ?? [])

//настраиваемая подпись кнопки добавить от размера экрана
const btnAddLabel = computed(() => {
  if($q.screen.name=='xs') 
      return ''
    else 
      return 'Добавить запись'
});


//запрос к бэкенду через Apollo клиент
const deletePhone = async (variables) =>
    apolloClient
        .mutate({
            mutation: DELETE_PHONE,
            variables,
            update:(cache,{ data })=>{
              cache.updateQuery({query: READ_PHONES},
              (cache) => ( {
                  ...cache,
                    readPhones: cache.readPhones.filter((i) => i.id !== data.deletePhone.id),
                   })
                    )
            },
            /*update: (cache, {data}) => {
                //читаем кэш            
                const {readPhones} = cache.readQuery({ query: READ_PHONES })
                //удаляем запись из кэша
                cache.writeQuery({ query: READ_PHONES,
                    data:{
                        //перебираем массив и при совпадении id удаляем элемент из массива кэша
                        readPhones: readPhones.filter(phone=>phone.id!==data.deletePhone.id)
                       }
                      })
                  }*/
            })
        .then((response) => 
              $q.notify({
              message: `Запись ${response.data?.deletePhone.number} удалена!`,
              color: 'positive',
              icon: 'done'
              })
        )
        .catch(error => {
              $q.notify({
              message: error.message,
              color: 'negative',
              icon: 'error'
            })
          });

function deleteRow(id){

$q.dialog({
      title:'Удаление записи',
      message: 'Уверены, что хотите удалить запись?',
      focus: 'cancel',
      ok:{
        label:'Да',
        color:'positive'
      },
      cancel:{
        label:'Нет',
        color:'negative'
      }
      //persistent: true //выключить закрытие диалога по esc
    }).onOk(() => deletePhone({id}))
}

//обработка события на диалоге редактирования
const handleClickOk = () => {
  
  if (state.inputPhone.id=='') 
    addPhone(
        {
          input:state.inputPhone
        }
          );
  else 
    updatePhone(
        {
          input:state.inputPhone
        }
          );

    
  };

  const handleClickCancel = () => {
      onDialogCancel()
      //вариант создания уведомления через экземпляр класса
      Notify.create({
              message: 'Заапись не сохранена!',
              color: 'negative',
              icon: 'done'
            })
   
      };

  const addPhone = async (variables) =>
    apolloClient
        .mutate({
            mutation: CREATE_PHONE,
            variables,   
            update: (cache,{ data: {createPhone } }) => {
                  
                  //https://www.apollographql.com/docs/react/local-state/local-state-management
                  //https://v4.apollo.vuejs.org/guide-composable/mutation.html#making-all-other-cache-updates

                  const data = cache.readQuery({ query: READ_PHONES })
                  cache.writeQuery({ query: READ_PHONES,
                  data:{
                    readPhones:[...data.readPhones,createPhone]
                  }  }) 

                }
            })
        .then((response) =>{ 
              $q.notify({          
              message: `Запись ${response.data?.createPhone.number} добавлена!`,
              color: 'positive',
              icon: 'done'
              })
              onDialogOK();
            }
        )
        .catch(error => {
              $q.notify({
              message: error.message,
              color: 'negative',
              icon: 'error'
            })
          });

//обновление записи
// variables - входящий параметр - state.inputPhone
const updatePhone = async (variables) =>
    apolloClient
        .mutate({
            mutation: UPDATE_PHONE,
            variables,
            })
        .then((response) =>{
              $q.notify({
              message: `Запись ${response.data?.updatePhone.number} изменена!`,
              color: 'positive',
              icon: 'done'
              });
              onDialogOK();
            }
        )
        .catch(error => {
              $q.notify({
              message: error.message,
              color: 'negative',
              icon: 'error'
            })
          });

function addRow(){
  //обнуляем данные редактирования, у нас новая запись
  resetPhone()
  //меняем заголовок диалога
  state.formTitle = 'Добавить запись'
  dialogRef.value.show()
};

function editRow(row){
  //передаем в объект редактирования запись из таблицы, что параметром прила
  state.inputPhone=Object.assign({}, row);
  //удаляем лишнее поле, которое служебное, но не описано в типе ввода input
  delete  state.inputPhone.__typename
  //меняем заголовок диалога
  state.formTitle = 'Редактировать запись'
  dialogRef.value.show()
};

//обнуляем состояние приложения
function resetPhone() {
  for (var key in state.inputPhone) { // затираем объект редактирования , перебирая все элементы
      state.inputPhone[key]=""
    }

};

</script>

<template>
  <q-page >
    <q-table 
      :columns="columns"
      :loading="state.loading"
      :filter="state.filter"
      :rows="phones"
      no-data-label="Нет данных"
      no-results-label = "Ничего не найдено"
      style="height: 93vh"
    >
      <!--кастомный заголовок таблицы, чтобы вставить поле поиска-->
      <template v-slot:top>
     <!-- <q-toolbar-title>Телефонная книга</q-toolbar-title> -->
      <q-input  dense debounce="300" color="primary" v-model="state.filter">
        <template v-slot:append>
            <q-icon name="search"></q-icon>
        </template>
      </q-input>
        <q-space />
        <q-btn
          color="primary"
          icon="add"
          :label="btnAddLabel"   
          @click="addRow"
        />
    </template>
     <!--кастомный шаблон тела таблицы, чтобы сделать в ячейке телефона ссылку-->
     <template v-slot:body="props">
      <q-tr :props="props">
         <q-td key="number" :props="props">
             <a href="javascript:" @click="editRow(props.row)"> {{ props.row.number }}</a>
        </q-td>
         <q-td key="name" :props="props">
              {{ props.row.name }}
        </q-td>
         <q-td key="actions" :props="props">
              <q-btn  color="red" round icon="delete" @click="deleteRow(props.row.id)"></q-btn>
            </q-td>
        </q-tr>       
    </template>
    </q-table>
  </q-page>

<!--Шаблон диалога скрыт и не отображается, вызывается из кода-->
<q-dialog ref="dialogRef" @hide="onDialogHide">
    <q-card class="q-dialog-plugin">
      <div class="q-pa-md" style="max-width: 500px">
        <q-toolbar class="bg-grey-2">
          <q-toolbar-title>{{state.formTitle}}</q-toolbar-title>
        </q-toolbar>
              <q-input
                       square
                       clearable
                       v-model="state.inputPhone.number"
                       lazy-rules
                       :rules="[]"
                       label="Телефон">
                <template v-slot:prepend>
                  <q-icon name="phone" />
                </template>
              </q-input>
               <q-input
                       square
                       clearable
                       v-model="state.inputPhone.name"
                       lazy-rules
                       :rules="[]"
                       label="Имя">
                <template v-slot:prepend>
                  <q-icon name="person" />
                </template>
              </q-input>
      </div>

      <q-card-actions align="right">
        <q-btn color="positive" label="Сохранить" @click="handleClickOk" />
        <q-btn color="negative" label="Отмена" @click="handleClickCancel" />
      </q-card-actions>
    </q-card>
  </q-dialog>

</template>


