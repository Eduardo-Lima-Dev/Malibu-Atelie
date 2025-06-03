import { z } from 'zod'

export const userRegisterSchema = z.object({
  name:     z.string().min(2, 'Nome curto demais'),
  email:    z.string().email('E-mail inválido'),
  password: z.string().min(6, 'Senha ≥ 6 caracteres'),
})
export type UserRegister = z.infer<typeof userRegisterSchema>