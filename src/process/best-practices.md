# Feature Request: Option to restrict knowledge usage to repository-specific only

## Descriptioncd 

Currently, in DevinAI, *knowledges* (documents, context, etc.) can be added globally or pinned to a specific repository. However, Devin does not currently allow restricting the AI to **only** use the knowledge that is pinned to the current repository.

This can lead to confusion or inaccurate results, as Devin sometimes uses knowledge that is unrelated to the current project.

## Feature Request

Add an option in the repository or Devin Machine settings to **limit Devin to use only the knowledge that is explicitly pinned to that repository**, ignoring global knowledge not associated with it.

### Suggested Setting

> **Restrict Devin to use only repository-specific knowledges**  
> Type: Toggle (on/off)

## Benefits

- Prevents unrelated or outdated global knowledge from interfering with project-specific context.
- Improves the accuracy and relevance of Devin's responses.
- Enables stricter control over context per project in larger organizations.

## Optional

This could be configurable per repository, and optionally overridden temporarily during a specific task.