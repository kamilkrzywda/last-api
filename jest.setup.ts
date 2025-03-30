import '@testing-library/jest-dom';
import { config } from 'dotenv';
import path from 'path';
import 'isomorphic-fetch';

// Load environment variables from .env.local
config({
  path: path.resolve(process.cwd(), '.env.local'),
});

// Add any global test setup here
beforeAll(() => {
  // Setup any test environment configurations
});

afterAll(() => {
  // Clean up any test environment configurations
});
