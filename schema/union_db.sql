
-- creating database --
create database union_db;

-- creating User table --

create table union_db.users
(
email varchar(70) primary key not null,
pwd varchar(80),
salt varchar(15),
first_name varchar(45),
last_name varchar(45),
city varchar(45),
activation_tokekn varchar(20),
account_status tinyint,
regi_time timestamp default current_timestamp
);