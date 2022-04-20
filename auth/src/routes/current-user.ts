import { Router } from 'express'
import { currentUser } from '@germanyn-org/tickets-common'

const router = Router()

router.get('/', currentUser, (req, res) => {
    res.send({ currentUser: req.currentUser || null })
})

export { router as currentUserRouter }
