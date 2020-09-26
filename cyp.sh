#!/bin/sh


yarn start

yarn test:automation-run --headless  --browser chrome  --spec "cypress/e2e/suites/author/regrade/regression/settings/*.spec.js" 
