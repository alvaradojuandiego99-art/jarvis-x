const express = require("express");

const app = express();

app.use(express.json());

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.header("Access-Control-Allow-Headers", "Content-Type");
  next();
});

app.get("/", (req, res) => {
  res.send("JARVIS X está en línea 🤖");
});

app.post("/chat", async (req, res) => {
  try {
    const mensaje = req.body.mensaje;

    const respuesta = await fetch(
      "https://generativelanguage.googleapis.com/v1beta/models/gemini-3.8-flash:generateContent",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-goog-api-key": process.env.GEMINI_API_KEY
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: mensaje
                }
              ]
            }
          ]
        })
      }
    );

    const data = await respuesta.json();

    console.log("GEMINI:", JSON.stringify(data));

    if (!respuesta.ok) {
      return res.json({
        respuesta: "Error de Gemini: " + (data.error?.message || "Error desconocido")
      });
    }

    const texto =
      data.candidates?.[0]?.content?.parts?.[0]?.text;

    res.json({
      respuesta: texto || "Gemini no devolvió texto."
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      respuesta: "Error del servidor: " + error.message
    });
  }
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`JARVIS X funcionando en el puerto ${PORT}`);
});
