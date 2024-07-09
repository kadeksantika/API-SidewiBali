const http = require('http');
const app = require('./app');
const port = process.env.PORT || 3000;
const server = http.createServer(app);
const db = require('./config/database.js');
const tb_akun = require('./api/models/akun.js');

async function startServer() {
    try {
        await db.authenticate();
        console.log('Database connected...');
        await tb_akun.sync();
        server.listen(port, () => console.log(`Server running at http://localhost:${port}`));
    } catch (error) {
        console.error('Unable to connect to the database:', error);
    }
}

startServer();
