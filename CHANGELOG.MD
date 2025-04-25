# Changelog

## [Unreleased]

### Removed
- UUIDs from processes, nodes, specs, examples, and documentation
- Function wrappers from Code Node documentation

### Fixed
- Ensured object values in Set Parameters nodes are properly stringified with escaped quotes
- Ensured all set_param nodes include the err_node_id parameter
- Ensured all condition nodes include a default path with "go" type and "to_node_id"
