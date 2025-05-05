import {z} from "zod";

export const userFormSchema = z.object({
    first_name:z.string().min(3),
    last_name:z.string().min(3),
    email:z.string().email(),
    status:z.enum(["active","inactive"])
});

export type UserFormValues = z.infer<typeof userFormSchema>;