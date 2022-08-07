const gql = require('graphql-tag')

const typeDefs = gql`
    type Movie {
        id: Int
        image: String
        title: String
        director: String
        trailer: String
        description: String
        releaseDate: String
        price: Int
        type: String
        status: String
        category: [Category]
    }

    type Query {
        movie: [Movie]
    }

    type Mutation {
        getDetailMovie(input: getDetailMovieInput): Movie
    }

    input getDetailMovieInput {
        id: Int!
    }
`

module.exports = typeDefs
