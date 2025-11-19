import "dotenv/config";
import express from "express";
import morgan from "morgan";
import Joi from "joi";
import { AppDataSource, connectDB } from "./config/configDb.js";
import { routerApi } from "./routes/index.routes.js";
import { nameSchema } from "./validations/usuario.schema.js";

// Usuarios de prueba
const usuarios = [];

// Aplicacion
const app = express();
app.use(express.json());
app.use(morgan("dev"));

// Ruta principal de bienvenida
app.get("/", (req, res) => {
	res.send("¡Bienvenido a mi API REST con TypeORM!");
});

// intentar registrar un usuario.
app.post("/api/registrar", async(req, res)=> {
	// realizar una validacion con joi para el nombre ingresado.
	const { error, value } = nameSchema.validate(req.body?.name, { abortEarly: false });
	if(error) {
		return res.status(400).json({ message: "nombre invalido", details: error.details.map(d=> d.message) });
	}
	const name = value;
	const pass = req.body?.pass ?? "";

	// chequear si el usuario ya existe
	const existe = users.some(u=> u.name.toLowerCase() === name.toLowerCase());
	if(existe) {
		return res.status(409).json({ message: "usuario ya existe" });
	}

	users.push({ name, pass });
	return res.status(201).json({ message: "registrado", name });
});

// revisar si un usuario existe
app.get("/api/revisar",(req, res)=> {
	const raw = req.query?.name ?? "";

	// validar aqui tambien (porsiacaso)
	const { error, value } = nameSchema.validate(raw, { abortEarly: false });
	if(error) {
		return res.status(400).json({ message: "nombre invalido", details: error.details.map(d=> d.message) });
	}
	const name = value;

	const existe = users.some(u=> u.name.toLowerCase() === name.toLowerCase());
	if(existe) {
		return res.json({ message: "existe!", name });
	}
	return res.json({ message: "no existe...", name });
});

// Inicializa la conexión a la base de datos
connectDB()
	.then(() => {
		// Carga todas las rutas de la aplicación
		routerApi(app);

		// Levanta el servidor Express
		const PORT = process.env.PORT || 3000;
		app.listen(PORT, () => {
			console.log(`Servidor iniciado en http://localhost:${PORT}`);
		});
	})
	.catch((error) => {
		console.log("Error al conectar con la base de datos:", error);
		process.exit(1);
	});
