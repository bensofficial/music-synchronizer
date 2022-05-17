export default function getEnvVar(name: string): string {
	const envVar = process.env[name];

	if (!envVar) {
		throw new Error(`Environment variable ${name} is not defined`);
	}

	return envVar;
}
