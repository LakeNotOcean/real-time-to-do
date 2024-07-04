CREATE OR REPLACE FUNCTION notify_trigger() RETURNS TRIGGER as $trigger$
DECLARE
    rec RECORD;
    dat RECORD;
    notify_chanel TEXT;
    fields_names TEXT[];
    field_name TEXT;
    new_column_value TEXT;
    old_column_value TEXT;
    new_payload_items jsonb;
    old_payload_items jsonb;
    payload TEXT;
BEGIN
    -- Set record row depending on operation
   CASE TG_OP
   WHEN 'UPDATE' THEN
      rec := NEW;
      dat := OLD;
   WHEN 'INSERT' THEN
      rec := NEW;
   WHEN 'DELETE' THEN
      rec := OLD;
   ELSE
      RAISE EXCEPTION 'Unknown TG_OP: "%". Should not occur!', TG_OP;
   END CASE;
   IF TG_ARGV[0] IS NULL THEN
      RAISE EXCEPTION 'not available notify_chanel';
   END IF;

   notify_chanel = TG_ARGV[0];
   new_payload_items := '{}'::jsonb;
   old_payload_items := '{}'::jsonb;

   IF TG_ARGV[1] IS NOT NULL THEN
      fields_names := array_remove(TG_ARGV,TG_ARGV[0]);
      FOREACH field_name IN ARRAY fields_names LOOP
         EXECUTE format('SELECT $1.%I::TEXT', field_name)
         INTO new_column_value
         USING rec;
         new_payload_items := new_payload_items || concat('{"', replace(field_name, '"', '\"'), '":"', replace(new_column_value, '"', '\"'), '"}' )::jsonb;
      END LOOP;
      IF TG_OP = 'UPDATE' THEN
         FOREACH field_name IN ARRAY fields_names LOOP
            EXECUTE format('SELECT $1.%I::TEXT', field_name)
            INTO old_column_value
            USING dat;
            old_payload_items := old_payload_items || concat('{"', replace(field_name, '"', '\"'), '":"', replace(old_column_value, '"', '\"'), '"}' )::jsonb;  
         END LOOP;
      END IF;
   ELSE
      new_payload_items := row_to_json(rec);
      old_payload_items := row_to_json(dat);
   END IF;
   -- Build the payload
   payload := json_build_object('timestamp',CURRENT_TIMESTAMP,'operation',LOWER(TG_OP),'schema',TG_TABLE_SCHEMA, 'table', TG_TABLE_NAME, 'newData', new_payload_items, 'oldData', old_payload_items);
   -- Notify the channel
   PERFORM pg_notify(notify_chanel, payload);
   RETURN rec;
END;
$trigger$ LANGUAGE plpgsql;

DROP TRIGGER tasks_notify ON tasks;


CREATE TRIGGER tasks_notify AFTER INSERT OR UPDATE ON tasks
FOR EACH ROW EXECUTE PROCEDURE notify_trigger('task_change','id','user_id','title','description','status');