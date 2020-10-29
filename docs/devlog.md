# Development Log for `Write`

## 10.21.2020, danb

Currently this is very much designed to be forked for a project, but if we provide the ability to specify a file or a glob to gulp then we could use this as something like an ehanced writing environment. 

Ie, I want to be able to open a markdown file from whereevers and run the various tasks against it from within the editor. Should be pretty easy to do. 
 
- [✓] add an arg to the gulp tasks to allow specifying the file to check. Might not apply to all tasks, but at least spelling and prose. 
- [✓] change the vs code tasks to allow for running them on the current editor. 

## 10.29.2020, danb

had to roll back to v12 node to keep the spellchecker working.  rawr! got the action working for individual files though.
We have a prose lint, but I think I'd like to have a task specificly for markdown linting. 

- add a gulp and vs task for linting the markdown