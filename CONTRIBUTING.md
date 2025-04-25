# Contributing to Corezoid AI Documentation

Thank you for your interest in contributing to the Corezoid AI Documentation! This guide will help you get started.

## Code of Conduct

Please read and follow our [Code of Conduct](CODE_OF_CONDUCT.md) to foster an inclusive community.

## How Can I Contribute?

### Reporting Issues

- Check if the issue already exists in the [issue tracker](https://github.com/corezoid/corezoid-ai-doc/issues)
- Use a clear and descriptive title
- Include steps to reproduce the issue
- Describe what you expected to happen and what actually happened

### Suggesting Enhancements

- Use a clear and descriptive title
- Provide a step-by-step description of the suggested enhancement
- Explain why this enhancement would be useful

### Pull Requests

1. Fork the repository
2. Create a new branch from `develop`
   ```bash
   git checkout -b feature/your-feature-name
   ```
3. Make your changes following our [Style Guide](#style-guide)
4. Format your documentation using `npm run format`
5. Commit your changes with a clear message
6. Push to your fork
7. Create a pull request to our `develop` branch

## Style Guide

### File Naming Conventions

- Use kebab-case for all filenames (e.g., `api-call-node.md`, `reply-to-process.conv.json`)
- Follow the naming patterns established in the `/src/nodes` folder
- For process examples, use descriptive names that indicate the node type or pattern being demonstrated

### Markdown Formatting

- Use Prettier for consistent formatting
- Run `npm run format` before committing changes
- Follow the structure of existing documentation files
- Use headings to organize content logically

### Content Guidelines

- Write clear, concise explanations
- Include examples where appropriate
- Use code blocks for JSON, JavaScript, and command line examples
- Include screenshots or diagrams for complex concepts

## Development Process

### Local Development

1. Install dependencies
   ```bash
   npm install
   ```

2. Format markdown files
   ```bash
   npm run format
   ```

3. Validate JSON schema (if applicable)
   ```bash
   npm run validate:schema
   ```

4. Build documentation
   ```bash
   npm run build:docs
   ```

## Getting Help

If you have questions or need help, please:
- Open an issue with the label "question"
- Reach out to the maintainers

Thank you for your contributions!