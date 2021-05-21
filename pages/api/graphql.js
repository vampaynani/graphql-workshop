import { ApolloServer, gql } from "apollo-server-micro";
import cors from "micro-cors";
import axios from "axios";

let movies = [
  {
    id: 1,
    tag: "SWI",
    name: "The phantom menace",
  },
  {
    id: 2,
    tag: "SWII",
    name: "Atack of the clones",
  },
  {
    id: 3,
    tag: "SWIII",
    name: "Revenge of the sith",
  },
  {
    id: 4,
    tag: "SWIV",
    name: "A new hope",
  },
  {
    id: 5,
    tag: "SWV",
    name: "The empire strikes back",
  },
  {
    id: 6,
    tag: "SWVI",
    name: "Return of the jedi",
  },
  {
    id: 7,
    tag: "SWVII",
    name: "The force awakens",
  },
  {
    id: 8,
    tag: "SWVIII",
    name: "The last jedi",
  },
  {
    id: 9,
    tag: "SWIX",
    name: "The rise of skywalker",
  },
];

const typeDefs = gql`
  type Movie {
    id: ID
    name: String
    tag: String
  }

  type Homeworld {
    name: String
    terrain: String
  }

  type Person {
    name: String
    birth_year: String
    homeworld: Homeworld
  }

  type Query {
    movie(id: ID): Movie
    movies: [Movie]
    person(id: ID): Person
  }

  input NewMovie {
    tag: String
    name: String
  }

  type Mutation {
    addMovie(movie: NewMovie): Movie
  }
`;

const resolvers = {
  Person: {
    homeworld: async (person) => {
      const response = await axios.get(person.homeworld);
      const homeworld = response.data;
      return homeworld;
    },
  },
  Query: {
    person: async (_, args) => {
      const response = await axios.get(
        `https://swapi.dev/api/people/${args.id}`
      );
      const person = response.data;
      return person;
    },
    movie: (_, args) => {
      const { id } = args;
      return movies.find((movie) => movie.id === parseInt(id));
    },
    movies: () => {
      return movies;
    },
  },
  Mutation: {
    addMovie: (_, args) => {
      const id = movies[movies.length - 1].id + 1;
      const movie = { ...args.movie, id };
      movies = [...movies, movie];
      return movie;
    },
  },
};

const server = new ApolloServer({ typeDefs, resolvers });

const corsOptions = cors({
  allowMethods: ["POST", "OPTIONS"],
});

const handler = server.createHandler({
  path: "/api/graphql",
});

export const config = {
  api: {
    bodyParser: false,
  },
};

export default corsOptions(handler);
