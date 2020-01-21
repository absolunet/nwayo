# CLI - Nwayo Legacy

The fonctionnality ensure that `install workflow` and `install vendors` works on Nwayo using the latest CLI.

Those command trigger the legacy command for **nwayo project <= 3**.

## Console

**Files related :** `Kernel.js`, `LegacyCommand.js`, `commands/InstallCommand.js`

The **Kernel** will check if the current project is a legacy nwayo by calling the **nwayo legacy service**.

The **Kernel** will also handle calls for **legacy nwayo project** by calling the **legacy handler**.

The **legacy command** is hooked to the **command handler** and a log is added to be able to throw deprecation notice.

### Install command *(deprecated)*

The **install command** is available and will be handled by the **legacy handler**.

The command accept **scope** parameter. The parameters handled are `workflow` and `vendors`.

The command aceept the **flag** `force` to force the command.

The handle will call the correct command to forward by validating the **scope** parameter by using a mapping of the commands.

A **deprecation notice** will be shown if the command is **deprecated**.

### Exemples

Here's some exemples when installing from an **install command** in the terminal :

1. If the scope of the call is `workflow` then :
	1. **no error** will be thrown
	1. the `install:extensions` command will be forward
	1. a deprecation message will be shown to use the `install:extensions` command
1. If the scope of the call is `vendors` then :
	1. **no error** will be thrown
	1. the `install:components` command will be forward
	1. a deprecation message will be shown to use the `install:components` command
1. If the scope of the call is **any parameters** then :
	1. an **error** will be thrown
	1. **no command** will be forward
	1. **no deprecation message** will be shown
1. If **no scope** are given then :
	1. an **error** will be thrown
	1. **no command** will be forward
	1. **no deprecation message** will be shown


## Handlers

**Files related :** `legacy/LegacyHandler.js`

The handler will be call from the **Legacy Command** if the app detect the project is a **nwayo legacy**

The handle will send a **promise** with the `forwardChildProcess()`.

For the forward to work, it will need the `package.json` and the `nwayo-cli` in order to resolve the **child process _(spawn)_**.

### Exemples

Here's some exemple when handling the call :

1. If we have a valid `package.json` when calling an **existing** command (`install workflow` or `install vendors`) and `code 0` is return from the promise then :
	1. **no error** will be thrown
	1. command will be executed normaly
	1. installation will process

1. If we have a valid `package.json` when calling a **non existing** command (`install workflow` or `install vendors`) and `code 2` is return from the promise then :
	1. an **error** will be thrown
	1. command will be executed normaly

1. If we have a valid `package.json` when calling without argument and `code 2` is return from the promise then :
	1. **no error** will be thrown
	1. command will be executed normaly
	1. a list of nwayo commands will be shown *(legacy)*

## Services

**Files related :** `legacy/NwayoLegacyService.js`

The service is use to validate if the current project is a **nwayo legacy**

In order to validate if it's a legacy project, the function `projectIsLegacy()` will check :

1. if in the application
1. if the `nwayo.yaml` exist
1. the configuration legacy in the `nwayo.yaml` is `true`.

### Exemples

Here's some exemple of nwayo legacy validations :

1. If we are in the same current working as base path to validate if in application then :
	1. **not** in legacy project
	1. **no execution** for legacy will be run

1. If we are in the different current working as base path to validate if in application then :
	1. if `nwayo.yaml` doesn't exist in current working directory then :
		1. **not** in legacy project
		2. **no execution** for legacy will be run
	1. if `nwayo.yaml` exist in current working directory and has `legacy: true` in file then :
		1. **in** legacy project
		2. command will be **run** under **nwayo legacy**
	1. if `nwayo.yaml` exist in current working directory and no **legacy** is present in file then :
		1. **not** in legacy project
		2. **no execution** for legacy will be run

Otherwise, the project **won't be** considered a **nwayo legacy**

