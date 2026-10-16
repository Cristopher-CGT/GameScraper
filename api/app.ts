import express from 'express';
import routes from './routes/search.routes.js';
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use((req, res, next) => {
    const AllowOrigin = "http://localhost:1234";
    const origin = req.headers.origin;
    if(origin == undefined || origin != AllowOrigin){
      return res.status(403).json({
        error: "Origin not recognized."
      })
    }
    res.setHeader('Access-Control-Allow-Origin', AllowOrigin); // change this later **
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    next();
});
app.use('/api', routes);

app.listen(3000, () => {
  console.log('Server is running on http://localhost:3000');
});