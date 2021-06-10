#!/bin/bash

SEMVER_REGEX="^(0|[1-9][0-9]*)\\.(0|[1-9][0-9]*)\\.(0|[1-9][0-9]*)(\\-[0-9A-Za-z-]+(\\.[0-9A-Za-z-]+)*)?(\\+[0-9A-Za-z-]+(\\.[0-9A-Za-z-]+)*)?$"

COMMAND_REGEX="major|minor|patch|set"

function bump {
	oldVersion=$(node -p "require('./package.json').version")
	output=$(yarn version --${release} --no-git-tag-version)
	version=$(node -p "require('./package.json').version")
}

function setVer {
	oldVersion=$(node -p "require('./package.json').version")
	output=$(yarn version --new-version $1 --no-git-tag-version)
	version=$(node -p "require('./package.json').version")
}

function help {
	echo "Usage: ./$(basename $0) [<newversion> | major | minor | patch]"
}

if [[ ! "$1" =~ $COMMAND_REGEX ]] && [[ ! "$1" =~ $SEMVER_REGEX ]]; then
	help
	exit
fi

if [ -z "$1" ] || [ "$1" = "help" ]; then
	help
	exit
fi

release=$1

if [ -d ".git" ]; then
	prefix="Bump"

	if [[ "$1" =~ $SEMVER_REGEX ]]; then
	    prefix="Modify"
		setVer $1
	else
		bump 
	fi
	changes=$(git status --porcelain)
	if [ ! -z "${changes}" ]; then
		git add package.json
		git commit -m "chore: ${prefix} version from ${oldVersion} to ${version}"
		git tag -a "v${version}" -m "Release - old:${oldVersion} new:${version}"
		if [[ $* == *--push* ]]; then
			git push origin && git push origin --tags
		fi
	else
		echo "Working copy clean! Nothing to commit."
	fi
fi