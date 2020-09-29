import { NextFunction } from "express";

const createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
//var gql = require("graphql-tag");
const { graphqlHTTP  } = require("express-graphql");
//var { buildASTSchema } = require("graphql");
const {
  GraphQLInputObjectType,
  GraphQLID,
  GraphQLString,
  GraphQLList,
  GraphQLNonNull,
  GraphQLObjectType,
  GraphQLSchema,
} = require("graphql");
require('dotenv').config();
const jwt = require('jsonwebtoken');

const db = require("./controller/dbservices");

var app = express();

//view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));


//const createError = require('http-errors');

const organisationType = new GraphQLObjectType({
  name: "company",
  fields: {
    id: { type: GraphQLID },
    organization: { type: GraphQLString },
    ceo: { type: GraphQLString },
    marketValue: { type: GraphQLString },
    country: { type: GraphQLString },
    address: { type: GraphQLString },
    products: { type: GraphQLList(GraphQLString) },
    employees: { type: GraphQLList(GraphQLString) },
  },
});

const loginType = new GraphQLInputObjectType({
  name: "login",
  fields: {
    email: { type: GraphQLString },
    password: { type: GraphQLString },
  },
});

const createOrganisation = new GraphQLInputObjectType({
  name: "createcompany",
  fields: {
    organization: { type: GraphQLString },
    ceo: { type: GraphQLString },
    marketValue: { type: GraphQLString },
    country: { type: GraphQLString },
    address: { type: GraphQLString },
    email: { type: GraphQLString },
    password: { type: GraphQLString },
    products: { type: GraphQLList(GraphQLString) },
    employees: { type: GraphQLList(GraphQLString) },
  },
});

  const updateOrganisation = new GraphQLInputObjectType({
    name: "updatecompany",
    fields: {
      id: { type: GraphQLID },
      ceo: { type: GraphQLString },
      marketValue: { type: GraphQLString },
      country: { type: GraphQLString },
      products: { type: GraphQLList(GraphQLString) },
      employees: { type: GraphQLList(GraphQLString) },
    },
  });


const schema = new GraphQLSchema({
  query: new GraphQLObjectType({
    name: "Query",
    fields: {
      allOrg: {
        type: GraphQLList(organisationType),
        resolve: async () => {
          return await db.getAllOrg();
        },
      },
      anOrg: {
        type: organisationType,
        args: {
          id: { type: GraphQLNonNull(GraphQLID) },
        },
        resolve: async (root: any, args: { id: any; }) => {
          return await db.getOrg(args.id);
        },
      },
    },
  }),

  mutation: new GraphQLObjectType({
    name: "Mutation",
    fields: {
      createOrg: {
        type: organisationType,
        args: {
          input: {
            type: new GraphQLNonNull(createOrganisation),
            description: "The fields to create an organization",
          },
        },
        resolve: async (root: any, {input}: any) => {
          return await db.createOrg(input);
        },
      },
      updateOrg: {
        type: organisationType,
        args: {
          input: {
            type: new GraphQLNonNull(updateOrganisation),
            description: "The fields to update for an organization",
          },
        },
        resolve: async (root: any, { input }: any) => {
            const { id, ...updateFields } = input;
          console.log(updateFields, id)
          return await db.updateOrg(updateFields, id);
        },
      },

      deleteOrg: {
        type: organisationType,
        args: {
          id: { type: GraphQLID },
        },
        resolve: async (root: any, { id }: {id:string}) => {
          return await db.deleteOrg(id);
        },
      },
    
    },
  }),
});

app.use(
  "/graphql",
  graphqlHTTP({
    schema: schema,
    graphiql: true,
  })
);

app.use(function(request: Express.Request, response: Express.Response, next:NextFunction) {
  next(createError(404));
});

// error handler
app.use(function(err: { message: any; status: any; }, req: { app: { get: (arg0: string) => string; }; }, res: { locals: { message: any; error: any; }; status: (arg0: any) => void; render: (arg0: string) => void; }) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;



// catch 404 and forward to error handler
app.use(function(req: any, res: any, next: (arg0: any) => void) {
  next(createError(404));
});

// error handler
app.use(function(err: { message: any; status: any; }, req: { app: { get: (arg0: string) => string; }; }, res: { locals: { message: any; error: any; }; status: (arg0: any) => void; render: (arg0: string) => void; }) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
//""},"products":["bed spread","pilor"],"employees":["cheta","Arizona"],"password":"2211","email":"emmanuel@gmail.com","organization":"emilly","ceo":"tony emelu","marketValue":"28","address":"onyiauke street, Abia state","country":"china","createdAt":{"$date":"2020-09-09T09:36:37.375Z"},"updatedAt":{"$date":"2020-09-09T09:36:37.375Z"},"__v":0}