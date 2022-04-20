import { Types } from "mongoose";
import { Ticket } from "../ticket";

it('implements optmistic concurrency control', async () => {
    const ticket = await Ticket.build({
        title: 'concert',
        price: 10,
        userId: new Types.ObjectId().toHexString(),
    }).save()

    const [
        firstInstance,
        secondInstance,
    ] = [
        await Ticket.findById(ticket.id),
        await Ticket.findById(ticket.id),
    ]
    if(!firstInstance || !secondInstance)
        return fail("Unexpected find ticket instances error")

    firstInstance.set({ price: 10 })
    secondInstance.set({ price: 15 })

    await firstInstance.save()
    
    await expect(secondInstance.save()).rejects.toThrow()
})

it('increments the verion number on multiples saves', async () => {
    const ticket = await Ticket.build({
        title: 'concert',
        price: 10,
        userId: new Types.ObjectId().toHexString(),
    }).save()

    expect(ticket.version).toEqual(0)
    await ticket.save()
    expect(ticket.version).toEqual(1)
    await ticket.save()
    expect(ticket.version).toEqual(2)
})