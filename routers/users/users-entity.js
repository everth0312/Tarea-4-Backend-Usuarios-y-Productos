
import { DataTypes } from "sequelize";
import { Database } from "../../database/db.js";


const database = new Database();
const users = database.db.define("users", {

    name : {
        type: DataTypes.STRING,
        allowNull: false
    },
    email : {
        type: DataTypes.STRING,
        allowNull: false
    },
    password : {
        type: DataTypes.STRING,
        allowNull: false
    },

});

users.sync();

export default users;