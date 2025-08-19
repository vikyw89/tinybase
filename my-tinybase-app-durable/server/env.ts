import z from "zod";
import "@dotenvx/dotenvx/config";

const EnvSchema = z.object({
	DATABASE_URL: z.string(),
	NODE_ENV: z
		.enum(["development", "test", "production"])
		.default("development"),
});

export const env = EnvSchema.parse(process.env);
