<script setup>
import { reactive,computed,watch,ref} from 'vue';


//использование плагинов
import { useQuasar, useDialogPluginComponent,Notify } from 'quasar'

//клиент Apollo вариант 1
import {apolloClient} from 'boot/apollo'
//клиент Apollo  в варианте 2
import { useQuery } from '@vue/apollo-composable'



const pagination = ref({
      sortBy: 'desc',
      descending: false,
      page: 2,
      rowsPerPage: 11
      // rowsNumber: xx if getting data from a server
    })


//подключаем диалог из плагина, будем спрашивать удаление
const { dialogRef, onDialogHide, onDialogOK, onDialogCancel } = useDialogPluginComponent();

//импортируем GraphQL запросы
import {READ_PHONES,
        CREATE_PHONE,
        UPDATE_PHONE,
        DELETE_PHONE,
        CREATED_PHONE,
        UPDATED_PHONE,
        DELETED_PHONE} from '../queries/Phone.js'

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
    name:'',
    address:''
  }
});

//описание столбцов таблицы
const columns = [

 {
     align: 'left',
     field: 'number',
     label: 'Телефон',
     name: 'number',
     style: 'width: 50%;',
     sortable: true
 },
 {
     align: 'left',
     field: 'name',
     label: 'Имя',
     name: 'name',
     style: 'width: 50%;',
     sortable: true
 }
];

//читаем данные, запрос на бэкенд
const { result,loading, refetch, subscribeToMore} = useQuery(READ_PHONES)

const onCreatedPhone = subscribeToMore({
        document: CREATED_PHONE,
        updateQuery: (previousData, { subscriptionData }) => {
          return {
            readPhones: [...previousData.readPhones, subscriptionData.data.createdPhone]
          }
        }
      })
const onUpdatedPhon = subscribeToMore({
        document: UPDATED_PHONE,
        updateQuery: (previousData, { subscriptionData }) => {
          const id = subscriptionData.data.updatedPhone.id
          const res = previousData.readPhones.map(el => {
            if (el.id === id) return subscriptionData.data.updatedPhone
            else return el
          })
          return {
            readPhones: [...res]
          }
        }
      })
const onDeletedPhon = subscribeToMore({
        document: DELETED_PHONE,
        updateQuery: (previousData, { subscriptionData }) => {
          const id = subscriptionData.data.deletedPhone.id
          return {
            readPhones: previousData.readPhones.filter((i) => i.id !== id)
          }
        }
      },
    )

//обновляем статус загрузки
watch(loading,(value) =>{
  state.loading=value
})

//массив с данными получаем с сервера  как результат выполнения запроса
const phones = computed(() => result.value?.readPhones ?? [])

const pagesNumber = computed(() => Math.ceil(phones.value.length / pagination.value.rowsPerPage))

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
            variables
            })
        .then((response) =>{
              prevDelBtn.style.right="-60px"
              $q.notify({
              message: `Запись ${response.data?.deletePhone.number} удалена!`,
              color: 'positive',
              icon: 'done'
              })
            })
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

function deleteSwipeRow(e,id){
  e.stopPropagation()
  deleteRow(id)
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
            variables
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

function editRow(e,row){
  e.stopPropagation()//останавливаем клик
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


let  prevDelBtn=undefined; //запоминаем последнюю кнопку удаленияn
// обработчик свайпа
function handleSwipe ({ evt, ...newInfo }) {

        if (newInfo.direction=="left"){
          evt.target.childNodes[1].style.right="0"
          if(prevDelBtn) prevDelBtn.style.right="-60px"
          prevDelBtn =  evt.target.childNodes[1]
        }
        if (newInfo.direction=="right"){
          evt.target.childNodes[1].style.right="-60px"

        }
}


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
      style="height: 85vh"
      v-model:pagination="pagination"
      hide-pagination
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
          color="secondary"
          icon="refresh"
          @click="refetch"
        />
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
      <q-tr :props="props" @click="props.expand = !props.expand"
            v-touch-swipe.mouse.left.right="handleSwipe">
         <q-td key="number" :props="props">
             <a href="javascript:" @click="(event)=>editRow(event,props.row)"> {{ props.row.number }}</a>
        </q-td>
         <q-td key="name" :props="props">
              {{ props.row.name }}
              <div v-if="$q.platform.is.mobile" class="swipepanel">
                <q-btn

                  color="negative"
                  icon="delete"
                  @click="(event)=>deleteSwipeRow(event,props.row.id)"/>
              </div>
        </q-td>

        </q-tr>
        <q-tr v-show="props.expand" :props="props">

          <q-td colspan="100%">
                <div class="row">
                  <div class="column col-11" >
                        <p class="text-left">{{ props.row.address }}.</p>
                  </div>
                  <div v-if="$q.platform.is.desktop"  class="column col-1" >
                      <q-btn
                        size="sm"
                        rounded
                        flat
                        color="negative"
                        icon="delete"
                        label="Удалить"
                        @click="deleteRow(props.row.id)" />
                  </div>

                </div>

          </q-td>
        </q-tr>
    </template>

    </q-table>
    <div class="row justify-center q-mt-md">
    <q-pagination
        v-model="pagination.page"
        color="grey-8"
        :max="5"
        :max-pages="pagesNumber"
        boundary-numbers
      />
    </div>
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
                <q-input
                       square
                       clearable
                       v-model="state.inputPhone.address"
                       lazy-rules
                       :rules="[]"
                       label="Адрес">
                <template v-slot:prepend>
                  <q-icon name="mail" />
                </template>
                </q-input>
      </div>

      <q-card-actions align="right">
        <q-btn color="positive" label="Сохранить" @click="handleClickOk" />
        <q-btn color="negative" label="Отмена" @click="handleClickCancel" />
      </q-card-actions>
    </q-card>
  </q-dialog>
  </q-page>



</template>
<style>
.swipepanel {
  top: 5px;
  right: -60px;
  width: 60px;
  height: 100%;
  position: absolute;
  transition: right .5s cubic-bezier(0, 0, 1, 1);
}
.scroll {
overflow: hidden;}
</style>




