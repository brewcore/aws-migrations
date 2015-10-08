# AWS Setup Scripts

> Warning: this is a proof-of-concept only, it's not stable or error-free.

Prerequisites:
- node / npm
- aws cli

To run:

- ```npm install```
- ```aws configure```
- ```node run.js up|down```

## How it works

Migrations are run in order from 1...n when going up, and n...1 when going down.

If an 'up' migration generates a JSON response from AWS, that response is stored in
./output and the data is made available to subsequent migrations.

**Example:**

Migration #1 creates a security group, and AWS returns the group id. This can be
referenced in later migrations as ```{{migration1.GroupId}}```.

## TODO

* Add error handling to stop migrations when AWS returns an error.
* Add wait/handling for operations that take time on AWS.
