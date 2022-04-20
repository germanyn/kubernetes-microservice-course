import request from 'supertest'
import { app } from '../../app'

it('returns a 201 on a sucessful signup', async () => {
    await request(app)
        .post('/api/users/signup')
        .send({
            email: 'test@test.com',
            password: 'password',
        })
        .expect(201)
})

it('returns a 400 with invalid email', async () => {
    await request(app)
        .post('/api/users/signup')
        .send({
            email: 'test',
            password: 'password',
        })
        .expect(400)
})

it('returns a 400 with invalid password', async () => {
    await request(app)
        .post('/api/users/signup')
        .send({
            email: 'test@email.com',
            password: 'p',
        })
        .expect(400)
})

it('returns a 400 with missing email and password', async () => {
    await request(app)
        .post('/api/users/signup')
        .send({
            email: 'test@email.com',
        })
        .expect(400)
    await request(app)
        .post('/api/users/signup')
        .send({
            password: 'password',
        })
        .expect(400)
})

it('dissalows duplicate emails', async () => {
    await request(app)
        .post('/api/users/signup')
        .send({
            email: 'test@test.com',
            password: 'password',
        })
        .expect(201)
    await request(app)
        .post('/api/users/signup')
        .send({
            email: 'test@test.com',
            password: 'password',
        })
        .expect(400)
})

it('sets a cookie after sucessful signup', async () => {
    const response = await request(app)
        .post('/api/users/signup')
        .send({
            email: 'test@test.com',
            password: 'password',
        })
        .expect(201)
    
    expect(response.get('Set-Cookie')).toBeDefined()
})