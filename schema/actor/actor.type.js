const gql = require('graphql-tag')

const typeDefs = gql`
    type Actor {
        id: Int
        name: String
        image: String
        birthday: String
        gender: String
    }

    type Query {
        actor: [Actor]
    }

    type Mutation {
        insertActor(input: InsertActorInput): Actor
        updateActor(input: UpdateActorInput): Actor
    }

    input InsertActorInput {
        name: String
        image: String
        birthday: String
        genderId: Int
    }

    input UpdateActorInput {
        id: Int!
        name: String
        image: String
        birthday: String
        genderId: Int
    }
`

module.exports = typeDefs
