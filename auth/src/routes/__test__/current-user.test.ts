import request from 'supertest'
import { app } from '../../app'

it('responds with details about the current user', async () => {
    const cookie = await signin()
    const response = await request(app)
        .get('/api/users/current-user')
        .set('Cookie', cookie)
        .send()
        .expect(200)
    expect(response.body.currentUser.email).toBe('test@test.com')
})

it('returns a 401 when not logged in', async () => {
    const response = await request(app)
        .get('/api/users/current-user')
        .send({
            email: 'test@test.com',
            password: 'password',
        })
        .expect(200)

    expect(response.body.currentUser).toBe(null)
})
