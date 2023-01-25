# Ledger Connect Kit demo

Just install the dependencies and start the application using your preferred package manager, examples using yarn.

```bash
yarn
HTTPS=true yarn start
```

For WalletConnect connections to work when testing on mobile devices the server needs to be served using HTTPS, by setting `HTTPS=true` on the shell. This will serve the app at <https://localhost:3000> and your local network address and you might have to ignore the browser warnings about the connection not being private to get to the app.

- Safari shows a page titled *This Connection Is Not Private*; press the *Show details* button and then the *visit this website* link. On the modal *Are you sure you want to visit this website on a connection that is not private?* press *Visit website*.
- Chrome shows *Your connection is not private*; press the *Advanced* button and then the *Proceed to localhost (unsafe)* link.
