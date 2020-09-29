import mongoose from "mongoose";
//const user ='mongodb+srv://anabiz:anabiz1987@cluster0.gxtll.mongodb.net/<mydb>?retryWrites=true&w=majority'
const { ObjectId, ObjectID } = require("bson");
const { getMaxListeners } = require("process");
const { request } = require("http");
import joi, { number } from "joi";
const { strict } = require("assert");
const { string } = require("joi");
const { response } = require("express");

const bcrypt = require('bcrypt');
const saltRounds = 10;
const myPlaintextPassword = 's0/\/\P4$$w0rD';
const someOtherPlaintextPassword = 'not_bacon';



mongoose
  .connect('mongodb+srv://anabiz:anabiz@cluster0.6hoxu.mongodb.net/organization?retryWrites=true&w=majority', { useNewUrlParser: true,useUnifiedTopology: true })
  .then(() => console.log("i am in now...here not there"))
  .catch(() => console.error("unable to connect"));

const companySchema = new mongoose.Schema(
  {
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
  },
  { timestamps: true }
);

const Company = mongoose.model("company", companySchema);

async function createOrg(data: any) {
  try {
    console.log(data);
    const companyData = joi.object({
      organization: joi.string().required(),
      marketValue: joi.string().max(3).required(),
      address: joi.string().max(255).required(),
      email: joi.string().max(255).required(),
      password: joi.string().max(255).required(),
      ceo: joi.string().max(100).required(),
      products: joi.array().items(joi.string()),
      employees: joi.array().items(joi.string()),
      country: joi.string(),
    });
let salt = "rest09"
    bcrypt.genSalt(saltRounds, function (err: any, salt: any) {
      bcrypt.hash(myPlaintextPassword, salt, function (err: any, hash: any) {
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
    const result = await company.save();
    console.log(result);
    return result;
  } catch (error) {
    console.log(error);
  }
}

//get a single organization by id
async function getOrg(id: string) {
  try {
    const result: any= await Company.findById(id);
    console.log(result);
    const {
      organization,
      products,
      employees,
      ceo,
      createdAt,
      country,
      marketValue,
      address,
    } = result;
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
  } catch (error) {
    console.log(error);
  }
}

//get all organisations with specified fields
async function getAllOrg() {
  try {
    const result = await Company.find().select({
      organization: 1,
      ceo: 1,
      country: 1,
      marketValue: 1,
      address: 1,
      products: 1,
      employees: 1,
    });

    return result;
  } catch (error) {
    console.log(error);
  }
}

//get all organization with their full details
async function getFullOrg() {
  try {
    const result = await Company.find();
    return result;
  } catch (error) {
    console.log(error);
  }
}

//get organization by page
async function getOrgByPage(pagenum1: string , pagesize1: string) {
  try {
    const pagenum: number = parseInt(pagenum1);
    const pagesize: number = parseInt(pagesize1);
    const result = await Company.find()
      .skip((pagenum - 1) * pagesize)
      .limit(pagesize);
    return result;
  } catch (error) {
    console.log(error);
  }
}

//delete a single organization
async function deleteOrg(id: any) {
  try {
    const result = await Company.findByIdAndRemove(id);
    return result;
  } catch (error) {
    console.log(error);
  }
}

//update organization data
async function updateOrg(update: any, id: any) {
  try {
    //console.log(update);
    //console.log(id);
    const companyData = joi.object({
      marketValue: joi.string().max(3),
      address: joi.string().max(255),
      email: joi.string().max(255),
      password: joi.string().max(255),
      ceo: joi.string().max(100),
      products: joi.array().items(joi.string()),
      employees: joi.array().items(joi.string()),
      country: joi.string().max(50),
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
    const result = await Company.findByIdAndUpdate({ _id: id }, value);
    return result;
  } catch (error) {
    console.log(error);
  }
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
