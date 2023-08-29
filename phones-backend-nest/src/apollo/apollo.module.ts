import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { join } from 'path';
//закоментировать для другой страницы песочницы
import { ApolloServerPluginLandingPageLocalDefault } from '@apollo/server/plugin/landingPage/default';
import { Context } from 'graphql-ws';

@Module({
  imports: [
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      installSubscriptionHandlers: true,
      subscriptions: {
        'graphql-ws': {
          path: '/graphql',
          onConnect: (context: Context<any>) => {
            const { connectionParams } = context;
            console.log(connectionParams);
          },
        },
      },
      autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
      // поменять значение для песочницы
      // playground: true,
      playground: false,
      plugins: [
        {
          async serverWillStart() {
            console.log('🚀 Apollo Started!');
          },
        },
        //закоментировать
        ApolloServerPluginLandingPageLocalDefault(),
      ],
    }),
  ],
})
export class ApolloModule {}
