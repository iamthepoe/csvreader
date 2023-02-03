import Express from 'express';
import {router} from './routes'
const app = Express();

app.use(router);
app.listen(3000, ()=>console.log('Server is running in port 3000'));