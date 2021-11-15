//Invocamos a express
const express = require('express');
const app = express();



//Seteamos urlenconded para capturar datos del formulario
app.use(express.urlencoded({extended:false}));
app.use(express.json());


//Invocamos a dotenv
const dotenv = require('dotenv');
dotenv.config({path:'./env/.env'});


//Directorio publico
app.use('/resources', express.static('public'));
app.use('/resources', express.static(__dirname + '/public'));


//Establecer el motor de plantillas ejs
app.set('view engine', 'ejs');

//Invocamos a bcryptjs
const bcryptjs = require('bcryptjs');

//Variables de session
const session = require('express-session');
app.use(session({
    secret: 'secret',
    resave: true,
    saveUninitialized:true
}));

//Invocamos al modulo de conexion de la base de datos
const connection = require('./database/db');

//Estableciendo rutas
app.get('/', (req, res)=>{
    res.render ('index', {msg: 'esto es node'});
})

app.get('/login', (req, res)=>{
    res.render ('login');
})

app.get('/register', (req, res)=>{
    res.render ('register');
})

app.get('/productos', (req, res)=>{
    res.render ('productos');
})

//Registro de cuentas
app.post('/register', async (req, res)=>{
    const user = req.body.user;
    const name = req.body.name;
    const rol = req.body.rol;
    const pass = req.body.pass;
    let passwordHaash = await bcryptjs.hash(pass, 8);
    connection.query('INSERT INTO usuario SET ? ', {user:user, name:name, rol:rol, pass:passwordHaash}, async(error, results)=>{
        if(error){
            console.log(error);
        }else{
            res.render('register', {
                alert: true,
                alertTitle: "Registro",
                alertMessage: "¡Registo exitoso!",
                alertIcon: 'success',
                showConfirmButton:false,
                timer:1500,
                ruta:''
            })
        }
    })
})
 //Autenticacion
app.post('/login', async (req, res)=>{
    const user = req.body.user;
    const pass = req.body.pass;
    let passwordHaash = await bcryptjs.hash(pass, 8);
    if(user && pass)
    {
        connection.query('SELECT * FROM usuario WHERE user = ?', [user], async(error, results)=>
        {
            if(results.length == 0 || !(await bcryptjs.compare(pass, results[0].pass))){
                res.render('login',{
                    alert:true,
                    alertTitle: "Error",
                    alertMessage: "Usuario y/o clave incorrectas",
                    alertIcon: "error",
                    showConfirmButton:true,
                    timer:null,
                    ruta:'login'
                })
            }else
            {
                req.session.name = results[0]
                res.render('login',{
                    alert: true,
                    alertTitle: "Conexion exitosa",
                    alertMessage: "Login correcto",
                    alertIcon: "success",
                    showConfirmButton:false,
                    timer:1500,
                    ruta:''
                });
            }
        })   
    }else{
        res.send('Por favor ingrese un usuario y/o contraseña');
    }
})









app.listen(3000, (req, res)=>{
    console.log('SERVER RUNNING IN htpp://localhost:3000');
});