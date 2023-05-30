module.exports = {
    client: {
      service: {
        name: 'phones-backend',
        url: "http://localhost:9000/graphql"
      },
      excludes: ['./phones-backend/data/*'],
      includes: ['./phones-backend/types/*.gql'],
    }
  };