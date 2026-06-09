import DBLocal from 'db-local'
import crypto from 'node:crypto'
import bcrypt from 'bcrypt'
import { SALT_ROUND } from './config.js'

const { Schema } = new DBLocal({ path: './db' })

// Esquema de usuario: ahora incluye el campo "role" (admin/user)
const User = Schema('User', {
  _id: { type: String, required: true },
  username: { type: String, required: true },
  password: { type: String, required: true },
  role: { type: String, required: true }
})

export class UserRepository {
  static async create ({ username, password }) {
    // Validacion de los datos de entrada
    Validation.username(username)
    Validation.password(password)

    // Se verifica que el usuario no exista previamente
    const existingUser = User.findOne({ username })
    if (existingUser) throw new Error('El nombre de usuario ya esta en uso')

    const _id = crypto.randomUUID()
    const hashedPassword = await bcrypt.hash(password, SALT_ROUND)

    // Personalizacion: el primer usuario registrado sera administrador
    const isFirstUser = User.find().length === 0
    const role = isFirstUser ? 'admin' : 'user'

    User.create({ _id, username, password: hashedPassword, role }).save()

    return _id
  }

  static async login ({ username, password }) {
    Validation.username(username)
    Validation.password(password)

    const user = User.findOne({ username })
    if (!user) throw new Error('Usuario no encontrado')

    const isValid = await bcrypt.compare(password, user.password)
    if (!isValid) throw new Error('Contraseña incorrecta')

    // Se devuelve el usuario sin la contraseña (datos publicos)
    const { password: _, ...publicUser } = user
    return publicUser
  }
}

// Clase encargada de validar los datos del usuario
class Validation {
  static username (username) {
    if (typeof username !== 'string') throw new Error('El usuario debe ser texto')
    if (username.length < 4) throw new Error('Minimo 4 caracteres para el usuario')
    if (!/^[a-zA-Z0-9]+$/.test(username)) throw new Error('Usuario sin caracteres especiales')
  }

  static password (password) {
    if (typeof password !== 'string') throw new Error('La contraseña debe ser texto')
    if (password.length < 8) throw new Error('La contraseña debe tener al menos 8 caracteres')
  }
}
