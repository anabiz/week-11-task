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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
//const user ='mongodb+srv://anabiz:anabiz1987@cluster0.gxtll.mongodb.net/<mydb>?retryWrites=true&w=majority'
const { ObjectId, ObjectID } = require("bson");
const { getMaxListeners } = require("process");
const { request } = require("http");
const joi_1 = __importDefault(require("joi"));
const { strict } = require("assert");
const { string } = require("joi");
const { response } = require("express");
const bcrypt = require('bcrypt');
const saltRounds = 10;
const myPlaintextPassword = 's0/\/\P4$$w0rD';
const someOtherPlaintextPassword = 'not_bacon';
mongoose_1.default
    .connect('mongodb+srv://anabiz:anabiz@cluster0.6hoxu.mongodb.net/organization?retryWrites=true&w=majority', { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log("i am in now...here not there"))
    .catch(() => console.error("unable to connect"));
const companySchema = new mongoose_1.default.Schema({
    organization: String,
    marketValue: String,
    address: String,
    password: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    ceo: String,
    products: [String],
    country: String,
    employees: [String],
}, { timestamps: true });
const Company = mongoose_1.default.model("company", companySchema);
function createOrg(data) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            console.log(data);
            const companyData = joi_1.default.object({
                organization: joi_1.default.string().required(),
                marketValue: joi_1.default.string().max(3).required(),
                address: joi_1.default.string().max(255).required(),
                email: joi_1.default.string().max(255).required(),
                password: joi_1.default.string().max(255).required(),
                ceo: joi_1.default.string().max(100).required(),
                products: joi_1.default.array().items(joi_1.default.string()),
                employees: joi_1.default.array().items(joi_1.default.string()),
                country: joi_1.default.string(),
            });
            let salt = "rest09";
            bcrypt.genSalt(saltRounds, function (err, salt) {
                bcrypt.hash(myPlaintextPassword, salt, function (err, hash) {
                    // Store hash in your password DB.
                });
            });
            const { error, value } = companyData.validate(data, {
                stripUnknown: true,
                abortEarly: false,
            });
            if (error) {
                console.log("something went wrong");
                //throw error;
            }
            value.createdAt = new Date();
            const company = new Company(value);
            const result = yield company.save();
            console.log(result);
            return result;
        }
        catch (error) {
            console.log(error);
        }
    });
}
//get a single organization by id
function getOrg(id) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const result = yield Company.findById(id);
            console.log(result);
            const { organization, products, employees, ceo, createdAt, country, marketValue, address, } = result;
            //console.log(organization)
            return {
                Organization: organization,
                ceo: ceo,
                marketValue: marketValue + "%",
                address: address,
                country: country,
                products: products,
                employees: employees,
                noOfEmployees: employees.length,
                createdAt: createdAt,
            };
        }
        catch (error) {
            console.log(error);
        }
    });
}
//get all organisations with specified fields
function getAllOrg() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const result = yield Company.find().select({
                organization: 1,
                ceo: 1,
                country: 1,
                marketValue: 1,
                address: 1,
                products: 1,
                employees: 1,
            });
            return result;
        }
        catch (error) {
            console.log(error);
        }
    });
}
//get all organization with their full details
function getFullOrg() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const result = yield Company.find();
            return result;
        }
        catch (error) {
            console.log(error);
        }
    });
}
//get organization by page
function getOrgByPage(pagenum1, pagesize1) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const pagenum = parseInt(pagenum1);
            const pagesize = parseInt(pagesize1);
            const result = yield Company.find()
                .skip((pagenum - 1) * pagesize)
                .limit(pagesize);
            return result;
        }
        catch (error) {
            console.log(error);
        }
    });
}
//delete a single organization
function deleteOrg(id) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const result = yield Company.findByIdAndRemove(id);
            return result;
        }
        catch (error) {
            console.log(error);
        }
    });
}
//update organization data
function updateOrg(update, id) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            console.log(update);
            console.log(id);
            const companyData = joi_1.default.object({
                marketValue: joi_1.default.string().max(3),
                address: joi_1.default.string().max(255),
                email: joi_1.default.string().max(255),
                password: joi_1.default.string().max(255),
                ceo: joi_1.default.string().max(100),
                products: joi_1.default.array().items(joi_1.default.string()),
                employees: joi_1.default.array().items(joi_1.default.string()),
                country: joi_1.default.string().max(50),
            });
            const { error, value } = companyData.validate(update, {
                stripUnknown: true,
                abortEarly: false,
            });
            if (error) {
                throw error;
            }
            //value.updatedAt = new Date();
            console.log(value);
            const result = yield Company.findByIdAndUpdate({ _id: id }, value);
            return result;
        }
        catch (error) {
            console.log(error);
        }
    });
}
module.exports = {
    createOrg,
    getAllOrg,
    getOrg,
    deleteOrg,
    updateOrg,
    getFullOrg,
    getOrgByPage,
};
