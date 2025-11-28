import app from "./app.js";

const PORT = process.env.PORT || 27148;

app.listen(PORT, () => {
    console.log(`Servidor funcionando en el puerto ${PORT}`);
});