# Reading a Cloudflare Pages/Workers build log

Cloudflare's build logs print a lot of diagnostic noise on any failure —
account info, membership roles, log file paths. None of that is the error.
The actual cause is always a line starting with `✘ [ERROR]`. If a user
pastes a log and you don't see that line, ask them to scroll to it rather
than guessing from the surrounding noise.

## "Missing Pages project name. Use --project-name <name> or set the name
## in your Wrangler configuration file."

`wrangler pages deploy <dir>` doesn't know which Pages project to upload
to. Fix: add `--project-name=<name>` to the deploy command, and/or add
`name = "<name>"` to `wrangler.toml`.

## "A request to the Cloudflare API (/accounts/.../pages/projects/...)
## failed. Authentication error [code: 10000]"

This reads like a login/auth problem but is almost always a **permission**
problem: the token in play does not have `Cloudflare Pages : Edit`. Look at
the lines right after it:

```
ℹ️  The API Token is read from the CLOUDFLARE_API_TOKEN environment variable.
┌─────────────────────┬──────────────────────────────────┐
│ Account Name         │ Account ID                        │
...
🎢 Membership roles in "...": ...
- Super Administrator - All Privileges
```

That "Super Administrator — All Privileges" line describes the **user's**
role in the Cloudflare account (from their dashboard login) — it says
nothing about what the **token** itself is scoped to. A token can be
created by a Super Administrator and still be narrowly scoped. Don't let
that line read as "the permissions are fine" — check the token's actual
permission list instead (My Profile → API Tokens → tap the token → its
permissions are listed there even though the secret value isn't
re-shown).

Common cause: the token was built from the **"Edit Cloudflare Workers"**
template, which never includes Cloudflare Pages. Fix: add a
`Account → Cloudflare Pages → Edit` permission row to that token (editing
in place keeps the same secret value — no need to update anywhere the
token is already stored), or create a fresh token with that permission and
swap it in.

If the same exact error persists after fixing the token you *thought* was
in use, check whether there's a **second, auto-generated per-project
token** also in play — visible in a build's "Build settings" panel, named
like `<project-name> build token`. This is Cloudflare's own
internally-managed token for the project, separate from any custom token
manually set as a `CLOUDFLARE_API_TOKEN` variable. If the account ID in
the log matches the right account but the error repeats identically after
editing the "wrong" token, this is the one to check/edit instead.

## The account ID is right there in the error

`/accounts/<account-id>/pages/projects/...` — no need to make the user go
find their Account ID separately if this error has already appeared once.

## Nothing wrong is showing, but the site doesn't resolve

If the deploy genuinely succeeded (a `*.pages.dev` URL works) but the
custom domain doesn't resolve, that's almost always because **Custom
domains** hasn't been added to the project yet — not a deploy failure.
Adding the domain there is what creates the DNS record.
