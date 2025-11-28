import mysql from 'mysql2/promise';
import fs from 'fs';

const pool = mysql.createPool({
    host: 'gateway01.us-east-1.prod.aws.tidbcloud.com',    
    port: 4000,
    user: 'eqhyonJX17XWPcv.root',            
    password: 'OumYkHg6V6fUFpM9', 
    
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