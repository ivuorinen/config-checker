import ivuorinenConfig from "@ivuorinen/eslint-config";

// The shared config ignores lib/, which in a consumer is usually build output.
// Here lib/ is this package's source, so it is linted.
export default [...ivuorinenConfig, { ignores: ["!lib/"] }];
