import {z} from "zod";

export const registerSchema = z.object({
    name: z
    .string()
    .min(2, "Name must contain at least 2 characters.")
    .max(99, "Name is too long"),

    email: z
    .email("Invalid email address"),

    password: z
    .string()
    .min(8, "Password must contain at least 8 characters."),
    
    confirmPassword: z
    .string()
})
.refine((data) => data.password === data.confirmPassword,
{
    path: ["confirmPassword"],
    message: "Passwords do not match",
}
);

export type RegisterSchema = z.infer<typeof registerSchema>;