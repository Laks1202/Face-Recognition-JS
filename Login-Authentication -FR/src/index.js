const express = require("express")
const path = require("path")
const app = express()

// const __dirname = path.dirname(fileURLToPath(import.meta.url));

// const hbs = require("hbs")
const LogInCollection = require("./mongo")
const port = process.env.PORT || 3000
app.use(express.json())

app.use(express.urlencoded({ extended: false }))

const tempelatePath = path.join(__dirname, '../tempelates')
const publicPath = path.join(__dirname, '../public')
console.log(publicPath);

app.set('view engine', 'hbs')
app.set('views', tempelatePath)
app.use(express.static(publicPath))


// hbs.registerPartials(partialPath)


app.get('/signup', (req, res) => {
    res.render('signup')
})

app.get('/', (req, res) => {
    res.render('login')
})

/*--------SIGNUP DATA----------- */
app.post('/signup', async (req, res) => {
    
    const data = new LogInCollection({
        name: req.body.name,
        password: req.body.password
    })
    await data.save()

    // const data = {
    //     name: req.body.name,
    //     password: req.body.password
    // }

    const checking = await LogInCollection.findOne({ name: req.body.name })

   try{
    if (checking.name === req.body.name && checking.password===req.body.password) {
        res.send("User details already exists try changing name or password or both")
    }
    else{
        await LogInCollection.insertMany([data])
        res.status(201).send("User Added")
    }
   }
   catch{
    return res.send("Wrong Inputs")
   }
})

/*---------LOGIN CHECK----------- */
app.post('/login', async (req, res) => {

    try {
        const check = await LogInCollection.findOne({ name: req.body.name })

        if (check.password === req.body.password) {
            // res.status(201).render("home")
            res.status(201).render("index")
        }

        else {
            res.send("Incorrect Password")
        }
    } 
    
    catch (e) {
        res.send("Wrong Details")
    }
})
/**---------------PORT---------------------------- */
app.listen(port, () => {
    console.log('Server connected at http://localhost:'+port);
})