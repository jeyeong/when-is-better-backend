create table event
(
	event_id varchar(10) not null
		constraint event_pk
			primary key,
	creator varchar(100),
	event_name varchar(100),
	description text,
	available_times timestamp without time zone[],
	time_interval_min integer
);

create unique index event_event_id_uindex
	on event (event_id);

