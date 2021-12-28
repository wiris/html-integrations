# 006. Use Expect for automating TUI interaction

Date: 21-dec-2021

## Status

DRAFT

## Summary

*When publishing automatically to npm, we want to interact with Lerna*
*but we don't want to require human interaction.*
*We decided to use Expect*
*to automatically interact with the text-based user interface.*

## Context

Lerna (and other terminal tools) requires interaction via a TUI (text-based user interface) when publishing packages.
As part of our effort to automate this task, we need a way to interact with this TUI automatically (without human
intervention).

Different TUIs have different complexities: some of them only require entering text, while others have interactive menus
controlled with the arrow keys (as is the case of Lerna).

## Decision

We have decided to use Expect, as it is a tool designed with this purpose in mind and is lightweight in dependencies.

### Pros and Cons of the Options

#### Shell scripts

Shell scripting is a very powerful, but dangerous, solution.

- Good, because it doesn't any dependencies.
- Bad, because it is very hard to write robust scripts.
- Bad, because it is complicated to interact with the output of the TUI to automate.

#### Expect

[Expect][expect] is a tool for automating interactive applications such as telnet, ftp, passwd, fsck, rlogin, tip, etc...

- Good, because it is built with this purpose in mind
- Good, because the syntax is very readable and straightforward.
- Bad, because we have to learn a new language (Tcl/Expect) to use it.

#### Node scripts

The html-integrations repository already contains a few Node scripts used for similar automation tasks, so it wouldn't
be out of place to do this with JavaScript as well.

- Good, because we are already familiar with the language.
- Good, because it is very powerful.
- Bad, because it is not well-suited for interacting with the terminal.

## Consequences

Expect requires a simple apt-get install, and comes with many commands and utilities for dealing with the terminal and
TUIs in general. An implementation of the script that interacts with Lerna has already been designed and is pretty
readable and maintainable.

## Links

- [Expect][expect]

[expect]: https://core.tcl-lang.org/expect/index
