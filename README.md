# Overview

A simple Angular application to showcase a standalone service provider frontend.

# Get Started

> Before start, please make sure the following are installed on your local machine. 
> * node & npm

Ask CIP to get the integration information, for our example:

env key | env value | description
---|---|---
CIP_HOST |  | Get the address from CIP provider 
CLIENT_ID | spample-standalone | OAuth2 Client Id
SCOPE | default-spample-standalone-scope | OAuth2 Scope

Then update the configuration 

> src/environments/environment.ts

```js
export const environment = {
	production: false,
	GATEWAY_PATH: '/gateway',
	CIP_HOST: 'get_the_cip_host_from_provider',
	CLIENT_ID: 'spample-standalone',
	SCOPE: 'default-spample-standalone-scope',
};
```


1. Install Dependencies

```
npm install
```

2. Start the Application

```
npm start
```

3. Examine it 

Open chrome browser , enter the following urls 

> http://127.0.0.1:4200/

* It will be redirected to CIP host to ask SSO login.
* Finally it will be redirected back after login successfully. 

