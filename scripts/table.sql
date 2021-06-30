create table charging_station
(
    id bigserial not null,
    name varchar(255) not null,
    address varchar(255) not null,
    geometry geometry(Point, 4326) not null,
    source varchar(255)
);

create unique index table_name_id_uindex
	on table_name (id);

alter table table_name
    add constraint table_name_pk
        primary key (id);

