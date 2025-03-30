# Last API - Universal Structured Text Generator

A powerful Next.js application that serves as a universal API responder, capable of generating structured JSON responses based on custom schemas. Built with modern web technologies and AI integration. This project was primarily developed using [Cursor Editor](https://cursor.com), leveraging its AI-powered coding capabilities.

## Features

- **Dynamic Schema Builder**: Create and modify JSON schemas with support for:
  - String and String Array fields
  - Number and Number Array fields
  - Boolean and Boolean Array fields
- **Example Management**: Load and save schema examples for quick access
- **Real-time Schema Preview**: Instantly view and edit your schema in JSON format
- **AI-Powered Generation**: Utilizes OpenAI to generate structured responses based on your schema
- **Modern UI**: Built with Tailwind CSS for a responsive and clean interface

## Prerequisites

- Node.js (version specified in `.nvmrc`)
- Yarn package manager
- OpenAI API key

## Setup

1. Clone the repository
2. Install dependencies:
   ```bash
   yarn install
   ```
3. Copy the environment file and configure your OpenAI API key:
   ```bash
   cp .env.example .env.local
   ```
   Edit `.env.local` and add your OpenAI API key:
   ```
   OPENAI_API_KEY=your_api_key_here
   ```

## Development

Run the development server with Turbopack for faster builds:

```bash
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

## Testing

The project includes a comprehensive test suite using Jest and React Testing Library:

```bash
# Run tests
yarn test

# Run tests in watch mode
yarn test:watch

# Run tests with coverage
yarn test:ci

# Update test snapshots
yarn test:update
```

## Code Quality

The project maintains high code quality standards with:

- TypeScript for type safety
- ESLint for code linting
- Prettier for code formatting
- Jest for testing

Run the following commands to ensure code quality:

```bash
# Lint the code
yarn lint

# Format the code
yarn format
```

## Project Structure

```
src/
├── app/
│   ├── api/         # API routes and handlers
│   ├── hooks/       # Custom React hooks
│   ├── services/    # Service layer (OpenAI integration)
│   ├── page.tsx     # Main application page
│   └── layout.tsx   # Root layout component
```

## Deployment

The application is optimized for deployment on Vercel:

1. Push your changes to your Git repository
2. Connect your repository to Vercel
3. Configure environment variables in Vercel dashboard
4. Deploy!

For other platforms, build the production version:

```bash
yarn build
yarn start
```

## License

This project is open source and available under the MIT License.

```
MIT License

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```

## Acknowledgments

- This project was primarily developed using [Cursor Editor](https://cursor.com), an AI-powered code editor that significantly enhanced the development process.
- Built with Next.js and OpenAI integration

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
