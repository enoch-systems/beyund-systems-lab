import z from "zod";

export const recentCustomersSchema = z.object({
  id: z.string(),
  name: z.string(),
  email: z.string(),
  joined: z.string(),
});

export type RecentCustomerRow = z.infer<typeof recentCustomersSchema>;
