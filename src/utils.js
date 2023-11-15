// Creación de __dirname 
// (__dirname no funciona con ES Modules por lo tanto debemos recrearlo para ocuparlo.)
import { dirname } from 'path'
import { fileURLToPath } from 'url'
export const __dirname = dirname(fileURLToPath(import.meta.url))