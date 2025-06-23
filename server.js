// server.js
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const OpenAI = require("openai");
const path = require('path');

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

app.post('/generate', async (req, res) => {
  const { name, vibe, company, interest } = req.body;

  try {
    const completion = await openai.createChatCompletion({
      model: 'gpt-4',
      messages: [
        {
          role: 'system',
          content: 'Kullanıcıdan gelen tatil özelliklerine göre kısa, yaratıcı ve sıcak bir hikâye üret. Hikaye 2 kısa paragraf olmalı.',
        },
        {
          role: 'user',
          content: `Adı: ${name}, Tatil Tanımı: ${vibe}, Yanında: ${company}, İlgi Alanı: ${interest}`
        }
      ],
      temperature: 0.8,
    });

    const story = completion.data.choices[0].message.content;

    const image = await openai.createImage({
      prompt: `An abstract dreamlike holiday illustration based on: ${interest}, soft colors, sunny mood, cinematic.`,
      n: 1,
      size: "1024x1024",
    });

    const imageUrl = image.data.data[0].url;

    res.json({ story, imageUrl });

  } catch (err) {
    console.error(err);
    res.status(500).send('Hikaye üretimi başarısız.');
  }
});

app.listen(port, () => {
  console.log(`Server http://localhost:${port} üzerinden çalışıyor.`);
});
