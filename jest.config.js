module.exports = {
	preset: "ts-jest",
	testEnvironment: "node",
	testMatch: ["**/__tests__/**/*.test.ts"],
	moduleFileExtensions: ["ts", "js", "json", "node"],
	transform: {
		"^.+\\.ts$": [
			"ts-jest",
			{
				isolatedModules: true,
			},
		],
	},
	collectCoverage: true,
	collectCoverageFrom: [
		"src/services/**/*.{ts,js}", // Inclure tous les fichiers dans services
		"src/controllers/**/*.{ts,js}", // Inclure tous les fichiers dans controllers
		"src/utils/**/*.{ts,js}", // Inclure tous les fichiers dans utils
		"src/config/**/*.{ts,js}", // Inclure tous les fichiers dans config
		"!src/**/*.d.ts", // Exclure les fichiers de définition de types
		"!**/node_modules/**", // Exclure le dossier node_modules
	],
	coverageDirectory: "coverage",
	coverageReporters: ["json", "lcov", "text", "clover"],
};
