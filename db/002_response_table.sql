create table response
(
	response_id serial not null
		constraint response_pk
			primary key,
	name varchar(100),
	comments text,
	selected_times timestamp without time zone[],
	time_interval_min integer,
	event varchar(10)
		constraint response_event_event_id_fk
			references event
);