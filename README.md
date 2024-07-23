# if-plugin-template

`if-plugin-template` is an environmental impact calculator template which exposes an API for [IF](https://github.com/Green-Software-Foundation/if) to retrieve energy and embodied carbon estimates.

## Implementation

Here can be implementation details of the plugin. For example which API is used, transformations and etc.

## Usage

### Using local links

For using locally developed model in `IF Framework` please follow these steps: 

1. On the root level of a locally developed model run `npm link`, which will create global package. It uses `package.json` file's `name` field as a package name. Additionally name can be checked by running `npm ls -g --depth=0 --link=true`.
2. Use the linked model in impl by specifying `name`, `method`, `path` in initialize models section. 

```yaml
name: plugin-demo-link
description: loads plugin
tags: null
initialize:
  plugins:
    my-custom-plugin:
      method: MyCustomPlugin
      path: "<name-field-from-package.json>"
      global-config:
        ...
...
```

### Using directly from Github

You can simply push your model to the public Github repository and pass the path to it in your impl.
For example, for a model saved in `github.com/my-repo/my-model` you can do the following:

npm install your model: 

```
npm install -g https://github.com/my-repo/my-model
```

Then, in your `impl`, provide the path in the model instantiation. You also need to specify which class the model instantiates. In this case you are using the `PluginInterface`, so you can specify `OutputModel`. 

```yaml
name: plugin-demo-git
description: loads plugin
tags: null
initialize:
  plugins:
    my-custom-plugin:
      method: MyCustomPlugin
      path: https://github.com/my-repo/my-model
      global-config:
        ...
...
```

Now, when you run the `manifest` using the IF CLI, it will load the model automatically. Run using:

```sh
if-run --manifest <path-to-your-impl> --output <path-to-save-output>
```

# *for this plugin* Install and use alongside Cauron (currently private project)
> WARNING: This use case is currently in testing
To shorten the process of downloading the required npm packages, the following installation aims to use npm's `npm run prepare` script to ease the set up.

## Install by cloning
1. Clone the repo 
Run `git clone git@github.com:green-craft/if-plugin-gcf-regex.git`

To define your desired folder to encapsulate the repo clone, use `:[folder name]`, e.g.:
`git clone git@github.com:green-craft/if-plugin-gcf-regex.git:my_folder`

You can also append your desired destination path afterward
```
git clone git@github.com:green-craft/if-plugin-gcf-regex.git:my_folder destination/folder // clones to the directory under destination/folder/whatever

git clone git@github.com:green-craft/if-plugin-gcf-regex.git:my_folder . //clones to your terminal's current directory
```

2. Go to the cloned repo and install with npm 
Run `npm install -g /path_to_your_clone`

3. Run the Cauron pipeline as per instructed on the repo

If the plugin cannot be found within the manifest file's `if-run`, 
1. `cd /path_to_your_clone`, 
2. run `npm link`
3. `cd /path_to_manifest_file_directory`
4. run `npm link if-plugin-gcf-regex`
5. Re-run the `if-run` command as instructed in Cauron's README
Do replace the `/path_to_your_clone` and `path_to_manifest_file_directory` with the file paths on your machine.

## Install by npm and git
Run the following command
`npm install git+https://github.com/green-craft/if-plugin-gcf-regex.git`
If the manifest file cannot read the `if-plugin-gcf-regex` module, try to install by cloning (see above) and use `npm link` to create the symlink for `if-run` to find the right module installed.

# Troubleshooting 
Should there be issues running, try to download the dependencies first:
1. Husky `npm install husky`
2. Rimraf `npm install rimraf`

Alternatively, after cloning the repo, navigate to the repo folder and run `npm link`. This helps npm scripts to find the module by the module name of `if-plugin-gcf-regex` in the pipeline. Note that any changes to your repo clone will affect the version of the plugin you are using. See above (Install by cloning) for more.