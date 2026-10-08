const express = require("express");

const app = express();

app.use(express.json());

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

    const datos = await respuesta.json();

    const texto =
      datos.candidates?.[0]?.content?.parts?.[0]?.text ||
      "No pude obtener una respuesta.";

    res.json({ respuesta: texto });

  } catch (error) {
    console.error(error);
    res.status(500).json({
      respuesta: "Error al conectar con mi cerebro."
    });
  }
});

app.get("/", (req, res) => {
  res.send("JARVIS X está en línea 🤖");
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`JARVIS X funcionando en el puerto ${PORT}`);
});
