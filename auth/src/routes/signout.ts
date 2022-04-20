import { Router } from 'express'

const router = Router()

router.get('/', (req, res) => {
    req.session = null
    res.send({})
})

export { router as signoutRouter }
