import Joi from "joi";

export const nameSchema = Joi.string()
	.trim()
	.min(1)
	.max(20)
	.pattern(/^[A-Za-z0-9]+$/) // regex para solo permitir lo normal
	.required()
	.messages({
		"string.pattern.base": "solo letras y numeros permitidos (sin espacios ni simbolos)",
		"string.min": "el nombre debe tener al menos 1 caracter",
		"string.max": "maximo 20 caracteres",
		"any.required": "el nombre es requerido"
	});