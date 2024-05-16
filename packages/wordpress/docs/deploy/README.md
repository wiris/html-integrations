# Deploy WordPress with MathType and Docker

Follow these instructions to set up your WordPress Docker container with the MathType plugin installed.

### 01. Create the build

On the root folder, run the following commands to build the JS:

```
yarn
nx build wordpress
```

### 02. Run the Docker Image

1. Set the wordpress volume path:

```bash
export WORDPRESS_WWWROOT="/var/www"
```

2. On the root folder, build a docker container using the command:

```sh
nx start wordpress
```

This will start a Docker with WordPress and MathType on [localhost:8080](http://localhost:8080/).

> The code will be stored locally at `<WORDPRESS_WWWROOT>/wordpress`.

### 03. Login as admin

1. Navigate to admin dashboard [localhost:8080/wp-admin](http://localhost:8080/wp-admin).
2. Log in as admin:
   - **Username:** admin
   - **Passowrd:** admin

### 04. Use MathType for WordPress

1. On the admin dashboard, go to the 'Pages > all pages' and edit the MathType Sample page.
2. Click the `add block` button on your document.
3. Select the `classic` option. This will create a TinyMCE Classic editor.
4. Inside the `Classic block`, there'll be the MT/CT buttons on the toolbar ready to use.

### 04. Stop the docker image and WordPress

On the root folder, take down all the docker containers for WordPress with the following command:

```sh
nx stop wordpress
```
