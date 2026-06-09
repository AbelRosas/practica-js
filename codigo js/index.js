import express from 'express'
import cookieParser from 'cookie-parser'
import jwt from 'jsonwebtoken'
import { PORT, SECRET_JWT_KEY } from './config.js'
import { UserRepository } from './user-repository.js'

const app = express()
app.set('view engine', 'ejs')
app.use(express.json())
app.use(cookieParser())

// Middleware de Sesion mejorado: verifica el JWT en cada peticion
app.use((req, res, next) => {
  const token = req.cookies.access_token
  req.session = { user: null }
  try {
    const data = jwt.verify(token, SECRET_JWT_KEY)
    req.session.user = data
  } catch {}
  next()
})

// Ruta principal: muestra el formulario o el panel segun la sesion
app.get('/', (req, res) => {
  res.render('index', { user: req.session.user })
})

// Registro de usuarios
app.post('/register', async (req, res) => {
  const { username, password } = req.body
  try {
    const id = await UserRepository.create({ username, password })
    res.status(201).json({ id })
  } catch (error) {
    res.status(400).json({ error: error.message })
  }
})

// Inicio de sesion: genera el JWT y lo guarda en una cookie httpOnly
app.post('/login', async (req, res) => {
  const { username, password } = req.body
  try {
    const user = await UserRepository.login({ username, password })
    const token = jwt.sign(
      { id: user._id, username: user.username, role: user.role },
      SECRET_JWT_KEY,
      { expiresIn: '1h' }
    )
    res
      .cookie('access_token', token, {
        httpOnly: true, // No accesible desde JavaScript del cliente (protege de XSS)
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 1000 * 60 * 60
      })
      .send({ user })
  } catch (error) {
    res.status(401).send({ error: error.message })
  }
})

// Cierre de sesion: elimina la cookie con el token
app.post('/logout', (req, res) => {
  res.clearCookie('access_token').json({ message: 'Sesion cerrada' })
})

// Ruta protegida: solo accesible con un token valido
app.get('/protected', (req, res) => {
  const { user } = req.session
  if (!user) return res.status(403).render('index', { user: null })
  res.render('protected', { user })
})

app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`)
})
