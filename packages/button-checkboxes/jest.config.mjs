export default {
	collectCoverage: true,
	coverageDirectory: '../../.coverage/',
	testEnvironment: 'jsdom',
	moduleNameMapper: {
		'^uuid$': '<rootDir>/node_modules/uuid/dist/index.js',
	},
};
