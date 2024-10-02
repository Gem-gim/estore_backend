import { defineConfig } from "cypress";
const randomEmail = require("random-email");

import {
  uniqueUsernameGenerator,
  Config,
  adjectives,
  nouns,
} from "unique-username-generator";

const config: Config = {
  dictionaries: [adjectives, nouns],
  separator: "",
  style: "capital",
  randomDigits: 3,
};

const email = randomEmail();
const username = uniqueUsernameGenerator(config);

export default defineConfig({
  e2e: {
    baseUrl: "http://localhost:3000",
  },
  env: {
    CYPRESS_TEST_USER_NAME: username,
    CYPRESS_TEST_USER_EMAIL: email,
    CYPRESS_TEST_USER_PASSWORD: "Test2022&",
  },
});
