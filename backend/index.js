// Je permet à node d'aller voir dans mon .env
require("dotenv").config();
const express = require("express");
const cors = require("cors");
const Mailgun = require("mailgun.js");
const formData = require("form-data");

// Je crée une nouvelle instance Mailgun
const mailgun = new Mailgun(formData);

// Je me connecte à mon compte mailgun
const mg = mailgun.client({
    username: "Traore Coulemata",
    key: process.env.MAILGUN_API_KEY,
  });

  const app = express();
// Je permet à n'importe quel navigateur d'ilterroger mon serveur
app.use(cors());
app.use(express.json());

app.post("/formulaire", async (req, res) => {
    try {
      // Je demande à mailgun d'envoyer un mail en fonction du body reçu
      const response = await mg.messages.create(process.env.MAILGUN_SANDBOX, {
        from: `${req.body.firstname} ${req.body.lastname} <${req.body.email}>`,
        to: process.env.EMAIL,
        subject: req.body.subject,
        text: req.body.message,
      });
      console.log(response);
  
      // Je répond au client
      res.json(response);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });
  
  app.listen(process.env.PORT, () => {
    console.log("Server started");
  });