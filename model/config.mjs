import { Sequelize } from 'sequelize';

const sequelize = new Sequelize(
    {
        host: 'localhost',
        port: 5432,
        database: 'postgres',
        dialect: 'postgres',
        username: 'postgres',
        password: '12345',
        database: 'bookDB',
        logging: false,
        define: {
            timestamps: false,
            freezeTableName: true
        }
    });

export default sequelize