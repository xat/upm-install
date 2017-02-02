# upm-install

upm-install ist a small utility which allows you to install add-ons for JIRA and Confluence
cloud. It can be used as cli or as library.

### installation

`npm install upm-install -g`

### usage cli

```
  upm-install
      --descriptorUrl <url>
      --productUrl <url>
      --username <username>
      --password <password>
```

### usage library

```JavaScript
  const upmInstall = require('upm-install')

  upmInstall({
    descriptorUrl: '<url>',
    productUrl: '<url>',
    username: '<username>',
    password: '<password>'
  })
  .then(function() {
    // addon was successfully installed
  })
  .catch(function() {
    // failed to install addon
  })
```

## License
Copyright (c) 2017 Simon Kusterer
Licensed under the MIT license.