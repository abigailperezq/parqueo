import mysql from 'mysql2/promise';
import fs from 'fs';

const pool = mysql.createPool({
    host: 'mysql-tpi-parqueotpi.g.aivencloud.com',    
    port: 27148,
    user: 'avnadmin',            
    password: 'AVNS_r4wLPKYVYCKW8TKW8JN', 
    
    database: 'parqueo',  
 
    ssl: {
        ca: fs.readFileSync('./ca.pem'),
        rejectUnauthorized: false 
    },
    
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

export default pool;