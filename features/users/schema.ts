import { z } from "zod";

const uuidField = z.string().uuid("Must be a valid ID");

/** Mirrors backend UserData constraints (name lengths, email, password). */
export const createUserSchema = z.object({
  name: z.string().min(1, "Name is required").max(56),
  email: z.string().min(1, "Email is required").email("Enter a valid email"),
  phone_number: z.string().min(1, "Phone number is required"),
  password: z.string().min(8, "Password needs 8+ characters"),
  partner_id: uuidField,
  role_id: uuidField,
  designation: z.string().optional(),
  parent_id: z.string().uuid().nullish(),
});

export type CreateUserForm = z.infer<typeof createUserSchema>;

/** Update accepts any subset; empty strings mean untouched. */
export const updateUserSchema = createUserSchema.omit({ password: true }).partial();

export type UpdateUserForm = z.infer<typeof updateUserSchema>;
