#publish evaluators
run command `yarn publish-evaluators`

#publish evaluator issue if current branch is ahead with commits

1.  git subtree split --prefix packages/evaluators -b `<new branch>`

2.  git checkout `<new branch>`

3.  git remote add evaluators git@github.com:snapwiz/edu-eval.git

4.  git push -f evaluators `<new branch>`:master

#Add last commit id in edu-api repo package.json dependencies
eg.
"@edulastic/evaluators":git+ssh://git@github.com:snapwiz/edu-eval#`<lastcommitid>`
