select k.id, t.name as "table", k.name, k.rkey, k."action"
from sys.keys k
 left join sys.tables t
  on k.table_id = t.id;