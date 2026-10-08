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
      "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=" +
        process.env.GEMINI_API_KEY,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
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

    console.log("RESPUESTA GEMINI:", JSON.stringify(data));

    if (data.error) {
      return res.json({
        respuesta: "Error de Gemini: " + data.error.message
      });
    }

    const texto =
      data.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!texto) {
      return res.json({
        respuesta: "Gemini no devolvió texto. Revisa la configuración de la API."
      });
    }

    res.json({ respuesta: texto });

  } catch (error) {
    console.error("ERROR:", error);

    res.status(500).json({
      respuesta: "Error del servidor: " + error.message
    });
  }
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`JARVIS X funcionando en el puerto ${PORT}`);
});
