import { z } from 'zod'

export const productSchema = z.object({
  name:  z.string().min(2),
  value: z.preprocess(Number, z.number().positive()),
  image: z.string().url().optional(),
})
export type ProductInput = z.infer<typeof productSchema>