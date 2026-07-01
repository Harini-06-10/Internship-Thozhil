# idThirdeye Technology Solutions — login, registration & site (with backend)

A full-stack student project: a real Node.js/Express backend with user
registration, login, password hashing, and session-based authentication,
gating access to a dashboard and the idThirdeye Technology Solutions
company website.

## Tech stack

- **Backend**: Node.js + Express
- **Database**: SQLite (via `better-sqlite3`) — a single file, no server to install
- **Views**: EJS (server-rendered HTML templates — no separate frontend build step)
- **Auth**: `bcryptjs` for password hashing, `express-session` +
  `connect-sqlite3` for session storage
- **Styling**: plain CSS (no framework)

## How to run it

You need [Node.js](https://nodejs.org) installed (v18+ recommended).

```bash
cd idthirdeye-app
npm install
npm start
```

Then open **http://localhost:3000** in your browser.

> **If `npm install` fails on `better-sqlite3`** with a compiler/build
> error: this usually means your system is missing build tools for
> native Node modules. On Windows, install the
> ["windows-build-tools"](https://github.com/nodejs/node-gyp#on-windows)
> or just install the latest Node LTS, which ships prebuilt binaries for
> most platforms. On Mac, run `xcode-select --install` first. This is a
> one-time setup issue, not a problem with the project code.

The first time you run it, two SQLite files are created automatically
inside `db/`:
- `app.db` — stores registered users (hashed passwords, never plain text)
- `sessions.db` — stores active login sessions

Both are created fresh on first run — you don't need to set up a
database yourself.

## How the flow works

1. Visiting `/` redirects to `/login` if you're not signed in, or
   `/dashboard` if you are.
2. **`/register`** — create an account. Passwords are hashed with
   bcrypt before they're stored; the plain password is never saved.
3. **`/login`** — checks your email exists, then compares your password
   against the stored hash.
4. On success, Express creates a **session** (a small signed cookie +
   a server-side record) so you stay logged in across page loads.
5. **`/dashboard`** — protected. Shows your account info and a link
   into the company site.
6. **`/idthirdeye`** — protected. The full idThirdeye Technology
   Solutions marketing site, with your name shown in the nav and a
   logout button.
7. **`/logout`** — destroys the session and sends you back to `/login`.

Visiting `/dashboard` or `/idthirdeye` directly without logging in
redirects you to `/login` automatically (see `middleware/requireAuth.js`).

## Project structure

```
idthirdeye-app/
├── server.js                 Express app entry point, session setup
├── package.json
├── db/
│   ├── database.js           SQLite connection + user queries
│   ├── app.db                 (created on first run)
│   └── sessions.db             (created on first run)
├── middleware/
│   └── requireAuth.js        Blocks protected routes if not logged in
├── routes/
│   ├── auth.js                /register, /login, /logout
│   └── main.js                /, /dashboard, /idthirdeye
├── views/                     EJS templates (server-rendered HTML)
│   ├── login.ejs
│   ├── register.ejs
│   ├── dashboard.ejs
│   └── idthirdeye.ejs
└── public/                    Static files served directly
    ├── css/
    │   ├── styles.css         Auth pages + dashboard styling
    │   └── idthirdeye.css     Company site styling
    └── js/
        └── idthirdeye.js      Scroll effects + contact form on the site
```

## Security notes (worth mentioning in your presentation)

- Passwords are **hashed with bcrypt**, never stored as plain text.
- Sessions are **httpOnly cookies** — JavaScript running on the page
  can't read the session cookie, which limits XSS-based session theft.
- Server-side validation on both register and login (not just HTML
  `required` attributes, which a user could bypass).
- The session secret in `server.js` is a placeholder — in a real
  production app it would come from an environment variable, not be
  hardcoded in the source file.

## What's intentionally simplified

This is a learning project, so a few things are simpler than a
production app would be:
- No email verification on registration
- No "forgot password" flow
- No rate-limiting on login attempts
- The session secret is hardcoded (would normally be an environment
  variable kept out of source control)

These are good points to raise in your presentation as "things I'd add
for a production version."
