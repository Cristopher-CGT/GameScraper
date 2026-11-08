import express from 'express';
import routes from './routes/search.routes.js';
import path from 'node:path';
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, '../web/build')));
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    if (req.method == "OPTIONS") {
        return res.sendStatus(200);
    }
    next();
});
app.use('/api', routes);
app.get('/{*splat}', (req, res) => {
    res.sendFile(path.join(__dirname, '../../web/build', 'index.html'));
});
app.listen(3300, () => {
    console.log('Server is running on http://localhost:3300');
});
//# sourceMappingURL=app.js.map