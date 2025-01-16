"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.convertToSchema = convertToSchema;
exports.exec = exec;
const entity = {
    id: 'id001',
    name: 'Entity',
    age: 20
};
const converted = {
    id: { S: 'id001' },
    name: { S: 'Entity' },
    age: { N: '20' }
};
function convertToSchema(entity) {
    const schema = {};
    for (const key in entity) {
        const value = entity[key];
        if (typeof value === "string") {
            schema[key] = { S: value };
        }
        else if (typeof value === "number") {
            schema[key] = { N: value.toString() };
        }
        else {
            throw new Error(`Unsupported type for key "${key}"`);
        }
    }
    return schema;
}
function convertFromSchema(schema) {
    const entity = {};
    for (const key in schema) {
        const value = schema[key];
        if (value.S !== undefined) {
            entity[key] = value.S; // Valor do tipo string
        }
        else if (value.N !== undefined) {
            entity[key] = Number(value.N); // Valor do tipo number
        }
        else {
            throw new Error(`Unsupported schema format for key "${key}"`);
        }
    }
    return entity;
}
function exec() {
    const response = convertToSchema(entity);
    console.log(response);
    const response2 = convertFromSchema(response);
    console.log(response2);
}
