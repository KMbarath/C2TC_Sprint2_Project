This folder contains suggested fixes to resolve the Postgres duplicate PK error (user_id = 0) and example Spring JPA changes.

IMPORTANT: Make a database backup before running any SQL migration.

Files:
- fix-users-sequence.sql  : SQL script to create a sequence, assign new ids to rows with user_id = 0 and set default.
- SPRING_ENTITY_FIX.txt   : Example Java entity changes (add @GeneratedValue).

How to run SQL (psql):
1. Backup your DB.
2. Run:
   psql -h <host> -U <user> -d <dbname> -f fix-users-sequence.sql

After SQL run, restart your backend and test creating users again.

If you prefer I can also prepare a Liquibase/Flyway migration instead; tell me which you use.
