"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
const createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
//var gql = require("graphql-tag");
const { graphqlHTTP } = require("express-graphql");
//var { buildASTSchema } = require("graphql");
const { GraphQLInputObjectType, GraphQLID, GraphQLString, GraphQLList, GraphQLNonNull, GraphQLObjectType, GraphQLSchema, } = require("graphql");
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
                resolve: () => __awaiter(void 0, void 0, void 0, function* () {
                    return yield db.getAllOrg();
                }),
            },
            anOrg: {
                type: organisationType,
                args: {
                    id: { type: GraphQLNonNull(GraphQLID) },
                },
                resolve: (root, args) => __awaiter(void 0, void 0, void 0, function* () {
                    return yield db.getOrg(args.id);
                }),
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
                resolve: (root, { input }) => __awaiter(void 0, void 0, void 0, function* () {
                    return yield db.createOrg(input);
                }),
            },
            updateOrg: {
                type: organisationType,
                args: {
                    input: {
                        type: new GraphQLNonNull(updateOrganisation),
                        description: "The fields to update for an organization",
                    },
                },
                resolve: (root, { input }) => __awaiter(void 0, void 0, void 0, function* () {
                    const { id } = input, updateFields = __rest(input, ["id"]);
                    console.log(updateFields, id);
                    return yield db.updateOrg(updateFields, id);
                }),
            },
            deleteOrg: {
                type: organisationType,
                args: {
                    id: { type: GraphQLID },
                },
                resolve: (root, { id }) => __awaiter(void 0, void 0, void 0, function* () {
                    return yield db.deleteOrg(id);
                }),
            },
        },
    }),
});
app.use("/graphql", graphqlHTTP({
    schema: schema,
    graphiql: true,
}));
app.use(function (request, response, next) {
    next(createError(404));
});
// error handler
app.use(function (err, req, res) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};
    // render the error page
    res.status(err.status || 500);
    res.render('error');
});
module.exports = app;
// catch 404 and forward to error handler
app.use(function (req, res, next) {
    next(createError(404));
});
// error handler
app.use(function (err, req, res) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};
    // render the error page
    res.status(err.status || 500);
    res.render('error');
});
module.exports = app;
//""},"products":["bed spread","pilor"],"employees":["cheta","Arizona"],"password":"2211","email":"emmanuel@gmail.com","organization":"emilly","ceo":"tony emelu","marketValue":"28","address":"onyiauke street, Abia state","country":"china","createdAt":{"$date":"2020-09-09T09:36:37.375Z"},"updatedAt":{"$date":"2020-09-09T09:36:37.375Z"},"__v":0}
