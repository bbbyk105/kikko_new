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

// jose は ESM のみ配布なので、node_modules のうち jose だけは変換する（next/jest の既定は node_modules を変換しない）
const jestConfig = async () => {
  const resolved = await createJestConfig(config)();
  return {
    ...resolved,
    transformIgnorePatterns: [
      "/node_modules/(?!jose/)",
      ...(resolved.transformIgnorePatterns ?? []).filter((pattern) => !pattern.includes("node_modules")),
    ],
  };
};

export default jestConfig;
