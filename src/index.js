const express = require('express');
const {ApolloServer} = require('apollo-server-express');
require('dotenv').config();
const jwt = require('jsonwebtoken');
const helmet = require('helmet');
const cors = require('cors');
const depthLimit = require('graphql-depth-limit');
const { createComplexityLimitRule } = require('graphql-validation-complexity');

const getUser = token => {
    if(token){
        try{
            return jwt.verify(token, process.env.JWT_SECRET);
        } catch(err) {
            throw new Error('Invalid Session');
        }
    }
};
//local modules
const db = require('./db');
const models = require('./models');
const resolvers = require('./resolvers');
const typeDefs = require('./schema');

//run server on env port
const port = process.env.PORT || 4000;
const DB_HOST = process.env.DB_HOST;

const app = express();
app.use(helmet());
app.use(cors());
//database connection
db.connect(DB_HOST);

//apollo setup
const server = new ApolloServer({
     typeDefs,
     resolvers,
     validationRules: [depthLimit(6), createComplexityLimitRule(1000)],
     context: async ({ req }) => {
        //get user token from header
        const token = req.headers.authorization;
        //try to retreive a user with token
        const user = await getUser(token);
        //log user to console   temp
        //console.log(user);

      return {models, user};
    }
});

app.get('/', (req,res) => res.send('Hello There, data sent'));

//server async loop
(async () => {
    await server.start();
    server.applyMiddleware({app, path: '/api' });
    app.listen ({port}, () => console.log(`GraphQl server running on http://localhost:${port}${server.graphqlPath}`));
})();