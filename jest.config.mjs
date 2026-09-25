import nextJest from "next/jest.js";

const createJestConfig = nextJest({ dir: "./" });

/** @type {import("jest").Config} */
const config = {
  testEnvironment: "node",
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/$1",
  },
  testPathIgnorePatterns: ["/node_modules/", "/.next/", "/.open-next/", "/.wrangler/"],
  // ビルド成果物内の package.json と名前が衝突しないように除外
  modulePathIgnorePatterns: ["<rootDir>/.next/", "<rootDir>/.open-next/", "<rootDir>/.wrangler/"],
};

export default createJestConfig(config);
