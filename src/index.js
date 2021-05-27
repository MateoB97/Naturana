const app = require('../src/config/server');
const connection = require('./config/db');


require('./app/routes/index')(app);


//The server listeding
app.listen(app.get('port'), ()=>{
    console.log(`Server at the port ${app.get('port')}`);
});