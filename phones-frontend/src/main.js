import { createApp, h } from 'vue'
import { provideApolloClient } from '@vue/apollo-composable'
import { apolloClient } from "./ApolloClient";
import App from "./App.vue";
import './style.css'

const app = createApp({
  setup () {
    provideApolloClient(apolloClient)
  },

  render: () => h(App),
})

app.mount("#app");