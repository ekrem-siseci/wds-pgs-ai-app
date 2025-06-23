const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const bodyParser = require('body-parser');
const OpenAI = require('openai');
const path = require('path');
const gender = require('gender-detection');

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const destinations = [
  'Barcelona', 'Paris', 'Roma', 'Amsterdam', 'Berlin',
  'İstanbul', 'İzmir', 'Antalya', 'Kopenhag', 'Atina'
];

// 🎯 Gelişmiş hikâye üretimi
app.post('/generate', async (req, res) => {
  const { name, vibe, company, interest } = req.body;

  // Cinsiyet tahmini
  let genderLabel = gender.detect(name);
  if (genderLabel === 'unknown') {
    genderLabel = null; // unisex ise hiç kullanma
  }

  // Random Pegasus destinasyonu
  const destination = destinations[Math.floor(Math.random() * destinations.length)];

  // 💬 Hikaye promptu (TR)
  const storyPrompt = `Adı ${name} olan ${genderLabel ? (genderLabel === 'male' ? 'bir erkek' : 'bir kadın') : 'bir yolcu'} için yazılmış, "${vibe}" temalı ve "${company}" ile geçecek bir tatil hikayesi yaz. Hikaye Pegasus Hava Yolları'nın ${destination} destinasyonuna yolculuk içeriyor. Hikaye yaratıcı, akıcı ve iki kısa paragraf olacak. Hikaye sonunda Pegasus Havayolları ve BolBol üyeliğine yönlendirici bir cümle olsun.`;

  try {
    // ChatGPT'den hikaye üret
    const completion = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [
        { role: 'system', content: 'Kısa ve akıcı tatil hikayeleri yazan bir asistansın.' },
        { role: 'user', content: storyPrompt }
      ],
      temperature: 0.9,
    });

    const story = completion.choices[0].message.content;

    // DALL·E için İngilizce fotorealistik prompt
    const imagePrompt = `a realistic photo of a vacation scene in ${destination}, ${interest} themed, cinematic sunlight, DSLR quality, vibrant colors, wide shot`;

    const image = await openai.images.generate({
      prompt: imagePrompt,
      n: 1,
      size: "1024x1024",
    });

    const imageUrl = image.data[0].url;

    res.json({ story, imageUrl });
  } catch (err) {
    console.error(err);
    res.status(500).send("AI yanıtı alınamadı.");
  }
});

app.listen(port, () => {
  console.log(`Server ${port} portunda çalışıyor.`);
});
