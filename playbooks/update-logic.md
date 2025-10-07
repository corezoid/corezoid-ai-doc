## 1. 📋 General Concept

Modification/change of an existing Corezoid process with already defined business logic:

- The user must describe the changes that need to be made to the existing logic.
  The user must specify the following parameters:
  - API_URL
  - API_TOKEN
  - WORKSPACE_ID
  - PROJECT_ID
  - ROOT_FOLDER_ID
  - PROC_ID
    All these parameters must be passed when calling the convctl.sh command

## 2. Exporting and analyzing the existing project

Before starting work, you need to export all existing project processes:

```bash
# Export processes by folder id
API_URL=<API_URL> API_TOKEN=<API_TOKEN> WORKSPACE_ID=<WORKSPACE_ID> ./convctl.sh fetch-folder <ROOT_FOLDER_ID> ~/repos/corezoid-ai-doc/.processes
```
where ~/repos/corezoid-ai-doc/.processes is the folder where all exported JSON processes of the project will be saved

---

Then you need to analyze all exported processes in the ~/repos/corezoid-ai-doc/.processes folder and select those that need to be used for logic modification.


## 3. Getting the current JSON process

For our work, we need to export the current version of the process for modification:

```bash
# Process export
API_URL=<API_URL> API_TOKEN=<API_TOKEN> WORKSPACE_ID=<WORKSPACE_ID> ./convctl.sh fetch-process <PROC_ID> ~/repos/corezoid-ai-doc/.processes/target_process.json
```
where ~/repos/corezoid-ai-doc/.processes/target_process.json is where the exported JSON process will be saved for editing

## 4. Using Variables for Constants

All constants such as `url`, `login`, `secret`, API endpoints, database hosts, and other configuration values should be stored in variables instead of hardcoding them. Variables are stored in the `.processes/variables.json` file.

**Variable naming rules:**
- Variable names can only contain lowercase letters `[a-z]`, numbers `[0-9]`, and hyphens `-`
- Variable NAME and DESCRIPTION must be at least 3 characters long
- Examples: `paypal-url`, `api-token-123`, `database-host`, `service-endpoint`

**Steps for using variables:**

1. **Check if variable exists**: First, verify if the required variable already exists in `.processes/variables.json`

2. **Create new variable if needed**: If the variable doesn't exist, create it using:
   ```bash
   API_URL=<API_URL> API_TOKEN=<API_TOKEN> WORKSPACE_ID=<WORKSPACE_ID> ./convctl.sh create-variable <PROJECT_ID> <ROOT_FOLDER_ID> NAME DESCRIPTION VALUE
   ```

3. **Use variable in logic**: Reference the variable in your logic using the format `{{env_var[@variable-name]}}`:
   ```json
   {
     "type": "set_param",
     "extra": {
       "url": "{{env_var[@api-endpoint]}}",
       "token": "{{env_var[@auth-token]}}",
       "database_host": "{{env_var[@db-host]}}"
     },
     "extra_type": {
       "url": "string",
       "token": "string",
       "database_host": "string"
     },
     "err_node_id": "68c7d861e552e8d570a1096e"
   }
   ```

**Example: Adding API endpoint variable**

1. **Check variable in `.processes/variables.json`**: Verify that `api-endpoint` doesn't exist
2. **Create the variable**:
   ```bash
   API_URL=https://admin.corezoid.com API_TOKEN=123 WORKSPACE_ID=123 ./convctl.sh create-variable 123 123 api-endpoint "Main API Endpoint" "https://api.example.com"
   ```
3. **Use the variable in logic**:
   ```json
   {
     "type": "set_param",
     "extra": {
       "baseUrl": "{{env_var[@api-endpoint]}}"
     }
   }
   ```

---

## 5. Implementing changes in the process logic.
Implement the necessary changes according to the requirements.
Make all changes to the JSON process in the ~/repos/corezoid-ai-doc/.processes/target_process.json file


## 6. 🧪 Mandatory result verification (updated JSON process)

Execute the command:

```bash
API_URL=<API_URL> API_TOKEN=<API_TOKEN> WORKSPACE_ID=<WORKSPACE_ID> ./convctl.sh run-process <PROC_ID> ~/repos/corezoid-ai-doc/.processes/target_process.json <task_data>
```

Where:

- `<task_data>` — json containing all incoming request parameters.

#### Example:

```bash
API_URL=https://admin.corezoid.com API_TOKEN=123 WORKSPACE_ID=123 ./convctl.sh run-process 123 ~/repos/corezoid-ai-doc/.processes/target_process.json '{"key1":"val1"}'

```

The verification must pass successfully.

---

## 7. 🔧 Step-by-step instruction for connector correction

- Export the existing project

- Export the current process

- Analyze the exported project and exported process. Analyze the changes described by the user that need to be made

- Make corrections to the JSON process in the ~/repos/corezoid-ai-doc/.processes/target_process.json file

- Test the process by executing a test request (./convctl.sh run-process).

---


## 8. 📚 Documentation links

- **Corezoid Node Types**:
  - [start-node.md](./src/nodes/start-node.md)
  - [code-node.md](./src/nodes/code-node.md)
  - [code-node-libraries.md](./src/nodes/code-node-libraries.md)
  - [call-process-node.md](./src/nodes/call-process-node.md)
  - [api-call-node.md](./src/nodes/api-call-node.md)
  - [reply-to-process-node.md](./src/nodes/reply-to-process-node.md)
  - [end-node.md](./src/nodes/end-node.md)

- **Process Construction Rules**:
  - [process-development-guide.md](./src/process/process-development-guide.md)
  - [process-json-validation.md](./src/process/process-json-validation.md)
  - [error-handling.md](./src/process/error-handling.md)

- **Best Practices**:
  - [node-positioning-best-practices.md](./src/process/node-positioning-best-practices.md)