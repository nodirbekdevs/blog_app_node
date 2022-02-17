import { Router } from 'express'
import { AuthUserController } from '../controllers/authUser'
import { AuthUserValidator } from '../validators/auth'
import { Middleware } from '../middleware/auth'

const router = Router({ mergeParams: true })
const controller = new AuthUserController()
const validator = new AuthUserValidator()
const middleware = new Middleware()

router.post('/login', validator.login, controller.login)
router.post('/register', validator.login, controller.register)

export default router
