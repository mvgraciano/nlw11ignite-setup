import { FastifyInstance } from 'fastify'
import { z } from 'zod' //validations
import dayjs from "dayjs";

import { prisma } from './lib/prisma'

export async function appRoutes(app: FastifyInstance) {
    app.post("/habits", async (request) => {
        // const {} = request.body
        // const {} = request.params
        // const {} = request.query

        const createHabitBody = z.object({
            title: z.string(),
            weekDays: z.array(
                z.number().min(0).max(6)
            ) // [0(dom), 1(seg), 6(sab)]
        })

        const { title, weekDays } = createHabitBody.parse(request.body)

        const today = dayjs().startOf('day').toDate()

        await prisma.habit.create({
            data: {
                title,
                created_at: today,
                weekDays: {
                    create: weekDays.map(weekDay => {
                        return {
                            week_day: weekDay
                        }
                    })
                }
            }
        })
    })
}
