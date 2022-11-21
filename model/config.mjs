import { Sequelize } from 'sequelize';

// const sequelize = new Sequelize(
//     {
//         host: 'localhost',
//         port: 5432,
//         database: 'postgres',
//         dialect: 'postgres',
//         username: 'postgres',
//         password: '12345',
//         database: 'bookDB',
//         logging: false,
//         define: {
//             timestamps: false,
//             freezeTableName: true
//         }
//     });

const sequelize = new Sequelize(process.env.DATABASE_URL,{
        dialect: 'postgres',
        dialectOptions:{

            ssl:{
                require: true,
                rejectUnauthorized: false
            },
            logging: false, 
            define:{
                timestamps: false
            }
        }
})

export default sequelize