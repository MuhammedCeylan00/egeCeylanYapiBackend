const PORT=process.env.port ?? 3000
const express=require('express')
const app=express();
const cors=require('cors')
const nodemailer = require('nodemailer')
const multer = require('multer');
const upload = multer();
const postgresClient = require('./db')


app.use(cors());
app.use(express.json());
app.get('/',(req,res)=>{
    res.send('Hi');
})
const fromMail = `ceylanwebsiteinfo@gmail.com`;
const toMail="ceylanparke65@gmail.com";


app.post('/sendmail', async (req, res) => {
    const { namesurname, phone, adress,material,price,moneypaid } = req.body;
    var html=
        "İsim: "+namesurname+"<br>"+
        "Telefon: "+phone+"<br>"+
        "Adres: "+adress+"<br>"+
        "Malzeme: "+material+"<br>"+
        "Fiyat: "+ price+"<br>"+
        "Alınan ödeme: "+moneypaid+"<br>"+
        "<br><br>Bu mail müşteri kaydı yapılırken gönderilmiştir."
    ;
    let mailOption = {
        from: fromMail,
        to:toMail,
        subject: namesurname,
        html:html,
    }
    try{
        transporter.sendMail(mailOption, (err, data) => {
            if (err) {
                console.log(err)
            } else {
                console.log('Mail gönderildi')
                res.sendStatus(200);
            }
        })
    }catch (error){
        res.json({detail:error.detail})
    }
})

let transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'ceylanwebsiteinfo@gmail.com',
        pass: 'luyqgjncafsypnau'
    }
})

app.get('/customers',async(req,res)=>{
    try {
        const text = 'SELECT * FROM "Customers"'
        const { rows } = await postgresClient.query(text)
        return res.status(200).json(rows)
    } catch (error) {
        console.log("Error occured", error.message);
        return res.status(400).json({ message: error.message })
    }
})
app.post('/savecustomers',async(req,res)=>{
    // Get the data from the request body
    console.log(req.body);
  const { namesurname, phone, adress,material,price,moneypaid } = req.body;

  try {
    // Insert the data into the customers table
    const result = await postgresClient.query(
      'INSERT INTO "Customers" (namesurname, phone, adress,material,price,moneypaid) VALUES ($1, $2, $3, $4, $5, $6)',
      [namesurname, phone, adress,material,price,moneypaid]
    );

    // Return a success response
    res.status(201).json({ message: 'Customer created' });
  } catch (error) {
    // Return an error response if something goes wrong
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
})
app.delete('/deletecustomer/:id',async(req,res)=>{
    const customerId = req.params.id;
    console.log("istek geldi: ",customerId);
    try {
        // Insert the data into the customers table
        const result = await postgresClient.query(
          'DELETE FROM "Customers" WHERE  id = $1',
          [customerId]
        );
    
        // Return a success response
        res.status(201).json({ message: 'Customer created' });
      } catch (error) {
        // Return an error response if something goes wrong
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
      }
})



app.listen(PORT, () => console.log(`Server runing on PORT ${PORT}`))